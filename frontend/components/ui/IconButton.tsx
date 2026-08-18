"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { popTransition } from "@/lib/motion";

export function IconButton({
  label,
  variant = "outline",
  loading,
  className,
  children,
  disabled,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "outline" | "ghost" | "secondary" | "danger";
  loading?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tip, setTip] = useState<DOMRect | null>(null);

  function show() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setTip(rect);
  }

  const variants = {
    outline: "border border-border bg-card text-foreground hover:border-primary/35 hover:bg-muted/60",
    ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-strong",
    danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20",
  };

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={disabled || loading}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full transition duration-300 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className,
        )}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          show();
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          setTip(null);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          show();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setTip(null);
        }}
        {...props}
      >
        {loading ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {tip ? (
                <motion.span
                  key="icon-tip"
                  role="tooltip"
                  className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-full rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium whitespace-nowrap text-background shadow-soft"
                  style={{ top: tip.top - 8, left: tip.left + tip.width / 2 }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={popTransition}
                >
                  {label}
                </motion.span>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
