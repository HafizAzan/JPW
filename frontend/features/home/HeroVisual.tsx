import { Badge } from "@/components/ui/Badge";

export function HeroVisual() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-lg" aria-hidden>
      <div className="absolute inset-8 rounded-[2.5rem] bg-secondary/8 dark:bg-secondary/15" />
      <div className="animate-float absolute top-6 right-4 left-8 rounded-3xl border border-border bg-card p-4 shadow-lift">
        <p className="text-xs text-muted-foreground">Search roles</p>
        <p className="mt-1 text-sm font-medium">React Developer · Remote</p>
      </div>
      <div className="animate-float-slow absolute top-32 right-0 left-16 rounded-3xl border border-border bg-card p-5 shadow-lift">
        <p className="text-xs tracking-[0.16em] text-primary uppercase">ABC Software</p>
        <p className="mt-1 font-display text-2xl">Frontend Developer</p>
        <div className="mt-3 flex gap-2">
          <Badge>Remote</Badge>
          <Badge tone="copper">Full Time</Badge>
        </div>
      </div>
      <div className="animate-float absolute right-6 bottom-10 rounded-3xl border border-border bg-card px-4 py-3 shadow-soft">
        <p className="text-xs text-muted-foreground">Application</p>
        <p className="text-sm font-medium text-success">Shortlisted</p>
      </div>
    </div>
  );
}
