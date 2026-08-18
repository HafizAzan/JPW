import { Router } from "express";
import { employerController } from "../controllers/employer.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate, authorize("employer", "admin"));
router.get("/jobs", employerController.jobs);
router.get("/analytics", employerController.analytics);

export default router;
