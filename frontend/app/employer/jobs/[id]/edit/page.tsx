"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { JobForm } from "@/components/jobs/JobForm";
import { jobService } from "@/services/job.service";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";
import type { Job } from "@/types";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { push } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    jobService.get(id).then((res) => setJob(res.data.job));
  }, [id]);

  if (!job) {
    return (
      <div className="grid gap-4 lg:gap-6">
        <PageHeader eyebrow="Hiring" title="Edit job" description="Edits return the role to pending review." />
        <LoadingState rows={4} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Hiring"
        title="Edit job"
        description="Edits return the role to pending review before it goes live again."
        action={
          <Button form="job-form" type="submit" loading={busy}>
            Save changes
          </Button>
        }
      />
      <JobForm
        formId="job-form"
        initial={job}
        submitLabel="Save changes"
        onBusy={setBusy}
        onSubmit={async (payload) => {
          try {
            await jobService.update(id, payload);
            push("Job updated");
            router.push("/employer/jobs");
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not update job", "danger");
          }
        }}
      />
    </div>
  );
}
