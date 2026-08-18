import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

function applyParsed(req, key, value) {
  if (value === undefined) return;
  try {
    req[key] = value;
  } catch {
    Object.defineProperty(req, key, {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
}

export function validate(schema) {
  return (req, _res, next) => {
    try {
      const parsed = schema.passthrough().parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      applyParsed(req, "body", parsed.body);
      applyParsed(req, "params", parsed.params);
      applyParsed(req, "query", parsed.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        next(new ApiError(400, "Validation failed", errors));
        return;
      }
      next(error);
    }
  };
}
