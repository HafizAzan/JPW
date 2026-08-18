"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Building2, Camera, Globe, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";
import { companyService } from "@/services/company.service";
import { useToast } from "@/hooks/useToast";
import { COMPANY_SIZES } from "@/lib/constants";
import { initials } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Company } from "@/types";

export default function CompanyPage() {
  const { push } = useToast();
  const logoRef = useRef<HTMLInputElement>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    location: "",
    size: "11-50",
    foundedYear: "",
  });

  useEffect(() => {
    companyService
      .mine()
      .then((res) => {
        if (!res.data) return;
        setCompany(res.data);
        setForm({
          name: res.data.name,
          description: res.data.description ?? "",
          website: res.data.website ?? "",
          industry: res.data.industry ?? "",
          location: res.data.location ?? "",
          size: res.data.size ?? "11-50",
          foundedYear: res.data.foundedYear ? String(res.data.foundedYear) : "",
        });
      })
      .finally(() => setFetching(false));
  }, []);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const checks = [form.name, form.description, form.website, form.industry, form.location, form.size, form.foundedYear, company?.logo?.url];
  const complete = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  async function onUploadLogo(file: File) {
    if (!company) return;
    setLogoLoading(true);
    try {
      const res = await companyService.uploadLogo(company._id, file);
      setCompany(res.data);
      push("Logo updated");
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Logo upload needs Cloudinary", "danger");
    } finally {
      setLogoLoading(false);
      if (logoRef.current) logoRef.current.value = "";
    }
  }

  if (fetching) {
    return (
      <div className="grid gap-4 lg:gap-6">
        <PageHeader eyebrow="Workspace" title="My company" description="Create this before posting roles. Admin can later verify it." />
        <LoadingState rows={4} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Workspace"
        title="My company"
        description="This is how job seekers see your team. Fill it before you post roles."
        action={
          <Button form="company-form" loading={loading}>
            {company ? "Save company" : "Create company"}
          </Button>
        }
      />

      <Card className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div className="relative w-fit">
          {company?.logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo.url}
              alt={form.name || "Company logo"}
              className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/12 text-lg font-medium text-primary ring-1 ring-border">
              {initials(form.name || "Company")}
            </div>
          )}
          <button
            type="button"
            disabled={!company || logoLoading}
            onClick={() => logoRef.current?.click()}
            className="absolute -right-1 -bottom-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Change logo"
          >
            <Camera size={14} />
          </button>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUploadLogo(file);
            }}
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl tracking-tight">{form.name || "Your company"}</h2>
            {company?.verified ? <Badge tone="forest">Verified</Badge> : <Badge tone="gold">Unverified</Badge>}
            <Badge tone="copper">{complete}% complete</Badge>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {[form.industry, form.location].filter(Boolean).join(" · ") || "Add industry and location"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {logoLoading
              ? "Uploading logo…"
              : company
                ? "A clear logo and description help candidates trust your roles."
                : "Create the profile first. You can add a logo right after."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" disabled={!company || logoLoading} onClick={() => logoRef.current?.click()}>
            Change logo
          </Button>
          {company ? (
            <Link href={`/companies/${company._id}`}>
              <Button type="button" variant="outline" size="sm">
                View public page
              </Button>
            </Link>
          ) : null}
        </div>
      </Card>

      <form
        id="company-form"
        className="grid gap-4 lg:gap-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          const payload = {
            ...form,
            foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
          };
          try {
            const res = company
              ? await companyService.update(company._id, payload)
              : await companyService.create(payload);
            setCompany(res.data);
            push(company ? "Company updated" : "Company created");
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not save company", "danger");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Building2 size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">About the company</h2>
                <p className="mt-1 text-sm text-muted-foreground">Name, industry, and the story candidates read first.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Company name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
                <Input label="Industry" placeholder="Software, Fintech, Healthcare" value={form.industry} onChange={(e) => setField("industry", e.target.value)} />
              </div>
              <Textarea
                label="Description"
                hint="What you build, who you hire, and why people join."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <Globe size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Presence</h2>
                <p className="mt-1 text-sm text-muted-foreground">Where candidates find you.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Input
                label="Website"
                placeholder="https://company.com"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
              />
              <Input
                label="Location"
                placeholder="Karachi, PK"
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
            </div>
          </Card>
        </div>

        <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Users size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Team details</h2>
                <p className="mt-1 text-sm text-muted-foreground">Size and founding year show up on your public page.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Select
                label="Company size"
                options={COMPANY_SIZES.map((size) => ({ label: `${size} people`, value: size }))}
                value={form.size}
                onChange={(e) => setField("size", e.target.value)}
              />
              <Input
                label="Founded year"
                type="number"
                min={1800}
                max={new Date().getFullYear()}
                placeholder="2018"
                value={form.foundedYear}
                onChange={(e) => setField("foundedYear", e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Public profile</h2>
                <p className="mt-1 text-sm text-muted-foreground">A live preview of what seekers see.</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3">
                {company?.logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logo.url} alt="" className="h-11 w-11 rounded-xl object-cover" />
                ) : (
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-sm font-medium text-primary">
                    {initials(form.name || "C")}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium">{form.name || "Company name"}</p>
                  <p className="truncate text-xs text-muted-foreground">{form.industry || "Industry"}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                {form.description || "Your description will appear here for job seekers."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {form.location ? <Badge>{form.location}</Badge> : null}
                {form.size ? <Badge>{form.size} people</Badge> : null}
                {form.foundedYear ? <Badge>Founded {form.foundedYear}</Badge> : null}
                <Badge tone={company?.verified ? "forest" : "gold"}>{company?.verified ? "Verified" : "Pending verification"}</Badge>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {company
                ? "Admin verification is optional. Jobs can go live after this profile exists."
                : "Save once to create the company, then upload a logo and post roles."}
            </p>
          </Card>
        </div>

        <div className="flex justify-end lg:hidden">
          <Button loading={loading}>{company ? "Save company" : "Create company"}</Button>
        </div>
      </form>
    </div>
  );
}
