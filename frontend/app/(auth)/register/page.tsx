"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/forms/AuthForm";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { authService, stashOtpHint } from "@/services/auth.service";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "jobseeker" },
  });

  return (
    <AuthShell
      title="Join HireHub"
      subtitle="Choose how you would like to arrive — as a candidate or an employer."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            const res = await authService.register({
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
            });
            stashOtpHint(res.data.otp);
            push("Check your email for a verification code");
            router.push(`/verify-otp?email=${encodeURIComponent(res.data.email)}&purpose=verify-email`);
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not create account", "danger");
          }
        })}
      >
        <Input label="Full name" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <PasswordInput
          label="Password"
          hint="At least 8 characters, one uppercase letter, and one number."
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput label="Confirm password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <Select
          label="I am a"
          options={[
            { label: "Job seeker", value: "jobseeker" },
            { label: "Employer", value: "employer" },
          ]}
          {...register("role")}
        />
        <Button className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
