import { cn } from "@/lib/cn";

const tones = {
  sand: "bg-muted text-foreground",
  copper: "bg-primary/15 text-primary",
  forest: "bg-secondary/15 text-secondary",
  gold: "bg-warning/15 text-warning",
  rose: "bg-danger/15 text-danger",
};

export function Badge({
  children,
  tone = "sand",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
