"use client";

import { useEffect, useState } from "react";
import { Building2, ExternalLink, Globe, ShieldCheck, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatDate } from "@/lib/format";
import type { Company, User } from "@/types";

export function ownerOf(company: Company) {
  return typeof company.owner === "object" ? (company.owner as User) : null;
}

export function CompanyDetailDrawer({
  company,
  busy,
  onClose,
  onVerify,
  onDelete,
}: {
  company: Company | null;
  busy: boolean;
  onClose: () => void;
  onVerify: (company: Company) => void;
  onDelete: (company: Company) => void;
}) {
  const [detail, setDetail] = useState<Company | null>(company);

  useEffect(() => {
    if (company) setDetail(company);
  }, [company]);

  const current = detail;
  const owner = current ? ownerOf(current) : null;
  const site = current?.website
    ? current.website.startsWith("http")
      ? current.website
      : `https://${current.website}`
    : null;

  return (
    <Drawer
      open={Boolean(company)}
      onClose={onClose}
      eyebrow="Moderation"
      title="Company details"
      labelledBy="company-detail-title"
      footer={
        current ? (
          <>
            <a href={`/companies/${current._id}`} target="_blank" rel="noreferrer">
              <Button variant="outline">
                <ExternalLink size={14} /> View public page
              </Button>
            </a>
            {!current.verified ? (
              <Button variant="secondary" loading={busy} onClick={() => onVerify(current)}>
                <ShieldCheck size={14} /> Verify
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
              <Avatar name={current.name} src={current.logo?.url} size="lg" />
              <div className="min-w-0">
                <h3 className="font-display text-2xl leading-tight">{current.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{current.industry || "Industry not set"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {current.verified ? <Badge tone="forest">Verified</Badge> : <Badge tone="gold">Unverified</Badge>}
                  {current.size ? <Badge>{current.size} people</Badge> : null}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {current.description || "No description added yet."}
          </p>

          <section className="mt-5 grid gap-3 rounded-3xl border border-border bg-card p-5 sm:grid-cols-2">
            <div className="flex items-start gap-3 sm:col-span-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <Building2 size={16} />
              </span>
              <div>
                <h4 className="font-medium">Profile</h4>
                <p className="text-xs text-muted-foreground">What seekers see on the public page.</p>
              </div>
            </div>
            <p className="text-sm">
              <span className="text-muted-foreground">Location</span>
              <br />
              {current.location || "Not added"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Founded</span>
              <br />
              {current.foundedYear || "Not added"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Size</span>
              <br />
              {current.size ? `${current.size} people` : "Not added"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Joined</span>
              <br />
              {formatDate(current.createdAt)}
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Globe size={16} />
              </span>
              <div className="min-w-0">
                <h4 className="font-medium">Website</h4>
                {site ? (
                  <a href={site} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-primary hover:text-primary-strong">
                    {current.website}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Not added</p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Users size={16} />
              </span>
              <div>
                <h4 className="font-medium">Owner</h4>
                <p className="mt-1 text-sm">{owner?.name || "Employer"}</p>
                <p className="text-sm text-muted-foreground">{owner?.email || "No email"}</p>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </Drawer>
  );
}
