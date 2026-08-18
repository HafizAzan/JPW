"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Briefcase, Building2, FileText, MessageSquare, Search, UserRound } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { JobCard } from "@/components/jobs/JobCard";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingState } from "@/components/ui/LoadingState";
import { applicationService } from "@/services/application.service";
import { userService } from "@/services/user.service";
import { companyService } from "@/services/company.service";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/format";
import type { Application, Company, Job } from "@/types";

export default function SeekerDashboardPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [saved, setSaved] = useState(0);
  const [recommended, setRecommended] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationService.mine({ limit: 20 }),
      userService.savedJobs(),
      userService.recommended(),
      companyService.list({ limit: 50 }),
    ])
      .then(([a, s, r, c]) => {
        setApps(a.data.items);
        setSaved(s.data.pagination.total);
        setRecommended(r.data);
        setCompanies(c.data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  const interviews = apps.filter((app) => app.status === "interview").length;
  const resumeCount = user?.resumes?.length || (user?.resume?.url ? 1 : 0);
  const checks = [user?.headline, user?.bio, user?.skills?.length, resumeCount, user?.location];
  const complete = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome, ${user?.name.split(" ")[0] ?? "there"}`}
        description="A clear snapshot of applications, saved roles, and jobs that fit you."
      />

      <Card className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <Avatar name={user?.name} src={user?.avatar?.url} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl tracking-tight">{user?.name}</h2>
            <Badge tone="copper">Job seeker</Badge>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user?.headline || user?.email}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Profile {complete}% complete
            {resumeCount ? ` · ${resumeCount} resume${resumeCount === 1 ? "" : "s"}` : " · add a resume to apply"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/profile">
            <Button variant="outline" size="sm">
              Edit profile
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="sm">Find jobs</Button>
          </Link>
        </div>
      </Card>

      {loading ? (
        <LoadingState rows={3} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard href="/dashboard/applications" label="Applied" value={apps.length} hint="Open applications" icon={<Briefcase size={18} />} />
            <StatCard href="/dashboard/saved-jobs" label="Saved" value={saved} hint="Roles you bookmarked" icon={<Bookmark size={18} />} />
            <StatCard href="/dashboard/applications" label="Interviews" value={interviews} hint="In conversation" icon={<MessageSquare size={18} />} />
            <StatCard href="/dashboard/companies" label="Companies" value={companies.length} hint="Teams hiring on HireHub" icon={<Building2 size={18} />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <Card className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.18em] text-primary uppercase">Activity</p>
                  <h2 className="mt-1 font-display text-2xl">Recent applications</h2>
                </div>
                <Link href="/dashboard/applications" className="text-sm text-primary transition-colors hover:text-primary-strong">
                  View all
                </Link>
              </div>
              {apps.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    title="No applications yet"
                    description="When you apply, every status will show up here."
                    action={
                      <Link href="/jobs">
                        <Button size="sm">Browse jobs</Button>
                      </Link>
                    }
                  />
                </div>
              ) : (
                <ul className="mt-5 grid gap-3">
                  {apps.slice(0, 5).map((app) => {
                    const job = typeof app.job === "object" ? (app.job as Job) : null;
                    const company = job && typeof job.company === "object" ? (job.company as Company) : null;
                    return (
                      <li key={app._id}>
                        <Link
                          href={job ? `/jobs/${job.slug || job._id}` : "/dashboard/applications"}
                          className="grid gap-2 rounded-2xl border border-border px-4 py-3 transition duration-300 hover:border-primary/30 hover:bg-muted/40 sm:grid-cols-[1fr_auto] sm:items-center"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">{job?.title ?? "Role"}</p>
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                              {[company?.name, formatDate(app.createdAt)].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                          <StatusBadge value={app.status} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card className="min-w-0">
              <p className="text-xs tracking-[0.18em] text-primary uppercase">Shortcuts</p>
              <h2 className="mt-1 font-display text-2xl">Quick actions</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {[
                  { href: "/jobs", label: "Search jobs", copy: "Filter by role, city, or type", icon: Search },
                  { href: "/dashboard/profile", label: "Update profile", copy: "Skills and experience", icon: UserRound },
                  { href: "/dashboard/resume", label: "Manage resumes", copy: "Preview and set active CV", icon: FileText },
                  { href: "/dashboard/companies", label: "Browse companies", copy: "See every team hiring", icon: Building2 },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-border p-4 transition duration-300 hover:border-primary/30 hover:bg-muted/40"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-primary">
                      <item.icon size={16} />
                    </span>
                    <p className="mt-3 text-sm font-medium">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.copy}</p>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.18em] text-primary uppercase">For you</p>
                <h2 className="mt-1 font-display text-3xl">Recommended jobs</h2>
              </div>
              <Link href="/jobs" className="text-sm text-primary transition-colors hover:text-primary-strong">
                Browse all
              </Link>
            </div>
            {recommended.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No recommendations yet" description="Add skills on your profile to surface better matches." />
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommended.slice(0, 6).map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.18em] text-primary uppercase">Hiring now</p>
                <h2 className="mt-1 font-display text-3xl">Companies</h2>
              </div>
              <Link href="/dashboard/companies" className="text-sm text-primary transition-colors hover:text-primary-strong">
                View all
              </Link>
            </div>
            {companies.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No companies yet" description="Employers will appear here after they create a profile." />
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {companies.slice(0, 6).map((company) => (
                  <CompanyCard key={company._id} company={company} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
