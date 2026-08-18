import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-soft", className)}
      {...props}
    >
      {children}
    </div>
  );
}
