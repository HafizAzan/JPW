"use client";

import { useEffect, useState } from "react";
import { Ban, Briefcase, Check, Clock3, Eye, ExternalLink, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { JobDetailDrawer, companyOf, employerOf } from "@/components/admin/JobDetailDrawer";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/hooks/useToast";
import { formatDate, formatSalary, titleCase } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Job, JobStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: JobStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Live", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Closed", value: "closed" },
  { label: "Draft", value: "draft" },
];

export default function AdminJobsPage() {
  const { push } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Job | null>(null);
  const [pendingReject, setPendingReject] = useState<Job | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null);
  const [counts, setCounts] = useState({
    jobs: 0,
    live: 0,
    pending: 0,
    rejected: 0,
  });

  async function loadCounts() {
    const [stats, rejected] = await Promise.all([
      adminService.stats(),
      adminService.jobs({ status: "rejected", limit: 1 }),
    ]);
    setCounts({
      jobs: stats.data.jobs,
      live: stats.data.activeJobs,
      pending: stats.data.pendingJobs,
      rejected: rejected.data.pagination.total,
    });
  }

  async function loadList(showSpinner = true, nextPage = page, nextSearch = search, nextStatus = status) {
    if (showSpinner) setLoading(true);
    try {
      const res = await adminService.jobs({
        search: nextSearch.trim() || undefined,
        status: nextStatus || undefined,
        page: nextPage,
        limit: 12,
      });
      setJobs(res.data.items);
      setPages(res.data.pagination.pages);
      setTotal(res.data.pagination.total);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadList(true, 1, search, status);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  async function refresh() {
    await loadCounts();
    const res = await adminService.jobs({
      search: search.trim() || undefined,
      status: status || undefined,
      page,
      limit: 12,
    });
    if (res.data.items.length === 0 && page > 1) {
      setPage(1);
      await loadList(false, 1, search, status);
      return;
    }
    setJobs(res.data.items);
    setPages(res.data.pagination.pages);
    setTotal(res.data.pagination.total);
  }

  async function approve(job: Job) {
    setBusyId(job._id);
    try {
      await adminService.approveJob(job._id);
      push(`“${job.title}” is live`);
      setSelected((prev) => (prev && prev._id === job._id ? { ...prev, status: "approved" } : prev));
      await refresh();
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not approve job", "danger");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Moderation"
        title="Job moderation"
        description="Review listings before they appear on the public board."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All roles" value={counts.jobs} hint="Every listing on HireHub" icon={<Briefcase size={18} />} />
        <StatCard label="Pending" value={counts.pending} hint="Waiting on review" icon={<Clock3 size={18} />} />
        <StatCard label="Live" value={counts.live} hint="Visible to seekers" icon={<Eye size={18} />} />
        <StatCard label="Rejected" value={counts.rejected} hint="Not approved" icon={<Ban size={18} />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <SearchInput
          placeholder="Search by job title"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "role" : "roles"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((item) => (
          <Button
            key={item.label}
            size="sm"
            variant={status === item.value ? "primary" : "outline"}
            onClick={() => setStatus(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <LoadingState rows={4} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description={search || status ? "Try a different title or status." : "Employers have not posted any roles yet."}
        />
      ) : (
        <>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th className="px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Role</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Placement</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Employer</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Posted</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Status</th>
                    <th className="px-5 py-3.5 text-right text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const company = companyOf(job);
                    const employer = employerOf(job);
                    return (
                      <tr
                        key={job._id}
                        className="cursor-pointer border-b border-border last:border-b-0 odd:bg-muted/45 even:bg-transparent transition-colors duration-300 hover:bg-primary/8"
                        onClick={() => setSelected(job)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={company?.name} src={company?.logo?.url} />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{job.title}</p>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">{company?.name || "Company"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="truncate text-sm">{job.location}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {[titleCase(job.workplace), titleCase(job.jobType)].join(" · ")}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="truncate text-sm">{employer?.name || "—"}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{employer?.email || "No email"}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(job.createdAt)}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <StatusBadge value={job.status} />
                            <Badge>{titleCase(job.category)}</Badge>
                          </div>
                        </td>
                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <IconButton label="Details" onClick={() => setSelected(job)}>
                              <Eye size={15} />
                            </IconButton>
                            {job.status === "approved" ? (
                              <IconButton
                                label="View live"
                                onClick={() => window.open(`/jobs/${job.slug || job._id}`, "_blank", "noopener,noreferrer")}
                              >
                                <ExternalLink size={15} />
                              </IconButton>
                            ) : (
                              <IconButton
                                label="Approve"
                                variant="secondary"
                                loading={busyId === job._id}
                                onClick={() => approve(job)}
                              >
                                <Check size={15} />
                              </IconButton>
                            )}
                            {job.status !== "rejected" ? (
                              <IconButton
                                label="Reject"
                                disabled={busyId === job._id}
                                onClick={() => setPendingReject(job)}
                              >
                                <X size={15} />
                              </IconButton>
                            ) : null}
                            <IconButton
                              label="Delete"
                              variant="danger"
                              disabled={busyId === job._id}
                              onClick={() => setPendingDelete(job)}
                            >
                              <Trash2 size={15} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Pagination
            page={page}
            pages={pages}
            onPage={(next) => {
              setPage(next);
              loadList(true, next, search, status);
            }}
          />
        </>
      )}

      <JobDetailDrawer
        job={selected}
        busy={Boolean(selected && busyId === selected._id)}
        onClose={() => setSelected(null)}
        onApprove={approve}
        onReject={setPendingReject}
        onDelete={setPendingDelete}
      />

      <ConfirmDialog
        open={Boolean(pendingReject)}
        title="Reject this role?"
        description={`${pendingReject?.title} will not go live. The employer will be notified.`}
        confirmLabel="Reject"
        danger
        onClose={() => setPendingReject(null)}
        onConfirm={async () => {
          if (!pendingReject) return;
          const target = pendingReject;
          setPendingReject(null);
          setBusyId(target._id);
          try {
            await adminService.rejectJob(target._id);
            push(`“${target.title}” rejected`);
            setSelected((prev) => (prev && prev._id === target._id ? { ...prev, status: "rejected" } : prev));
            await refresh();
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not reject job", "danger");
          } finally {
            setBusyId(null);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this role?"
        description={`${pendingDelete?.title} will be removed from the platform. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          setPendingDelete(null);
          setBusyId(target._id);
          try {
            await adminService.deleteJob(target._id);
            push(`“${target.title}” deleted`);
            if (selected?._id === target._id) setSelected(null);
            await refresh();
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not delete job", "danger");
          } finally {
            setBusyId(null);
          }
        }}
      />
    </div>
  );
}
