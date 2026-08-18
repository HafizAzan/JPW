"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { applicationService } from "@/services/application.service";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Application, Company, Job } from "@/types";

export default function ApplicationsPage() {
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<Application[]>([]);

  async function load(next = status) {
    const res = await applicationService.mine({ limit: 30, status: next || undefined });
    setItems(res.data.items);
  }

  useEffect(() => {
    load("");
  }, []);

  return (
    <div>
      <PageHeader title="Applied jobs" description="Track every conversation from applied to hired." />
      <div className="mb-5 flex flex-wrap gap-2">
        <Button size="sm" variant={status === "" ? "primary" : "outline"} onClick={() => { setStatus(""); load(""); }}>
          All
        </Button>
        {APPLICATION_STATUSES.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={status === item.value ? "primary" : "outline"}
            onClick={() => {
              setStatus(item.value);
              load(item.value);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="space-y-3">
        {items.map((app) => {
          const job = typeof app.job === "object" ? (app.job as Job) : null;
          const company = job && typeof job.company === "object" ? (job.company as Company) : null;
          return (
            <Card key={app._id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-2xl">{job?.title ?? "Role"}</p>
                <p className="text-sm text-muted-foreground">
                  {company?.name} · {formatDate(app.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge value={app.status} />
                {job ? (
                  <Link href={`/jobs/${job.slug || job._id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
      {items.length === 0 ? (
        <EmptyState title="No applications yet." description="Your applications will appear here." />
      ) : null}
    </div>
  );
}
