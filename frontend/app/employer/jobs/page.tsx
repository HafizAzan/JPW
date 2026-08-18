"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Ban, Briefcase, Clock, Copy, Eye, Pencil, Plus, Trash2, Users } from "lucide-react";
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
import { employerService } from "@/services/employer.service";
import { jobService } from "@/services/job.service";
import { useToast } from "@/hooks/useToast";
import { formatSalary, timeAgo, titleCase } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Job, JobStatus } from "@/types";

const FILTERS: { label: string; value: JobStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Live", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Draft", value: "draft" },
  { label: "Rejected", value: "rejected" },
  { label: "Closed", value: "closed" },
];

const PAGE_SIZE = 8;

export default function EmployerJobsPage() {
  const { push } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  async function load(showSpinner = true) {
    if (showSpinner) setLoading(true);
    try {
      const res = await employerService.jobs({ limit: 50 });
      setJobs(res.data.items);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      live: jobs.filter((job) => job.status === "approved").length,
      pending: jobs.filter((job) => job.status === "pending").length,
      closed: jobs.filter((job) => job.status === "closed").length,
    }),
    [jobs],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesStatus = status ? job.status === status : true;
      const matchesSearch = term
        ? [job.title, job.location, job.category, job.skills?.join(" ")].filter(Boolean).join(" ").toLowerCase().includes(term)
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [jobs, search, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function run(id: string, action: () => Promise<unknown>, success: string) {
    setBusyId(id);
    try {
      await action();
      push(success);
      await load(false);
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not update job", "danger");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Hiring"
        title="My jobs"
        description="Track every listing, send it for review, and manage who can still apply."
        action={
          <Link href="/employer/jobs/create">
            <Button>
              <Plus size={16} /> Create job
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All roles" value={stats.total} hint="Posted from this workspace" icon={<Briefcase size={18} />} />
        <StatCard label="Live" value={stats.live} hint="Visible to job seekers" icon={<Eye size={18} />} />
        <StatCard label="Pending" value={stats.pending} hint="Waiting on admin review" icon={<Clock size={18} />} />
        <StatCard label="Closed" value={stats.closed} hint="No longer accepting applicants" icon={<Ban size={18} />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <SearchInput
          placeholder="Search by title, city, or skill"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "role" : "roles"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.label}
            size="sm"
            variant={status === item.value ? "primary" : "outline"}
            onClick={() => {
              setStatus(item.value);
              setPage(1);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <LoadingState rows={4} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Create a company first, then post a role for review."
          action={
            <Link href="/employer/jobs/create">
              <Button>Create job</Button>
            </Link>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState title="No matching roles" description="Try a different status or search term." />
      ) : (
        <>
          <div className="grid gap-4">
            {visible.map((job) => (
              <Card key={job._id} className="grid gap-4 transition duration-300 hover:border-primary/30">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.18em] text-primary uppercase">{titleCase(job.category)}</p>
                    <h2 className="mt-1 font-display text-2xl leading-tight tracking-tight">{job.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[job.location, titleCase(job.workplace), titleCase(job.jobType)].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <StatusBadge value={job.status} />
                </div>

                {job.description ? (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Badge>{formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}</Badge>
                  {job.experienceLevel ? <Badge tone="forest">{titleCase(job.experienceLevel)}</Badge> : null}
                  {job.skills?.slice(0, 4).map((skill) => (
                    <Badge key={skill} tone="copper">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    {job.views ?? 0} views · Posted {timeAgo(job.createdAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {job.status === "approved" ? (
                      <Link href={`/jobs/${job.slug || job._id}`}>
                        <Button size="sm" variant="ghost">
                          View live
                        </Button>
                      </Link>
                    ) : null}
                    <Link href={`/employer/jobs/${job._id}/applicants`}>
                      <Button size="sm" variant="secondary">
                        <Users size={14} /> Applicants
                      </Button>
                    </Link>
                    <Link href={`/employer/jobs/${job._id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil size={14} /> Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      loading={busyId === job._id}
                      onClick={() => run(job._id, () => jobService.duplicate(job._id), "Job duplicated")}
                    >
                      <Copy size={14} /> Duplicate
                    </Button>
                    {job.status !== "closed" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busyId === job._id}
                        onClick={() => run(job._id, () => jobService.close(job._id), "Job closed")}
                      >
                        Close
                      </Button>
                    ) : null}
                    <Button size="sm" variant="ghost" disabled={busyId === job._id} onClick={() => setPendingDelete(job._id)}>
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={currentPage} pages={pages} onPage={setPage} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete job?"
        description="This removes the listing. Applicants will no longer see it."
        confirmLabel="Delete"
        danger
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const id = pendingDelete;
          setPendingDelete(null);
          await run(id, () => jobService.remove(id), "Job deleted");
        }}
      />
    </div>
  );
}
