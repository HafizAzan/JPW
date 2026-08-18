"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/forms/AuthForm";
import { OtpForm } from "@/components/forms/OtpForm";
import { homeFor, useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { takeOtpHint } from "@/services/auth.service";
import type { OtpPurpose } from "@/types";

const PURPOSES: OtpPurpose[] = ["verify-email", "change-email", "change-password", "delete-account"];

function VerifyOtpInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();
  const { push } = useToast();
  const [hint, setHint] = useState("");
  const email = params.get("email") ?? "";
  const rawPurpose = params.get("purpose") ?? "verify-email";
  const purpose = PURPOSES.includes(rawPurpose as OtpPurpose) ? (rawPurpose as OtpPurpose) : "verify-email";

  useEffect(() => {
    setHint(takeOtpHint());
  }, []);

  if (!email) {
    return (
      <AuthShell title="Verification needed" subtitle="Go back to sign in and we’ll send you a new code.">
        <Link href="/login" className="text-sm text-primary">
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Enter your code"
      subtitle="We sent a 6-digit code. It expires in 10 minutes."
      footer={
        <>
          Wrong email?{" "}
          <Link href="/login" className="text-primary">
            Sign in with another account
          </Link>
        </>
      }
    >
      <OtpForm
        email={email}
        purpose={purpose}
        initialOtp={hint}
        onVerified={({ user }) => {
          if (user) {
            setUser(user);
            push("Email verified");
            router.push(homeFor(user.role));
          }
        }}
      />
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpInner />
    </Suspense>
  );
}
