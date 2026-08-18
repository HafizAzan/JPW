"use client";

import { useEffect, useState } from "react";
import { Briefcase, FileText, MapPin, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Application, Company, Job, User } from "@/types";

export function jobOf(app: Application) {
  return typeof app.job === "object" ? (app.job as Job) : null;
}

export function applicantOf(app: Application) {
  return typeof app.applicant === "object" ? (app.applicant as User) : null;
}

export function employerOfApp(app: Application) {
  return typeof app.employer === "object" ? (app.employer as User) : null;
}

export function ApplicationDetailDrawer({
  application,
  busy,
  onClose,
  onDelete,
}: {
  application: Application | null;
  busy?: boolean;
  onClose: () => void;
  onDelete?: (application: Application) => void;
}) {
  const [detail, setDetail] = useState<Application | null>(application);

  useEffect(() => {
    if (application) setDetail(application);
  }, [application]);

  const current = detail;
  const job = current ? jobOf(current) : null;
  const person = current ? applicantOf(current) : null;
  const employer = current ? employerOfApp(current) : null;
  const company = job && typeof job.company === "object" ? (job.company as Company) : null;

  return (
    <Drawer
      open={Boolean(application)}
      onClose={onClose}
      eyebrow="Pipeline"
      title="Application details"
      labelledBy="application-detail-title"
      footer={
        current ? (
          <>
            {job ? (
              <a href={job.slug || job._id ? `/jobs/${job.slug || job._id}` : "#"} target="_blank" rel="noreferrer">
                <Button variant="outline">View job</Button>
              </a>
            ) : null}
            {current.resume?.url ? (
              <a href={current.resume.url} target="_blank" rel="noreferrer">
                <Button variant="outline">Open resume</Button>
              </a>
            ) : null}
            {onDelete ? (
              <Button variant="ghost" disabled={busy} onClick={() => onDelete(current)}>
                Delete
              </Button>
            ) : null}
            <Button onClick={onClose}>Done</Button>
          </>
        ) : null
      }
    >
      {current ? (
        <>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <Avatar name={person?.name} src={person?.avatar?.url} size="lg" />
              <div className="min-w-0">
                <h3 className="font-display text-2xl leading-tight">{person?.name || "Applicant"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{person?.headline || person?.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge value={current.status} />
                  {person?.location ? <Badge>{person.location}</Badge> : null}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-5 grid gap-3 rounded-3xl border border-border bg-card p-5 sm:grid-cols-2">
            <div className="flex items-start gap-3 sm:col-span-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Briefcase size={16} />
              </span>
              <div>
                <h4 className="font-medium">Role</h4>
                <p className="text-xs text-muted-foreground">The listing this person applied to.</p>
              </div>
            </div>
            <p className="text-sm sm:col-span-2">
              <span className="text-muted-foreground">Job</span>
              <br />
              {job?.title || "Role"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Company</span>
              <br />
              {company?.name || "—"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Location</span>
              <br />
              {job?.location || "—"}
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <UserRound size={16} />
              </span>
              <div>
                <h4 className="font-medium">Employer</h4>
                <p className="mt-1 text-sm">{employer?.name || "Hiring team"}</p>
                <p className="text-sm text-muted-foreground">{employer?.email || "No email"}</p>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <MapPin size={16} />
              </span>
              <div>
                <h4 className="font-medium">Contact</h4>
                <p className="mt-1 text-sm">{person?.email || "No email"}</p>
                <p className="text-sm text-muted-foreground">Applied {formatDate(current.createdAt)}</p>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <FileText size={16} />
              </span>
              <div>
                <h4 className="font-medium">Cover letter</h4>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {current.coverLetter || "No cover letter included."}
            </p>
            {current.resume?.url ? (
              <a href={current.resume.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-primary hover:text-primary-strong">
                Open attached resume
              </a>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No resume attached.</p>
            )}
          </section>
        </>
      ) : null}
    </Drawer>
  );
}
