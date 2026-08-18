import { authService } from "../services/auth.service.js";
import { userService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";
import { setAuthCookie, clearAuthCookie } from "../utils/token.js";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    send(res, 201, result, "Check your email for a verification code");
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    setAuthCookie(res, result.token);
    send(res, 200, result, "Logged in");
  }),

  logout: asyncHandler(async (_req, res) => {
    clearAuthCookie(res);
    send(res, 200, null, "Logged out");
  }),

  me: asyncHandler(async (req, res) => {
    send(res, 200, await userService.getProfile(req.user._id), "Current user");
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    send(res, 200, result, "If that email exists, a reset link has been sent");
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const result = await authService.resetPassword(req.body);
    setAuthCookie(res, result.token);
    send(res, 200, result, "Password updated");
  }),

  changePassword: asyncHandler(async (req, res) => {
    const result = await authService.changePassword(req.user._id, req.body);
    send(res, 200, result, "Check your email for a verification code");
  }),

  changeEmail: asyncHandler(async (req, res) => {
    const result = await authService.changeEmail(req.user._id, req.body);
    send(res, 200, result, "Check your new email for a verification code");
  }),

  requestDeleteAccount: asyncHandler(async (req, res) => {
    const result = await authService.requestDeleteAccount(req.user._id, req.body);
    send(res, 200, result, "Check your email for a verification code");
  }),

  verifyOtp: asyncHandler(async (req, res) => {
    const result = await authService.verifyOtp(req.body, req.user);
    if (result.deleted) {
      clearAuthCookie(res);
      send(res, 200, result, "Account deleted");
      return;
    }
    if (result.token) {
      setAuthCookie(res, result.token);
    }
    send(res, 200, result, "Verified");
  }),

  resendOtp: asyncHandler(async (req, res) => {
    const result = await authService.resendOtp(req.body, req.user);
    send(res, 200, result, "A new verification code has been sent");
  }),
};
