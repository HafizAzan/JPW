import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-strong hover:shadow-lift",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-strong hover:shadow-lift",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline:
    "border border-border bg-card text-foreground hover:border-primary/35 hover:bg-muted/60 hover:shadow-soft",
  danger: "bg-danger text-white hover:opacity-90 hover:shadow-lift",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}
