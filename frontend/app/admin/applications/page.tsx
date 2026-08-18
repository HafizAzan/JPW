"use client";

import { useEffect, useState } from "react";
import { Briefcase, CheckCircle2, Eye, FileText, MessageSquare, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApplicationDetailDrawer, applicantOf, employerOfApp, jobOf } from "@/components/admin/ApplicationDetailDrawer";
import { adminService } from "@/services/admin.service";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";
import type { Application, ApplicationStatus, Company } from "@/types";

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Application | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Application | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [counts, setCounts] = useState({ total: 0, interview: 0, hired: 0, rejected: 0 });
  const { push } = useToast();

  async function loadCounts() {
    const [stats, interview, hired, rejected] = await Promise.all([
      adminService.stats(),
      adminService.applications({ status: "interview", limit: 1 }),
      adminService.applications({ status: "hired", limit: 1 }),
      adminService.applications({ status: "rejected", limit: 1 }),
    ]);
    setCounts({
      total: stats.data.applications,
      interview: interview.data.pagination.total,
      hired: hired.data.pagination.total,
      rejected: rejected.data.pagination.total,
    });
  }

  async function loadList(showSpinner = true, nextPage = page, nextSearch = search, nextStatus = status) {
    if (showSpinner) setLoading(true);
    try {
      const res = await adminService.applications({
        search: nextSearch.trim() || undefined,
        status: nextStatus || undefined,
        page: nextPage,
        limit: 12,
      });
      setItems(res.data.items);
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

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Applications"
        description="A platform-wide view of hiring conversations across every employer."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All applications" value={counts.total} hint="Every conversation on HireHub" icon={<Users size={18} />} />
        <StatCard label="Interviews" value={counts.interview} hint="In conversation" icon={<MessageSquare size={18} />} />
        <StatCard label="Hired" value={counts.hired} hint="Closed successfully" icon={<CheckCircle2 size={18} />} />
        <StatCard label="Rejected" value={counts.rejected} hint="Not moving forward" icon={<Briefcase size={18} />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <SearchInput
          placeholder="Search by applicant or job title"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "application" : "applications"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={status === "" ? "primary" : "outline"} onClick={() => setStatus("")}>
          All
        </Button>
        {APPLICATION_STATUSES.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={status === item.value ? "primary" : "outline"}
            onClick={() => setStatus(item.value as ApplicationStatus)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <LoadingState rows={4} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={search || status ? "Try a different name, role, or status." : "Applications will appear here as people apply."}
        />
      ) : (
        <>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th className="px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Applicant</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Role</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Employer</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Applied</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Status</th>
                    <th className="px-5 py-3.5 text-right text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((app) => {
                    const job = jobOf(app);
                    const person = applicantOf(app);
                    const employer = employerOfApp(app);
                    const company = job && typeof job.company === "object" ? (job.company as Company) : null;
                    return (
                      <tr
                        key={app._id}
                        className="cursor-pointer border-b border-border last:border-b-0 odd:bg-muted/45 even:bg-transparent transition-colors duration-300 hover:bg-primary/8"
                        onClick={() => setSelected(app)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={person?.name} src={person?.avatar?.url} />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{person?.name || "Applicant"}</p>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">{person?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="truncate text-sm">{job?.title || "Role"}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{company?.name || job?.location || "—"}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="truncate text-sm">{employer?.name || "—"}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{employer?.email || "No email"}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(app.createdAt)}</td>
                        <td className="px-4 py-4">
                          <StatusBadge value={app.status} />
                        </td>
                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <IconButton label="Details" onClick={() => setSelected(app)}>
                              <Eye size={15} />
                            </IconButton>
                            {app.resume?.url ? (
                              <IconButton
                                label="Open resume"
                                onClick={() => window.open(app.resume?.url, "_blank", "noopener,noreferrer")}
                              >
                                <FileText size={15} />
                              </IconButton>
                            ) : null}
                            {job ? (
                              <IconButton
                                label="View job"
                                onClick={() => window.open(`/jobs/${job.slug || job._id}`, "_blank", "noopener,noreferrer")}
                              >
                                <Briefcase size={15} />
                              </IconButton>
                            ) : null}
                            <IconButton
                              label="Delete"
                              variant="danger"
                              loading={busyId === app._id}
                              onClick={() => setPendingDelete(app)}
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

      <ApplicationDetailDrawer
        application={selected}
        busy={Boolean(selected && busyId === selected._id)}
        onClose={() => setSelected(null)}
        onDelete={setPendingDelete}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this application?"
        description={
          pendingDelete
            ? `${applicantOf(pendingDelete)?.name || "This applicant"}’s application for ${jobOf(pendingDelete)?.title || "this role"} will be removed. This cannot be undone.`
            : "This application will be removed. This cannot be undone."
        }
        confirmLabel="Delete"
        danger
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          setPendingDelete(null);
          setBusyId(target._id);
          try {
            await adminService.deleteApplication(target._id);
            push("Application deleted");
            if (selected?._id === target._id) setSelected(null);
            await Promise.all([loadList(false), loadCounts()]);
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not delete application", "danger");
          } finally {
            setBusyId(null);
          }
        }}
      />
    </div>
  );
}
