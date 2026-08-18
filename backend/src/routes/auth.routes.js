import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate, requireOtpAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  changeEmailSchema,
  deleteAccountSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.put("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);
router.put("/change-email", authenticate, validate(changeEmailSchema), authController.changeEmail);
router.post("/delete-account", authenticate, validate(deleteAccountSchema), authController.requestDeleteAccount);
router.post("/verify-otp", authLimiter, validate(verifyOtpSchema), requireOtpAuth, authController.verifyOtp);
router.post("/resend-otp", authLimiter, validate(resendOtpSchema), requireOtpAuth, authController.resendOtp);

export default router;
