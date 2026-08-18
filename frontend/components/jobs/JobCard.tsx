import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatSalary, timeAgo, titleCase } from "@/lib/format";
import type { Company, Job } from "@/types";

export function JobCard({ job }: { job: Job }) {
  const company = typeof job.company === "object" ? (job.company as Company) : null;
  const href = job._id.startsWith("mock-")
    ? `/jobs?search=${encodeURIComponent(job.title)}`
    : `/jobs/${job.slug || job._id}`;
  return (
    <Link href={href} className="group block h-full">
      <Card className="hover-lift h-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.16em] text-primary uppercase">{company?.name ?? "Company"}</p>
            <h3 className="mt-1 font-display text-2xl leading-tight transition-colors duration-300 group-hover:text-primary">
              {job.title}
            </h3>
          </div>
          {job.matchScore ? <Badge tone="forest">{job.matchScore}% match</Badge> : null}
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{job.location}</Badge>
          <Badge tone="copper">{titleCase(job.jobType)}</Badge>
          <Badge tone="forest">{titleCase(job.workplace)}</Badge>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span>{formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}</span>
          <span className="text-muted-foreground">{timeAgo(job.createdAt)}</span>
        </div>
      </Card>
    </Link>
  );
}
