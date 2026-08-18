"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { applicationService } from "@/services/application.service";
import { APPLICATION_STATUSES } from "@/lib/constants";
import type { Application, ApplicationStatus, User } from "@/types";

export default function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [items, setItems] = useState<Application[]>([]);

  async function load() {
    const res = await applicationService.forJob(id, { limit: 40 });
    setItems(res.data.items);
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <div>
      <PageHeader title="Applicants" description="Review profiles and move people through the hiring loop." />
      <div className="space-y-3">
        {items.map((app) => {
          const person = typeof app.applicant === "object" ? (app.applicant as User) : null;
          return (
            <Card key={app._id} className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-display text-2xl">{person?.name}</p>
                <p className="text-sm text-muted-foreground">{person?.email}</p>
                <p className="mt-2 text-sm">{person?.skills?.join(" · ")}</p>
                {app.coverLetter ? <p className="mt-2 text-sm text-ink-soft">{app.coverLetter}</p> : null}
                {app.resume?.url ? (
                  <a href={app.resume.url} className="mt-2 inline-block text-sm text-copper" target="_blank" rel="noreferrer">
                    View resume
                  </a>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/employer/jobs/${id}/applicants/${app._id}`}>
                  <Button size="sm" variant="outline">
                    View profile
                  </Button>
                </Link>
                <StatusBadge value={app.status} />
                <Select
                  options={APPLICATION_STATUSES}
                  value={app.status}
                  onChange={async (e) => {
                    await applicationService.updateStatus(app._id, e.target.value as ApplicationStatus);
                    load();
                  }}
                />
              </div>
            </Card>
          );
        })}
      </div>
      {items.length === 0 ? <EmptyState title="No applicants yet" description="When someone applies, they will appear here." /> : null}
    </div>
  );
}
