import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ className, label, hint, error, id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-2xl border bg-card px-3.5 text-sm text-foreground outline-none transition duration-300 ease-smooth",
          "border-border hover:border-primary/35 focus:border-primary focus:ring-4 focus:ring-ring/15",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
