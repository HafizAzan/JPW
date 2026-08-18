import { ApiError } from "../utils/ApiError.js";

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission for this action");
    }

    next();
  };
}
