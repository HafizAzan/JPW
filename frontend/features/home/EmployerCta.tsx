import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function EmployerCta() {
  return (
    <section className="pb-20">
      <Container>
        <Reveal>
          <div className="rounded-[2rem] border border-border bg-card px-6 py-12 text-center shadow-soft transition duration-500 ease-smooth hover:shadow-lift sm:px-12">
            <p className="text-xs tracking-[0.2em] text-primary uppercase">For employers</p>
            <h2 className="mt-3 font-display text-4xl">Find people who fit the work.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Create a company profile, post a role for review, and move applicants from applied to hired with a clear
              status workflow.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Start hiring</Button>
              </Link>
              <Link href="/for-employers">
                <Button size="lg" variant="outline">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
