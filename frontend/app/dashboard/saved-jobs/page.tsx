"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { userService } from "@/services/user.service";
import type { Job } from "@/types";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    userService.savedJobs({ limit: 20 }).then((res) => setJobs(res.data.items));
  }, []);

  return (
    <div>
      <PageHeader title="Saved jobs" description="Roles you would like to return to." />
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
      {jobs.length === 0 ? <EmptyState title="Nothing saved" description="Tap the heart on a role to keep it close." /> : null}
    </div>
  );
}
