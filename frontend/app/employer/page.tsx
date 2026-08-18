"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle2, Eye, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BarList } from "@/components/ui/BarList";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { employerService, type EmployerAnalytics } from "@/services/employer.service";

export default function EmployerHomePage() {
  const [data, setData] = useState<EmployerAnalytics | null>(null);

  useEffect(() => {
    employerService.analytics().then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <div className="grid gap-4">
        <PageHeader eyebrow="Overview" title="Hiring overview" description="Views, applications, and outcomes across your roles." />
        <LoadingState rows={4} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Overview"
        title="Hiring overview"
        description="Views, applications, and outcomes across your roles."
        action={
          <Link href="/employer/jobs/create">
            <Button size="sm">Post a job</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard href="/employer/jobs" label="Total jobs" value={data.totals.jobs} hint="All roles you posted" icon={<Briefcase size={18} />} />
        <StatCard href="/employer/jobs" label="Applications" value={data.totals.applications} hint="People in your pipeline" icon={<Users size={18} />} />
        <StatCard label="Shortlisted" value={data.totals.shortlisted} hint="Ready for next step" icon={<Eye size={18} />} />
        <StatCard label="Hired" value={data.totals.hired} hint="Closed successfully" icon={<CheckCircle2 size={18} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Funnel</p>
          <h2 className="mt-1 font-display text-2xl">Pipeline</h2>
          <div className="mt-5">
            <BarList
              items={[
                { label: "Applications", value: data.totals.applications },
                { label: "Shortlisted", value: data.totals.shortlisted },
                { label: "Interviews", value: data.totals.interview },
                { label: "Hired", value: data.totals.hired },
              ]}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-primary uppercase">Roles</p>
              <h2 className="mt-1 font-display text-2xl">Job performance</h2>
            </div>
            <Link href="/employer/jobs" className="text-sm text-primary transition-colors hover:text-primary-strong">
              Manage jobs
            </Link>
          </div>
          {data.jobs.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No jobs yet"
                description="Create a role to start receiving applicants."
                action={
                  <Link href="/employer/jobs/create">
                    <Button size="sm">Create job</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {data.jobs.slice(0, 6).map((job) => (
                <Link
                  key={job._id}
                  href={`/employer/jobs/${job._id}/applicants`}
                  className="grid gap-3 rounded-2xl border border-border px-4 py-3 transition duration-300 hover:border-primary/30 hover:bg-muted/40 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{job.title}</p>
                    <div className="mt-1">
                      <StatusBadge value={job.status} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{job.views} views</p>
                  <p className="text-sm">{job.applications} applied</p>
                  <p className="text-sm">{job.hired} hired</p>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
