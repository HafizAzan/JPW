"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Share2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { jobService } from "@/services/job.service";
import { applicationService } from "@/services/application.service";
import { aiService } from "@/services/ai.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDate, formatSalary, titleCase } from "@/lib/format";
import { ollamaChat, ollamaConfig } from "@/lib/ollama";
import type { Company, Job } from "@/types";
import { ApiError } from "@/lib/api";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { push } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    jobService.get(id).then((res) => {
      setJob(res.data.job);
      setSaved(res.data.saved);
      setApplied(res.data.applied);
    });
  }, [id]);

  if (!job) return <Container className="py-20 text-muted-foreground">Loading role…</Container>;

  const company = typeof job.company === "object" ? (job.company as Company) : null;
  const jobId = job._id;

  async function toggleSave() {
    try {
      if (saved) await jobService.unsave(jobId);
      else await jobService.save(jobId);
      setSaved(!saved);
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not update saved jobs", "danger");
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: job?.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    push("Link copied!");
  }

  async function apply() {
    setLoading(true);
    try {
      await applicationService.apply({ jobId, coverLetter });
      setApplied(true);
      push("Application submitted successfully.");
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not apply", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="grid gap-6 py-12 lg:grid-cols-[1.4fr_0.8fr]">
      <Card className="animate-rise">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">{company?.name}</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight">{job.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{job.location}</Badge>
          <Badge tone="copper">{titleCase(job.jobType)}</Badge>
          <Badge tone="forest">{titleCase(job.workplace)}</Badge>
          <Badge>{titleCase(job.experienceLevel)}</Badge>
        </div>
        <h2 className="mt-8 font-display text-2xl">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-card-foreground">{job.description}</p>
        {job.responsibilities?.length ? (
          <>
            <h2 className="mt-8 font-display text-2xl">Responsibilities</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-card-foreground">
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
        {job.requirements?.length ? (
          <>
            <h2 className="mt-8 font-display text-2xl">Requirements</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-card-foreground">
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
        <h2 className="mt-8 font-display text-2xl">Skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} tone="gold">
              {skill}
            </Badge>
          ))}
        </div>
        {company ? (
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="font-display text-2xl">About {company.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{company.description || company.industry}</p>
            <Link href={`/companies/${company.slug || company._id}`} className="mt-3 inline-block text-sm text-primary">
              View company
            </Link>
          </div>
        ) : null}
      </Card>
      <div className="space-y-4">
        <Card>
          <p className="text-sm text-muted-foreground">Compensation</p>
          <p className="mt-1 font-display text-3xl">{formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}</p>
          <p className="mt-3 text-sm text-muted-foreground">{job.location}</p>
          <p className="text-sm text-muted-foreground">{titleCase(job.jobType)} · {titleCase(job.experienceLevel)}</p>
          {job.deadline ? <p className="mt-3 text-sm text-muted-foreground">Apply by {formatDate(job.deadline)}</p> : null}
          <Button className="mt-4 w-full" variant="outline" onClick={share}>
            <Share2 size={16} /> Share
          </Button>
        </Card>
        {user?.role === "jobseeker" ? (
          <Card>
            <div className="mb-4 flex justify-between">
              <h2 className="font-display text-2xl">{applied ? "Application submitted" : "Apply"}</h2>
              <button type="button" onClick={toggleSave} className="text-primary" aria-label="Save job">
                <Heart fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
            {applied ? (
              <p className="text-sm text-muted-foreground">You have already applied for this role.</p>
            ) : (
              <>
                <p className="mb-3 text-sm text-muted-foreground">
                  Resume: {user.resume?.url ? "Your uploaded resume will be attached." : "Upload a resume in your dashboard first."}
                </p>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">Cover letter</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary disabled:opacity-50"
                    disabled={drafting}
                    onClick={async () => {
                      setDrafting(true);
                      try {
                        const local = ollamaConfig(user);
                        if (local) {
                          const ctx = await aiService.context();
                          const text = await ollamaChat(local, [
                            { role: "system", content: ctx.data.coverLetterPrompt },
                            {
                              role: "user",
                              content: `Applicant: ${user.name}
Headline: ${user.headline || "not set"}
Skills: ${(user.skills || []).join(", ") || "not set"}
Role: ${job.title} at ${company?.name || "the company"}
Job summary: ${job.description.slice(0, 800)}`,
                            },
                          ]);
                          setCoverLetter(text);
                          push("Cover letter drafted — edit before you submit");
                          return;
                        }
                        const res = await aiService.draftCoverLetter(jobId);
                        setCoverLetter(res.data.coverLetter);
                        push("Cover letter drafted — edit before you submit");
                      } catch (error) {
                        push(error instanceof ApiError ? error.message : "Could not draft a cover letter", "danger");
                      } finally {
                        setDrafting(false);
                      }
                    }}
                  >
                    <Sparkles size={13} />
                    {drafting ? "Drafting…" : "Draft with AI"}
                  </button>
                </div>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="A short, polite note is enough."
                />
                <Button className="mt-4 w-full" loading={loading} onClick={apply} disabled={!user.resume?.url}>
                  Submit application
                </Button>
              </>
            )}
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-muted-foreground">Sign in as a job seeker to apply or save this role.</p>
            <Link href="/login">
              <Button className="mt-4 w-full">Sign in</Button>
            </Link>
          </Card>
        )}
      </div>
    </Container>
  );
}
