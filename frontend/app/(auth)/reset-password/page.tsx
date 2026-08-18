"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthShell } from "@/components/forms/AuthForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { homeFor, useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();
  const { push } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = params.get("token") ?? "";

  return (
    <AuthShell title="Choose a new password" subtitle="This link is valid for a short while.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const res = await authService.resetPassword({ token, password });
            setUser(res.data.user);
            router.push(homeFor(res.data.user.role));
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not reset password", "danger");
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button className="w-full" loading={loading}>
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
