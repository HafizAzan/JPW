import { Router } from "express";
import { jobController } from "../controllers/job.controller.js";
import { applicationController } from "../controllers/application.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createJobSchema, updateJobSchema, jobQuerySchema } from "../validators/job.validator.js";

const router = Router();

router.get("/", validate(jobQuerySchema), jobController.list);
router.get("/:id", optionalAuth, jobController.get);
router.post("/", authenticate, authorize("employer", "admin"), validate(createJobSchema), jobController.create);
router.put("/:id", authenticate, authorize("employer", "admin"), validate(updateJobSchema), jobController.update);
router.delete("/:id", authenticate, authorize("employer", "admin"), jobController.remove);
router.post("/:id/save", authenticate, authorize("jobseeker"), jobController.save);
router.delete("/:id/save", authenticate, authorize("jobseeker"), jobController.unsave);
router.post("/:id/close", authenticate, authorize("employer", "admin"), jobController.close);
router.post("/:id/duplicate", authenticate, authorize("employer"), jobController.duplicate);
router.get(
  "/:jobId/applications",
  authenticate,
  authorize("employer", "admin"),
  applicationController.forJob
);

export default router;
