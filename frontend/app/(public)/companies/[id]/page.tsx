"use client";

import { use, useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { JobCard } from "@/components/jobs/JobCard";
import { companyService } from "@/services/company.service";
import type { Company, Job } from "@/types";

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    companyService.get(id).then((res) => {
      setCompany(res.data.company);
      setJobs(res.data.jobs);
    });
  }, [id]);

  if (!company) return <Container className="py-20 text-muted-foreground">Loading company…</Container>;

  return (
    <Container className="py-12">
      <Card className="animate-rise">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-copper uppercase">{company.industry}</p>
            <h1 className="mt-2 font-display text-5xl">{company.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{company.description}</p>
          </div>
          {company.verified ? <Badge tone="forest">Verified</Badge> : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {company.location ? <Badge>{company.location}</Badge> : null}
          {company.size ? <Badge>{company.size} people</Badge> : null}
          {company.foundedYear ? <Badge>Founded {company.foundedYear}</Badge> : null}
        </div>
      </Card>
      <h2 className="mt-10 mb-4 font-display text-3xl">Open roles</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </Container>
  );
}
