import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { title: "Create your profile", copy: "Add skills, experience, and a resume so the right roles can find you." },
  { title: "Discover opportunities", copy: "Search, filter, and save jobs that match how you actually want to work." },
  { title: "Get hired", copy: "Apply once, track every status, and move from conversation to offer." },
];

export function HowItWorks() {
  return (
    <section className="pb-20">
      <Container>
        <Reveal>
          <p className="text-xs tracking-[0.2em] text-primary uppercase">Process</p>
          <h2 className="mt-2 font-display text-4xl">How it works</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <div className="hover-lift rounded-3xl bg-secondary p-6 text-secondary-foreground">
                <p className="text-xs tracking-[0.2em] text-warning uppercase">0{index + 1}</p>
                <h3 className="mt-4 font-display text-3xl">{step.title}</h3>
                <p className="mt-3 text-sm text-secondary-foreground/75">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
