"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { popTransition } from "@/lib/motion";

type Option = { label: string; value: string };

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  options: Option[];
};

export function Select({
  className,
  label,
  options,
  value,
  defaultValue,
  onChange,
  onBlur,
  disabled,
  name,
  id,
  ref,
  "aria-label": ariaLabel,
  ...props
}: Props) {
  const generatedId = useId();
  const selectId = id ?? name ?? generatedId;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLSelectElement | null>(null);
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(String(defaultValue ?? options[0]?.value ?? ""));
  const [active, setActive] = useState(-1);

  const current = value !== undefined ? String(value) : uncontrolled;
  const selected = options.find((option) => option.value === current) ?? options[0];
  const activeIndex = active >= 0 ? active : Math.max(0, options.findIndex((option) => option.value === current));

  useEffect(() => {
    if (!open) return;

    function onPointer(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function assignHiddenRef(node: HTMLSelectElement | null) {
    hiddenRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  function commit(next: string) {
    if (value === undefined) setUncontrolled(next);
    const el = hiddenRef.current;
    if (el) el.value = next;
    onChange?.({
      target: el ?? { value: next, name: name ?? "" },
      currentTarget: el ?? { value: next, name: name ?? "" },
    } as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setActive(Math.max(0, options.findIndex((option) => option.value === current)));
        setOpen(true);
        return;
      }
    }

    if (!open) return;

    if (event.key === "ArrowDown") {
      setActive((index) => {
        const from = index >= 0 ? index : activeIndex;
        return Math.min(options.length - 1, from + 1);
      });
    }

    if (event.key === "ArrowUp") {
      setActive((index) => {
        const from = index >= 0 ? index : activeIndex;
        return Math.max(0, from - 1);
      });
    }

    if (event.key === "Enter" || event.key === " ") {
      const option = options[activeIndex];
      if (option) commit(option.value);
    }
  }

  return (
    <div className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <div ref={wrapperRef} className="relative">
        <select
          {...props}
          id={selectId}
          ref={assignHiddenRef}
          name={name}
          value={current}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          onChange={onChange}
          onBlur={onBlur}
          className="sr-only"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel ?? label}
          onClick={() => {
            if (disabled) return;
            setActive(Math.max(0, options.findIndex((option) => option.value === current)));
            setOpen((next) => !next);
          }}
          onBlur={onBlur}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border border-border bg-card px-3.5 text-left text-sm text-foreground outline-none transition duration-300 ease-smooth",
            "hover:border-primary/35 focus:border-primary focus:ring-4 focus:ring-ring/15",
            "disabled:cursor-not-allowed disabled:opacity-50",
            open && "border-primary ring-4 ring-ring/15",
            className,
          )}
        >
          <span className="truncate">{selected?.label}</span>
          <ChevronDown
            size={16}
            className={cn("shrink-0 text-muted-foreground transition duration-300", open && "rotate-180")}
          />
        </button>
        <AnimatePresence>
          {open ? (
            <motion.ul
              key="select-menu"
              role="listbox"
              aria-label={ariaLabel ?? label}
              className="absolute z-50 mt-1.5 max-h-64 w-full origin-top overflow-auto rounded-2xl border border-border bg-card p-1 shadow-lift"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={popTransition}
            >
            {options.map((option, index) => {
              const isSelected = option.value === current;
              const isActive = index === activeIndex;
              return (
                <li key={option.value || `${option.label}-${index}`} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => commit(option.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition duration-200",
                      isActive || isSelected
                        ? "bg-muted text-foreground"
                        : "text-card-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? <Check size={14} className="shrink-0 text-primary" /> : null}
                  </button>
                </li>
              );
            })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
