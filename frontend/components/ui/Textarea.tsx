import { cn } from "@/lib/cn";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

export function Textarea({ className, label, hint, ...props }: Props) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <textarea
        className={cn(
          "min-h-32 w-full rounded-2xl border border-border bg-card px-3.5 py-3 text-sm text-foreground outline-none transition duration-300 ease-smooth",
          "hover:border-primary/35 focus:border-primary focus:ring-4 focus:ring-ring/15",
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
