"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function PasswordInput({ className, label, error, hint, id, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <span className="relative block">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "h-11 w-full rounded-2xl border bg-card px-3.5 pr-11 text-sm outline-none transition duration-300 ease-smooth",
            "border-border hover:border-primary/35 focus:border-primary focus:ring-4 focus:ring-ring/15",
            error && "border-danger",
            className
          )}
          {...props}
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </span>
      {error ? <span className="text-xs text-danger">{error}</span> : hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
