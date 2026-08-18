import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "HireHub is a recruitment platform for job seekers, employers, and administrators.",
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Company"
        title="Built for a calmer hiring process"
        description="HireHub helps people find work and companies find people — with clear applications, moderation, and role-based workspaces."
      />
      <div className="max-w-2xl space-y-4 text-muted-foreground">
        <p>
          Candidates get a professional profile, resume storage, search, saved jobs, and a single place to track every
          application.
        </p>
        <p>
          Employers create a company, post roles for review, and move applicants through a structured hiring loop.
        </p>
        <p>Administrators keep the marketplace trustworthy by approving jobs and verifying companies.</p>
        <h2 id="privacy" className="pt-8 font-display text-3xl text-foreground">
          Privacy
        </h2>
        <p>
          HireHub stores account, profile, and application data to run the hiring workflow. Uploaded files go to
          Cloudinary. Do not put production secrets in the frontend.
        </p>
        <h2 id="terms" className="pt-8 font-display text-3xl text-foreground">
          Terms
        </h2>
        <p>
          This is a portfolio product. Use demo accounts for exploration. Employers submit jobs for review before they
          appear publicly.
        </p>
      </div>
    </Container>
  );
}
