import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { createRawToken, hashToken, signToken } from "../utils/token.js";
import { sendEmail } from "../utils/email.js";
import { env } from "../config/env.js";
import { OTP_PURPOSES, OTP_SELECT, issueOtp, assertOtp, clearOtp } from "../utils/otp.js";
import { userService } from "./user.service.js";

function otpResult(user, purpose, issued = {}, email) {
  return {
    needsVerification: true,
    email: email || user.email,
    purpose,
    ...(issued.otp && !env.isProd ? { otp: issued.otp } : {}),
  };
}

async function loadOtpUser(id) {
  const user = await User.findById(id).select(`+password ${OTP_SELECT}`);
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

function signIn(user) {
  const token = signToken({ id: user._id, role: user.role });
  return { user: user.toPublic(), token };
}

export const authService = {
  async register({ name, email, password, role }) {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "An account with this email already exists");

    const user = await User.create({ name, email, password, role, emailVerified: false });
    const issued = await issueOtp(user, OTP_PURPOSES.VERIFY_EMAIL);
    return otpResult(user, OTP_PURPOSES.VERIFY_EMAIL, issued);
  },

  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password");
    }
    if (user.status === "suspended") {
      throw new ApiError(403, "Account is suspended");
    }
    if (user.emailVerified === false) {
      const otpUser = await loadOtpUser(user._id);
      let issued = {};
      try {
        issued = await issueOtp(otpUser, OTP_PURPOSES.VERIFY_EMAIL);
      } catch (err) {
        if (!(err instanceof ApiError) || err.statusCode !== 429) throw err;
      }
      throw new ApiError(
        403,
        "Please verify your email to continue",
        [],
        otpResult(user, OTP_PURPOSES.VERIFY_EMAIL, issued)
      );
    }
    return signIn(user);
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) return { sent: true };

    const raw = createRawToken();
    user.resetPasswordToken = hashToken(raw);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.clientUrl}/reset-password?token=${raw}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your HireHub password",
      html: `<p>Reset your password using this link (valid 15 minutes):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return env.isProd ? { sent: true } : { sent: true, resetUrl, token: raw };
  },

  async resetPassword({ token, password }) {
    const user = await User.findOne({
      resetPasswordToken: hashToken(token),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!user) throw new ApiError(400, "Reset token is invalid or expired");

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.emailVerified = true;
    await user.save();

    return signIn(user);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await loadOtpUser(userId);
    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(400, "Current password is incorrect");
    }
    if (await user.comparePassword(newPassword)) {
      throw new ApiError(400, "Choose a different password");
    }

    user.pendingPasswordHash = await bcrypt.hash(newPassword, 12);
    user.pendingEmail = undefined;
    user.otpSentAt = undefined;
    const issued = await issueOtp(user, OTP_PURPOSES.CHANGE_PASSWORD);
    return otpResult(user, OTP_PURPOSES.CHANGE_PASSWORD, issued);
  },

  async changeEmail(userId, { email, currentPassword }) {
    const user = await loadOtpUser(userId);
    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(400, "Current password is incorrect");
    }

    const nextEmail = email.toLowerCase().trim();
    if (nextEmail === user.email) {
      throw new ApiError(400, "This is already your email");
    }

    const exists = await User.findOne({ email: nextEmail, _id: { $ne: userId } });
    if (exists) throw new ApiError(409, "An account with this email already exists");

    user.pendingEmail = nextEmail;
    user.pendingPasswordHash = undefined;
    user.otpSentAt = undefined;
    const issued = await issueOtp(user, OTP_PURPOSES.CHANGE_EMAIL, { to: nextEmail });
    return otpResult(user, OTP_PURPOSES.CHANGE_EMAIL, issued, nextEmail);
  },

  async requestDeleteAccount(userId, { currentPassword }) {
    const user = await loadOtpUser(userId);
    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(400, "Current password is incorrect");
    }
    if (user.role === "admin") {
      const admins = await User.countDocuments({ role: "admin" });
      if (admins <= 1) {
        throw new ApiError(400, "The last admin account cannot be deleted");
      }
    }

    user.pendingEmail = undefined;
    user.pendingPasswordHash = undefined;
    user.otpSentAt = undefined;
    const issued = await issueOtp(user, OTP_PURPOSES.DELETE_ACCOUNT);
    return otpResult(user, OTP_PURPOSES.DELETE_ACCOUNT, issued);
  },

  async verifyOtp({ email, otp, purpose }, actor) {
    if (purpose === OTP_PURPOSES.VERIFY_EMAIL) {
      if (!email) throw new ApiError(400, "Email is required");
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select(`+password ${OTP_SELECT}`);
      if (!user) throw new ApiError(400, "Invalid verification code");
      await assertOtp(user, otp, OTP_PURPOSES.VERIFY_EMAIL);
      user.emailVerified = true;
      clearOtp(user);
      await user.save({ validateBeforeSave: false });
      return signIn(user);
    }

    if (!actor) throw new ApiError(401, "Authentication required");
    const user = await loadOtpUser(actor._id);
    await assertOtp(user, otp, purpose);

    if (purpose === OTP_PURPOSES.CHANGE_EMAIL) {
      if (!user.pendingEmail) throw new ApiError(400, "No email change is pending");
      const exists = await User.findOne({ email: user.pendingEmail, _id: { $ne: user._id } });
      if (exists) throw new ApiError(409, "An account with this email already exists");
      user.email = user.pendingEmail;
      user.pendingEmail = undefined;
      user.emailVerified = true;
      clearOtp(user);
      await user.save({ validateBeforeSave: false });
      return { user: user.toPublic() };
    }

    if (purpose === OTP_PURPOSES.CHANGE_PASSWORD) {
      if (!user.pendingPasswordHash) throw new ApiError(400, "No password change is pending");
      user.password = user.pendingPasswordHash;
      user.pendingPasswordHash = undefined;
      user.$locals.skipPasswordHash = true;
      clearOtp(user);
      await user.save();
      return { changed: true };
    }

    if (purpose === OTP_PURPOSES.DELETE_ACCOUNT) {
      await userService.purgeAccount(user);
      return { deleted: true };
    }

    throw new ApiError(400, "Unknown verification purpose");
  },

  async resendOtp({ email, purpose }, actor) {
    if (purpose === OTP_PURPOSES.VERIFY_EMAIL) {
      if (!email) throw new ApiError(400, "Email is required");
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select(OTP_SELECT);
      if (!user || user.emailVerified !== false) {
        throw new ApiError(400, "Could not send a verification code");
      }
      const issued = await issueOtp(user, OTP_PURPOSES.VERIFY_EMAIL);
      return { sent: true, ...(issued.otp && !env.isProd ? { otp: issued.otp } : {}) };
    }

    if (!actor) throw new ApiError(401, "Authentication required");
    const user = await loadOtpUser(actor._id);
    let to;
    if (purpose === OTP_PURPOSES.CHANGE_EMAIL) {
      if (!user.pendingEmail) throw new ApiError(400, "No email change is pending");
      to = user.pendingEmail;
    } else if (purpose === OTP_PURPOSES.CHANGE_PASSWORD) {
      if (!user.pendingPasswordHash) throw new ApiError(400, "No password change is pending");
    } else if (purpose === OTP_PURPOSES.DELETE_ACCOUNT) {
      // current email
    } else {
      throw new ApiError(400, "Unknown verification purpose");
    }

    const issued = await issueOtp(user, purpose, { to });
    return { sent: true, ...(issued.otp && !env.isProd ? { otp: issued.otp } : {}) };
  },
};
