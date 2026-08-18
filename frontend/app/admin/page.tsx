"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Building2, Clock3, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { BarList } from "@/components/ui/BarList";
import { LoadingState } from "@/components/ui/LoadingState";
import { adminService, type AdminStats } from "@/services/admin.service";

export default function AdminHomePage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminService.stats().then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4">
        <PageHeader eyebrow="Overview" title="Platform pulse" description="People, companies, and hiring activity." />
        <LoadingState rows={4} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Overview"
        title="Platform pulse"
        description="A composed view of people, companies, and hiring activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard href="/admin/users" label="Users" value={stats.users} hint="Everyone on HireHub" icon={<Users size={18} />} />
        <StatCard href="/admin/companies" label="Companies" value={stats.companies} hint="Employer workspaces" icon={<Building2 size={18} />} />
        <StatCard href="/admin/jobs" label="Jobs" value={stats.jobs} hint="All posted roles" icon={<Briefcase size={18} />} />
        <StatCard href="/admin/applications" label="Applications" value={stats.applications} hint="Across the platform" icon={<Clock3 size={18} />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard href="/admin/users" label="Employers" value={stats.employers} />
        <StatCard href="/admin/users" label="Job seekers" value={stats.jobseekers} />
        <StatCard href="/admin/jobs" label="Active jobs" value={stats.activeJobs} />
        <StatCard href="/admin/jobs" label="Pending jobs" value={stats.pendingJobs} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Audience</p>
          <h2 className="mt-1 font-display text-2xl">People mix</h2>
          <div className="mt-5">
            <BarList
              items={[
                { label: "Job seekers", value: stats.jobseekers },
                { label: "Employers", value: stats.employers },
              ]}
            />
          </div>
        </Card>
        <Card>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Jobs</p>
          <h2 className="mt-1 font-display text-2xl">Listing mix</h2>
          <div className="mt-5">
            <BarList
              items={[
                { label: "Active jobs", value: stats.activeJobs },
                { label: "Pending jobs", value: stats.pendingJobs },
              ]}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/users", label: "Review users" },
          { href: "/admin/jobs", label: "Moderate jobs" },
          { href: "/admin/companies", label: "Companies" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-3xl border border-border bg-card px-5 py-4 text-sm font-medium shadow-soft transition duration-300 hover:border-primary/30 hover:bg-muted/40"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
