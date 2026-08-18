"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { drawerTransition, overlayTransition } from "@/lib/motion";

export function Drawer({
  open,
  onClose,
  eyebrow,
  title,
  labelledBy = "drawer-title",
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title?: string;
  labelledBy?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="drawer-root"
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : overlayTransition}
        >
          <button type="button" aria-label="Close overlay" className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? labelledBy : undefined}
            className={cn(
              "relative flex h-full w-full max-w-xl flex-col border-l border-border bg-background shadow-lift will-change-transform",
              className,
            )}
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={reduce ? { duration: 0 } : drawerTransition}
          >
            {eyebrow || title ? (
              <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                  {eyebrow ? <p className="text-xs tracking-[0.18em] text-primary uppercase">{eyebrow}</p> : null}
                  {title ? (
                    <h2 id={labelledBy} className="mt-1 font-display text-2xl leading-tight">
                      {title}
                    </h2>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-muted"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            ) : null}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer ? <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4">{footer}</div> : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
