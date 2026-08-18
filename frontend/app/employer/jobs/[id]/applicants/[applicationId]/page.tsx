"use client";

import { use, useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { applicationService } from "@/services/application.service";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { useToast } from "@/hooks/useToast";
import type { Application, ApplicationStatus, User } from "@/types";

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const { push } = useToast();
  const [app, setApp] = useState<Application | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("applied");

  useEffect(() => {
    applicationService.get(applicationId).then((res) => {
      setApp(res.data);
      setStatus(res.data.status);
      setNote(res.data.recruiterNote ?? "");
    });
  }, [applicationId]);

  if (!app) return <p className="text-muted-foreground">Loading applicant…</p>;
  const person = typeof app.applicant === "object" ? (app.applicant as User) : null;

  return (
    <div>
      <PageHeader title={person?.name ?? "Applicant"} description={person?.headline || person?.email} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl">Profile</h2>
          <p className="mt-3 text-sm text-muted-foreground">{person?.bio}</p>
          <p className="mt-4 text-sm">{person?.skills?.join(" · ")}</p>
          <div className="mt-4 space-y-2 text-sm">
            {person?.experience?.map((item) => (
              <p key={item._id ?? item.title}>
                {item.title} · {item.company}
              </p>
            ))}
          </div>
          {app.resume?.url ? (
            <a href={app.resume.url} className="mt-4 inline-block text-sm text-primary" target="_blank" rel="noreferrer">
              View resume
            </a>
          ) : null}
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Application</h2>
            <StatusBadge value={app.status} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{app.coverLetter || "No cover letter."}</p>
          <Select
            className="mt-4"
            label="Status"
            options={APPLICATION_STATUSES}
            value={status}
            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
          />
          <Textarea
            className="mt-4"
            label="Private recruiter note"
            hint="Never shown to the candidate."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button
            className="mt-4"
            onClick={async () => {
              await applicationService.updateStatus(app._id, status, note);
              push("Application updated");
            }}
          >
            Save review
          </Button>
        </Card>
      </div>
    </div>
  );
}
