"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters, type JobFilterState } from "@/components/jobs/JobFilters";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { jobService } from "@/services/job.service";
import type { Job, Pagination as PageMeta } from "@/types";

const emptyFilters: JobFilterState = {
  search: "",
  location: "",
  type: "",
  workplace: "",
  experience: "",
  category: "",
  minSalary: "",
  maxSalary: "",
  sort: "newest",
};

function JobsBoard() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<JobFilterState>({
    ...emptyFilters,
    search: params.get("search") ?? "",
    location: params.get("location") ?? "",
    type: params.get("type") ?? "",
    category: params.get("category") ?? "",
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<PageMeta>({ page: 1, limit: 9, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  async function load(page = 1) {
    setLoading(true);
    const res = await jobService.list({ ...filters, page, limit: 9 });
    setJobs(res.data.items);
    setMeta(res.data.pagination);
    setLoading(false);
  }

  useEffect(() => {
    load(1).catch(() => setLoading(false));
  }, []);

  return (
    <Container className="py-12">
      <PageHeader
        eyebrow="Open roles"
        title="Find work worth doing"
        description="Search by skill, place, salary, and seniority. Only approved roles appear here."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <JobFilters value={filters} onChange={setFilters} onSubmit={() => load(1)} />
        <div>
          <div className="grid gap-4 md:grid-cols-2">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)
              : jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
          {!loading && jobs.length === 0 ? (
            <EmptyState title="No jobs found." description="Try changing your filters." />
          ) : null}
          <Pagination page={meta.page} pages={meta.pages} onPage={load} />
        </div>
      </div>
    </Container>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<Container className="py-12 text-muted-foreground">Loading jobs…</Container>}>
      <JobsBoard />
    </Suspense>
  );
}
