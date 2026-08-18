import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "For Employers",
  description: "Post jobs, review applicants, and hire with a clear workflow on HireHub.",
};

export default function ForEmployersPage() {
  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Employers"
        title="Hire with a clear workflow"
        description="Create a company profile, submit jobs for review, and manage applicants from applied to hired."
        action={
          <Link href="/register">
            <Button>Create employer account</Button>
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Company first", copy: "Set up your studio, logo, and industry before you post." },
          { title: "Moderated jobs", copy: "New roles stay pending until an admin approves them." },
          { title: "Applicant tracking", copy: "Shortlist, interview, reject, or hire — with notifications." },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.copy}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
