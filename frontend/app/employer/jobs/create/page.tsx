"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { JobForm } from "@/components/jobs/JobForm";
import { jobService } from "@/services/job.service";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";

export default function CreateJobPage() {
  const router = useRouter();
  const { push } = useToast();
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Hiring"
        title="Create job"
        description="Write a clear listing. It stays pending until an administrator approves it."
        action={
          <Button form="job-form" type="submit" loading={busy}>
            Submit for review
          </Button>
        }
      />
      <JobForm
        formId="job-form"
        submitLabel="Submit for review"
        onBusy={setBusy}
        onSubmit={async (payload) => {
          try {
            await jobService.create(payload);
            push("Job submitted for review");
            router.push("/employer/jobs");
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not create job", "danger");
          }
        }}
      />
    </div>
  );
}
