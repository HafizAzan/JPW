"use client";

import { useState } from "react";
import { Briefcase, ClipboardList, ListChecks, MapPin, Sparkles, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES, EXPERIENCE_LEVELS, JOB_TYPES, WORKPLACES } from "@/lib/constants";
import { formatSalary, titleCase } from "@/lib/format";
import { aiService } from "@/services/ai.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";
import { ollamaChat, ollamaConfig, parseJsonObject } from "@/lib/ollama";
import type { Job } from "@/types";

export type JobFormValues = {
  title: string;
  description: string;
  location: string;
  workplace: string;
  jobType: string;
  experienceLevel: string;
  category: string;
  skills: string;
  responsibilities: string;
  requirements: string;
  min: string;
  max: string;
  deadline: string;
};

export function valuesFromJob(job?: Job | null): JobFormValues {
  return {
    title: job?.title ?? "",
    description: job?.description ?? "",
    location: job?.location ?? "",
    workplace: job?.workplace ?? "onsite",
    jobType: job?.jobType ?? "full-time",
    experienceLevel: job?.experienceLevel ?? "mid",
    category: job?.category ?? "development",
    skills: job?.skills?.join(", ") ?? "",
    responsibilities: job?.responsibilities?.join("\n") ?? "",
    requirements: job?.requirements?.join("\n") ?? "",
    min: job?.salary?.min ? String(job.salary.min) : "",
    max: job?.salary?.max ? String(job.salary.max) : "",
    deadline: job?.deadline ? job.deadline.slice(0, 10) : "",
  };
}

export function toPayload(values: JobFormValues) {
  return {
    title: values.title,
    description: values.description,
    location: values.location,
    workplace: values.workplace,
    jobType: values.jobType,
    experienceLevel: values.experienceLevel,
    category: values.category,
    skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
    responsibilities: values.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
    requirements: values.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
    salary: { min: Number(values.min) || 0, max: Number(values.max) || 0, currency: "USD" },
    deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
    remote: values.workplace === "remote",
  };
}

function SectionTitle({
  icon: Icon,
  title,
  copy,
  tone = "primary",
}: {
  icon: typeof Briefcase;
  title: string;
  copy: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={
          tone === "secondary"
            ? "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary"
            : "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary"
        }
      >
        <Icon size={18} />
      </span>
      <div>
        <h2 className="font-display text-2xl leading-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
      </div>
    </div>
  );
}

