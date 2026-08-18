"use client";

import { useEffect, useState } from "react";
import { Briefcase, Check, Clock, ExternalLink, MapPin, Sparkles, Wallet } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatSalary, titleCase } from "@/lib/format";
import type { Company, Job, User } from "@/types";

export function companyOf(job: Job) {
  return typeof job.company === "object" ? (job.company as Company) : null;
}

export function employerOf(job: Job) {
  return typeof job.employer === "object" ? (job.employer as User) : null;
}

export function JobDetailDrawer({
  job,
  busy,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: {
  job: Job | null;
  busy: boolean;
  onClose: () => void;
  onApprove: (job: Job) => void;
  onReject: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  const [detail, setDetail] = useState<Job | null>(job);

  useEffect(() => {
    if (job) setDetail(job);
  }, [job]);

  const current = detail;
  const company = current ? companyOf(current) : null;
  const employer = current ? employerOf(current) : null;

  return (
    <Drawer
      open={Boolean(job)}
      onClose={onClose}
      eyebrow="Moderation"
      title="Role details"
      labelledBy="job-detail-title"
      footer={
        current ? (
          <>
            {current.status === "approved" ? (
              <a href={`/jobs/${current.slug || current._id}`} target="_blank" rel="noreferrer">
                <Button variant="outline">
                  <ExternalLink size={14} /> View live
                </Button>
              </a>
            ) : null}
            {current.status !== "approved" ? (
              <Button variant="secondary" loading={busy} onClick={() => onApprove(current)}>
                <Check size={14} /> Approve
              </Button>
            ) : null}
            {current.status !== "rejected" ? (
              <Button variant="outline" disabled={busy} onClick={() => onReject(current)}>
                Reject
              </Button>
            ) : null}
            <Button variant="ghost" disabled={busy} onClick={() => onDelete(current)}>
              Delete
            </Button>
            <Button onClick={onClose}>Done</Button>
          </>
        ) : null
      }
    >
      {current ? (
        <>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <Avatar name={company?.name} src={company?.logo?.url} size="lg" />
              <div className="min-w-0">
                <h3 className="font-display text-2xl leading-tight">{current.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{company?.name || "Company"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge value={current.status} />
                  <Badge>{titleCase(current.category)}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{current.location}</Badge>
            <Badge tone="forest">{titleCase(current.workplace)}</Badge>
            <Badge tone="copper">{titleCase(current.jobType)}</Badge>
            {current.experienceLevel ? <Badge>{titleCase(current.experienceLevel)}</Badge> : null}
          </div>

          <section className="mt-5 grid gap-3 rounded-3xl border border-border bg-card p-5 sm:grid-cols-2">
            <div className="flex items-start gap-3 sm:col-span-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <Wallet size={16} />
              </span>
              <div>
                <h4 className="font-medium">Listing facts</h4>
                <p className="text-xs text-muted-foreground">What seekers see on the public page.</p>
              </div>
            </div>
            <p className="text-sm">
              <span className="text-muted-foreground">Salary</span>
              <br />
              {formatSalary(current.salary?.min, current.salary?.max, current.salary?.currency)}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Deadline</span>
              <br />
              {current.deadline ? formatDate(current.deadline) : "None"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Posted</span>
              <br />
              {formatDate(current.createdAt)}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Views</span>
              <br />
              {current.views ?? 0}
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <MapPin size={16} />
              </span>
              <div>
                <h4 className="font-medium">Posted by</h4>
                <p className="mt-1 text-sm">{employer?.name || "Employer"}</p>
                <p className="text-sm text-muted-foreground">{employer?.email || "No email"}</p>
              </div>
            </div>
          </section>

          <section className="mt-4">
            <p className="text-xs tracking-[0.18em] text-primary uppercase">Description</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {current.description || "No description provided."}
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Sparkles size={16} />
              </span>
              <div>
                <h4 className="font-medium">Skills</h4>
                <p className="text-xs text-muted-foreground">Tagged for search and matching.</p>
              </div>
            </div>
            {current.skills?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {current.skills.map((skill) => (
                  <Badge key={skill} tone="copper">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No skills listed.</p>
            )}
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Briefcase size={16} />
              </span>
              <div>
                <h4 className="font-medium">Responsibilities</h4>
              </div>
            </div>
            {current.responsibilities?.length ? (
              <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm text-muted-foreground">
                {current.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">None listed.</p>
            )}
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <Clock size={16} />
              </span>
              <div>
                <h4 className="font-medium">Requirements</h4>
              </div>
            </div>
            {current.requirements?.length ? (
              <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm text-muted-foreground">
                {current.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">None listed.</p>
            )}
          </section>
        </>
      ) : null}
    </Drawer>
  );
}
