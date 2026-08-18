"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/forms/AuthForm";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { authService, stashOtpHint } from "@/services/auth.service";
import { otpChallengeFromError, ApiError } from "@/lib/api";
import { homeFor, useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your hiring conversation."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="text-primary">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            const res = await authService.login({ email: values.email, password: values.password });
            setUser(res.data.user);
            router.push(homeFor(res.data.user.role));
          } catch (error) {
            const challenge = otpChallengeFromError(error);
            if (challenge) {
              stashOtpHint(challenge.otp);
              push("Please verify your email to continue");
              router.push(`/verify-otp?email=${encodeURIComponent(challenge.email)}&purpose=verify-email`);
              return;
            }
            push(error instanceof ApiError ? error.message : "Could not sign in", "danger");
          }
        })}
      >
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <PasswordInput label="Password" error={errors.password?.message} {...register("password")} />
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" {...register("remember")} />
          <Link href="/forgot-password" className="text-sm text-primary">
            Forgot password?
          </Link>
        </div>
        <Button className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
