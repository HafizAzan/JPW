import { z } from "zod";

const email = z.email("Enter a valid email");
const password = z.string().min(8, "Password must be at least 8 characters");
const otpPurpose = z.enum(["verify-email", "change-email", "change-password", "delete-account"]);
const otpCode = z.string().regex(/^\d{6}$/, "Enter the 6-digit code");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email,
    password,
    role: z.enum(["jobseeker", "employer"]).default("jobseeker"),
  }),
});

export const loginSchema = z.object({
  body: z.object({ email, password: z.string().min(1) }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    password,
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: password,
  }),
});

export const changeEmailSchema = z.object({
  body: z.object({
    email,
    currentPassword: z.string().min(1),
  }),
});

export const deleteAccountSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
  }),
});

export const verifyOtpSchema = z.object({
  body: z
    .object({
      otp: otpCode,
      purpose: otpPurpose,
      email: email.optional(),
    })
    .superRefine((value, ctx) => {
      if (value.purpose === "verify-email" && !value.email) {
        ctx.addIssue({ code: "custom", path: ["email"], message: "Email is required" });
      }
    }),
});

export const resendOtpSchema = z.object({
  body: z
    .object({
      purpose: otpPurpose,
      email: email.optional(),
    })
    .superRefine((value, ctx) => {
      if (value.purpose === "verify-email" && !value.email) {
        ctx.addIssue({ code: "custom", path: ["email"], message: "Email is required" });
      }
    }),
});
