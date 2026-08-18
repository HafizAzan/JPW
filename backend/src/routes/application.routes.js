import { Router } from "express";
import { applicationController } from "../controllers/application.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createApplicationSchema, updateStatusSchema } from "../validators/application.validator.js";

const router = Router();

router.use(authenticate);
router.post("/", authorize("jobseeker"), validate(createApplicationSchema), applicationController.create);
router.get("/my", authorize("jobseeker"), applicationController.mine);
router.get("/:id", applicationController.get);
router.delete("/:id", authorize("jobseeker"), applicationController.withdraw);
router.patch(
  "/:id/status",
  authorize("employer", "admin"),
  validate(updateStatusSchema),
  applicationController.updateStatus
);

export default router;
