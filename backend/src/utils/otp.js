import crypto from "node:crypto";
import { hashToken } from "./token.js";
import { sendEmail } from "./email.js";
import { ApiError } from "./ApiError.js";
import { env } from "../config/env.js";

export const OTP_PURPOSES = {
  VERIFY_EMAIL: "verify-email",
  CHANGE_EMAIL: "change-email",
  CHANGE_PASSWORD: "change-password",
  DELETE_ACCOUNT: "delete-account",
};

export const OTP_SELECT = "+otpHash +otpPurpose +otpExpires +otpAttempts +otpSentAt +pendingEmail +pendingPasswordHash";

const COPY = {
  [OTP_PURPOSES.VERIFY_EMAIL]: {
    subject: "Verify your HireHub email",
    line: "Use this code to verify your email and finish creating your account.",
  },
  [OTP_PURPOSES.CHANGE_EMAIL]: {
    subject: "Confirm your new HireHub email",
    line: "Use this code to confirm the new email on your HireHub account.",
  },
  [OTP_PURPOSES.CHANGE_PASSWORD]: {
    subject: "Confirm your HireHub password change",
    line: "Use this code to confirm the password change on your HireHub account.",
  },
  [OTP_PURPOSES.DELETE_ACCOUNT]: {
    subject: "Confirm HireHub account deletion",
    line: "Use this code to permanently delete your HireHub account. If you did not ask for this, ignore the email.",
  },
};

export function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

export function hashOtp(otp, purpose, userId) {
  return hashToken(`${otp}:${purpose}:${userId}`);
}

export function clearOtp(user) {
  user.otpHash = undefined;
  user.otpPurpose = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
  user.otpSentAt = undefined;
}

export async function issueOtp(user, purpose, { to } = {}) {
  if (user.otpSentAt && Date.now() - new Date(user.otpSentAt).getTime() < 60 * 1000) {
    throw new ApiError(429, "Wait a minute before requesting another code");
  }

  const otp = generateOtp();
  user.otpHash = hashOtp(otp, purpose, user._id);
  user.otpPurpose = purpose;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  user.otpAttempts = 0;
  user.otpSentAt = new Date();
  await user.save({ validateBeforeSave: false });

  const dest = to || user.email;
  const copy = COPY[purpose] ?? COPY[OTP_PURPOSES.VERIFY_EMAIL];
  await sendEmail({
    to: dest,
    subject: copy.subject,
    html: `
      <p>${copy.line}</p>
      <p style="font-size:28px;letter-spacing:8px;font-weight:700">${otp}</p>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  return env.isProd ? { sent: true } : { sent: true, otp };
}

export async function assertOtp(user, otp, purpose) {
  if (!user.otpHash || user.otpPurpose !== purpose) {
    throw new ApiError(400, "No verification code is pending. Request a new one.");
  }
  if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new ApiError(400, "That code has expired. Request a new one.");
  }
  if ((user.otpAttempts ?? 0) >= 5) {
    throw new ApiError(429, "Too many incorrect codes. Request a new one.");
  }

  const ok = user.otpHash === hashOtp(String(otp).trim(), purpose, user._id);
  if (!ok) {
    user.otpAttempts = (user.otpAttempts ?? 0) + 1;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(400, "Invalid verification code");
  }
}
