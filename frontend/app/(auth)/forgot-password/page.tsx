"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/forms/AuthForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      title="Reset password"
      subtitle="We will send a reset link if this email is registered."
      footer={<Link href="/login" className="text-copper">Back to sign in</Link>}
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const res = await authService.forgotPassword(email);
            setResetUrl(res.data.resetUrl ?? "");
            push("If that email exists, a reset link has been prepared.");
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not send reset", "danger");
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button className="w-full" loading={loading}>
          Send reset link
        </Button>
        {resetUrl ? (
          <p className="text-xs break-all text-muted-foreground">
            Development link: <Link href={resetUrl} className="text-copper">{resetUrl}</Link>
          </p>
        ) : null}
      </form>
    </AuthShell>
  );
}
