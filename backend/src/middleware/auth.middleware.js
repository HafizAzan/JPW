import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/token.js";
import { env } from "../config/env.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = bearer || req.cookies?.[env.cookieName];

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "Account no longer exists");
  }

  if (user.status === "suspended") {
    throw new ApiError(403, "Account is suspended");
  }

  req.user = user;
  next();
});

export function requireOtpAuth(req, res, next) {
  if (req.body?.purpose === "verify-email") return next();
  return authenticate(req, res, next);
}

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = bearer || req.cookies?.[env.cookieName];

  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (user && user.status === "active") req.user = user;
  } catch {
    // ignore invalid optional tokens
  }

  next();
});
