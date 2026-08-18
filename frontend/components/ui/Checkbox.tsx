import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Checkbox({ className, label, id, ...props }: Props) {
  const inputId = id ?? props.name ?? label;
  return (
    <label htmlFor={inputId} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        id={inputId}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-border text-primary transition duration-300 focus-visible:ring-2 focus-visible:ring-ring/40",
          className,
        )}
        {...props}
      />
      {label}
    </label>
  );
}
