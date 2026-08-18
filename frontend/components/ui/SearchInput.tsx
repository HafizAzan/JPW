import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: Props) {
  return (
    <label className="relative block">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        className={cn(
          "h-11 w-full rounded-2xl border border-border bg-card pr-3.5 pl-10 text-sm outline-none transition duration-300 ease-smooth",
          "hover:border-primary/35 focus:border-primary focus:ring-4 focus:ring-ring/15",
          className
        )}
        {...props}
      />
    </label>
  );
}
