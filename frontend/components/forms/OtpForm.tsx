"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import type { OtpPurpose, User } from "@/types";

const COPY: Record<OtpPurpose, { title: string; hint: string }> = {
  "verify-email": {
    title: "Check your email",
    hint: "Enter the 6-digit code we sent to verify your account.",
  },
  "change-email": {
    title: "Confirm your new email",
    hint: "Enter the code sent to your new address. Your email updates only after this step.",
  },
  "change-password": {
    title: "Confirm password change",
    hint: "Enter the code sent to your current email. Your password updates only after this step.",
  },
  "delete-account": {
    title: "Confirm account deletion",
    hint: "Enter the code sent to your email. This permanently deletes your account.",
  },
};

type Props = {
  email: string;
  purpose: OtpPurpose;
  initialOtp?: string;
  cancelLabel?: string;
  submitLabel?: string;
  variant?: "primary" | "danger";
  onCancel?: () => void;
  onVerified: (result: { user?: User; deleted?: boolean }) => void | Promise<void>;
};

export function OtpForm({
  email,
  purpose,
  initialOtp,
  cancelLabel = "Cancel",
  submitLabel = "Verify code",
  variant = "primary",
  onCancel,
  onVerified,
}: Props) {
  const { push } = useToast();
  const copy = COPY[purpose];
  const [otp, setOtp] = useState(initialOtp?.replace(/\D/g, "").slice(0, 6) ?? "");
  const [devOtp, setDevOtp] = useState(initialOtp ?? "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [wait, setWait] = useState(60);
  const busy = useRef(false);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  async function verify(code = otp) {
    if (code.length !== 6 || busy.current) return;
    busy.current = true;
    setLoading(true);
    try {
      const res = await authService.verifyOtp({
        otp: code,
        purpose,
        ...(purpose === "verify-email" ? { email } : {}),
      });
      await onVerified({ user: res.data.user, deleted: res.data.deleted });
      if (res.data.deleted) return;
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not verify the code", "danger");
    }
    busy.current = false;
    setLoading(false);
  }

  async function resend() {
    setResending(true);
    try {
      const res = await authService.resendOtp({
        purpose,
        ...(purpose === "verify-email" ? { email } : {}),
      });
      setWait(60);
      setOtp("");
      if (res.data.otp) setDevOtp(res.data.otp);
      push("A new code has been sent");
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not resend the code", "danger");
    } finally {
      setResending(false);
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        verify();
      }}
    >
      <div>
        <h3 className="font-display text-2xl leading-tight">{copy.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{copy.hint}</p>
        <p className="mt-1 truncate text-sm font-medium">{email}</p>
      </div>
      <OtpInputs value={otp} onChange={setOtp} onComplete={verify} disabled={loading} />
      {devOtp ? (
        <p className="text-xs text-muted-foreground">
          Development code: <span className="font-mono tracking-[0.3em] text-foreground">{devOtp}</span>
        </p>
      ) : null}
      <Button className="w-full" variant={variant} loading={loading} disabled={otp.length !== 6}>
        {submitLabel}
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <button
          type="button"
          className="text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
          disabled={wait > 0 || resending}
          onClick={resend}
        >
          {wait > 0 ? `Resend in ${wait}s` : resending ? "Sending…" : "Resend code"}
        </button>
        {onCancel ? (
          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={onCancel}>
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function OtpInputs({
  value,
  onChange,
  onComplete,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");

  function focusAt(index: number) {
    refs.current[Math.max(0, Math.min(5, index))]?.focus();
  }

  function update(next: string) {
    const code = next.replace(/\D/g, "").slice(0, 6);
    onChange(code);
    if (code.length === 6) onComplete(code);
  }

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          value={digit}
          aria-label={`Digit ${index + 1}`}
          className={cn(
            "h-12 w-full rounded-2xl border bg-card text-center font-display text-xl tracking-widest outline-none transition",
            "border-border focus:border-primary focus:ring-4 focus:ring-ring/15",
            disabled && "opacity-60"
          )}
          onChange={(e) => {
            const char = e.target.value.replace(/\D/g, "").slice(-1);
            const next = `${value.slice(0, index)}${char}${value.slice(index + 1)}`;
            update(char ? next : `${value.slice(0, index)}${value.slice(index + 1)}`);
            if (char) focusAt(index + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[index]) {
              focusAt(index - 1);
            }
            if (e.key === "ArrowLeft") focusAt(index - 1);
            if (e.key === "ArrowRight") focusAt(index + 1);
          }}
          onPaste={(e) => {
            e.preventDefault();
            update(e.clipboardData.getData("text"));
          }}
        />
      ))}
    </div>
  );
}
