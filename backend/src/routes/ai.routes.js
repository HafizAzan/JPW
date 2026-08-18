import { Router } from "express";
import { aiController } from "../controllers/ai.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";
import { chatSchema, coverLetterSchema, draftJobSchema, probeSchema } from "../validators/ai.validator.js";

const router = Router();

router.get("/status", optionalAuth, aiController.status);
router.get("/context", optionalAuth, aiController.context);
router.post("/ollama/probe", authenticate, validate(probeSchema), aiController.probe);
router.post("/chat", aiLimiter, optionalAuth, validate(chatSchema), aiController.chat);
router.post("/job-draft", aiLimiter, authenticate, authorize("employer", "admin"), validate(draftJobSchema), aiController.draftJob);
router.post(
  "/cover-letter",
  aiLimiter,
  authenticate,
  authorize("jobseeker", "admin"),
  validate(coverLetterSchema),
  aiController.draftCoverLetter
);

export default router;