export function JobForm({
  initial,
  submitLabel,
  onSubmit,
  formId = "job-form",
  onBusy,
}: {
  initial?: Job | null;
  submitLabel: string;
  onSubmit: (payload: ReturnType<typeof toPayload>) => Promise<void>;
  formId?: string;
  onBusy?: (busy: boolean) => void;
}) {
  const [values, setValues] = useState(valuesFromJob(initial));
  const [loading, setLoading] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const { user } = useAuth();
  const { push } = useToast();

  function set<K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const skills = values.skills.split(",").map((item) => item.trim()).filter(Boolean);
  const checks = [
    values.title.length >= 3,
    values.description.length >= 20,
    values.location,
    values.category,
    skills.length,
    values.responsibilities,
    values.requirements,
    values.min || values.max,
    values.deadline,
  ];
  const complete = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const salaryPreview = formatSalary(Number(values.min) || undefined, Number(values.max) || undefined);

  return (
    <form
      id={formId}
      className="grid gap-4 lg:gap-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        onBusy?.(true);
        try {
          await onSubmit(toPayload(values));
        } finally {
          setLoading(false);
          onBusy?.(false);
        }
      }}
    >
      <Card className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl tracking-tight">{values.title || "Untitled role"}</h2>
            <Badge tone="gold">Pending review</Badge>
            <Badge tone="copper">{complete}% complete</Badge>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {[values.location || "Location", titleCase(values.workplace), titleCase(values.jobType)].join(" · ")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Admins approve listings before they go live for job seekers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {values.category ? <Badge>{titleCase(values.category)}</Badge> : null}
          {values.experienceLevel ? <Badge tone="forest">{titleCase(values.experienceLevel)}</Badge> : null}
        </div>
      </Card>

      <div className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-6">
        <Card className="lg:col-span-2">
          <SectionTitle icon={Briefcase} title="The role" copy="Title and a description candidates read first." />
          <div className="mt-6 grid gap-4">
            <Input
              label="Job title"
              placeholder="Senior Frontend Engineer"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="text-sm font-medium text-foreground">Description</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={drafting}
                onClick={async () => {
                  if (values.title.trim().length < 2) {
                    push("Add a job title first", "danger");
                    return;
                  }
                  setDrafting(true);
                  try {
                    const local = ollamaConfig(user);
                    if (local) {
                      const ctx = await aiService.context();
                      const text = await ollamaChat(local, [
                        { role: "system", content: ctx.data.jobDraftPrompt },
                        {
                          role: "user",
                          content: `Title: ${values.title}
Location: ${values.location || "not set"}
Workplace: ${values.workplace || "not set"}
Job type: ${values.jobType || "not set"}
Experience: ${values.experienceLevel || "not set"}
Category: ${values.category || "not set"}`,
                        },
                      ]);
                      const parsed = parseJsonObject(text);
                      if (!parsed?.description) throw new Error("Could not parse AI draft");
                      setValues((prev) => ({
                        ...prev,
                        description: String(parsed.description),
                        responsibilities: Array.isArray(parsed.responsibilities)
                          ? parsed.responsibilities.map(String).join("\n")
                          : prev.responsibilities,
                        requirements: Array.isArray(parsed.requirements)
                          ? parsed.requirements.map(String).join("\n")
                          : prev.requirements,
                        skills: Array.isArray(parsed.skills) ? parsed.skills.map(String).join(", ") : prev.skills,
                      }));
                      push("AI draft added — edit anything you like");
                      return;
                    }
                    const res = await aiService.draftJob({
                      title: values.title,
                      location: values.location,
                      workplace: values.workplace,
                      jobType: values.jobType,
                      experienceLevel: values.experienceLevel,
                      category: values.category,
                    });
                    setValues((prev) => ({
                      ...prev,
                      description: res.data.description,
                      responsibilities: res.data.responsibilities.join("\n") || prev.responsibilities,
                      requirements: res.data.requirements.join("\n") || prev.requirements,
                      skills: res.data.skills.join(", ") || prev.skills,
                    }));
                    push("AI draft added — edit anything you like");
                  } catch (error) {
                    push(error instanceof ApiError ? error.message : "Could not draft this listing", "danger");
                  } finally {
                    setDrafting(false);
                  }
                }}
              >
                <Sparkles size={14} /> Draft with AI
              </Button>
            </div>
            <Textarea
              hint="At least 20 characters. Cover the team, the work, and who succeeds here."
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
        </Card>

        <Card>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Preview</p>
          <h2 className="mt-1 font-display text-2xl leading-tight">How it reads</h2>
          <div className="mt-6 rounded-2xl border border-border p-4">
            <p className="font-display text-xl leading-tight">{values.title || "Job title"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {[values.location || "City", titleCase(values.workplace), titleCase(values.jobType)].join(" · ")}
            </p>
            <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
              {values.description || "Your description will appear here for job seekers."}
            </p>
            <p className="mt-4 text-sm font-medium">{salaryPreview}</p>
            {skills.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill) => (
                  <Badge key={skill} tone="copper">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">Add skills to show on the listing.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
        <Card>
          <SectionTitle icon={MapPin} title="Placement" copy="Where and how this role works." />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Location"
                placeholder="Karachi, PK or Remote"
                value={values.location}
                onChange={(e) => set("location", e.target.value)}
                required
              />
            </div>
            <Select label="Workplace" options={WORKPLACES} value={values.workplace} onChange={(e) => set("workplace", e.target.value)} />
            <Select label="Job type" options={JOB_TYPES} value={values.jobType} onChange={(e) => set("jobType", e.target.value)} />
            <Select
              label="Experience"
              options={EXPERIENCE_LEVELS}
              value={values.experienceLevel}
              onChange={(e) => set("experienceLevel", e.target.value)}
            />
            <Select
              label="Category"
              options={CATEGORIES.map((category) => ({ label: titleCase(category), value: category }))}
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <SectionTitle icon={Sparkles} title="Skills" copy="Comma separated. These power search and matching." />
          <div className="mt-6 grid gap-4">
            <Input
              label="Skills"
              hint="Example: React, TypeScript, Node.js"
              placeholder="React, TypeScript, Node.js"
              value={values.skills}
              onChange={(e) => set("skills", e.target.value)}
            />
            {skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} tone="copper">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Skills appear as chips on the public job page.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
        <Card>
          <SectionTitle icon={ClipboardList} title="Responsibilities" copy="One per line. Keep them concrete." />
          <div className="mt-6">
            <Textarea
              label="Responsibilities"
              hint="One item per line"
              placeholder={"Own the frontend architecture\nShip weekly product increments"}
              value={values.responsibilities}
              onChange={(e) => set("responsibilities", e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <SectionTitle icon={ListChecks} title="Requirements" copy="One per line. What they need on day one." tone="secondary" />
          <div className="mt-6">
            <Textarea
              label="Requirements"
              hint="One item per line"
              placeholder={"4+ years with React\nComfortable in TypeScript"}
              value={values.requirements}
              onChange={(e) => set("requirements", e.target.value)}
            />
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle icon={Wallet} title="Compensation" copy="Salary range and the last day to apply." />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Input label="Min salary (USD)" type="number" min={0} placeholder="1500" value={values.min} onChange={(e) => set("min", e.target.value)} />
          <Input label="Max salary (USD)" type="number" min={0} placeholder="2500" value={values.max} onChange={(e) => set("max", e.target.value)} />
          <Input label="Application deadline" type="date" value={values.deadline} onChange={(e) => set("deadline", e.target.value)} />
        </div>
      </Card>

      <div className="flex justify-end lg:hidden">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
