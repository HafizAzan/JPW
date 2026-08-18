import { api } from "@/lib/api";
import type { OtpChallenge, OtpPurpose, Role, User } from "@/types";

const OTP_HINT = "hirehub_otp_hint";

export function stashOtpHint(otp?: string) {
  if (typeof window === "undefined" || !otp) return;
  sessionStorage.setItem(OTP_HINT, otp);
}

export function takeOtpHint() {
  if (typeof window === "undefined") return "";
  const value = sessionStorage.getItem(OTP_HINT) ?? "";
  if (value) sessionStorage.removeItem(OTP_HINT);
  return value;
}

export const authService = {
  register(payload: { name: string; email: string; password: string; role: Role }) {
    return api<OtpChallenge>("/auth/register", { method: "POST", body: payload });
  },
  login(payload: { email: string; password: string }) {
    return api<{ user: User; token: string }>("/auth/login", { method: "POST", body: payload });
  },
  logout() {
    return api<null>("/auth/logout", { method: "POST" });
  },
  me() {
    return api<User>("/auth/me");
  },
  forgotPassword(email: string) {
    return api<{ sent: boolean; resetUrl?: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
  },
  resetPassword(payload: { token: string; password: string }) {
    return api<{ user: User; token: string }>("/auth/reset-password", { method: "POST", body: payload });
  },
  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return api<OtpChallenge>("/auth/change-password", { method: "PUT", body: payload });
  },
  changeEmail(payload: { email: string; currentPassword: string }) {
    return api<OtpChallenge>("/auth/change-email", { method: "PUT", body: payload });
  },
  requestDeleteAccount(payload: { currentPassword: string }) {
    return api<OtpChallenge>("/auth/delete-account", { method: "POST", body: payload });
  },
  verifyOtp(payload: { otp: string; purpose: OtpPurpose; email?: string }) {
    return api<{ user?: User; token?: string; changed?: boolean; deleted?: boolean }>("/auth/verify-otp", {
      method: "POST",
      body: payload,
    });
  },
  resendOtp(payload: { purpose: OtpPurpose; email?: string }) {
    return api<{ sent: boolean; otp?: string }>("/auth/resend-otp", { method: "POST", body: payload });
  },
};
