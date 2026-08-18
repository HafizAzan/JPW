import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PLATFORM_STATS } from "@/lib/landing";

export function Stats() {
  return (
    <section className="pb-8">
      <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_STATS.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.06}>
            <div className="rounded-3xl border border-border bg-card px-5 py-6">
              <p className="font-display text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
