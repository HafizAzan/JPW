import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate, authorize("admin"));
router.get("/stats", adminController.stats);
router.get("/users", adminController.users);
router.get("/users/:id", adminController.user);
router.patch("/users/:id/status", adminController.userStatus);
router.delete("/users/:id", adminController.deleteUser);
router.get("/jobs", adminController.jobs);
router.patch("/jobs/:id/approve", adminController.approveJob);
router.patch("/jobs/:id/reject", adminController.rejectJob);
router.delete("/jobs/:id", adminController.deleteJob);
router.get("/companies", adminController.companies);
router.patch("/companies/:id/verify", adminController.verifyCompany);
router.delete("/companies/:id", adminController.deleteCompany);
router.get("/applications", adminController.applications);
router.delete("/applications/:id", adminController.deleteApplication);

export default router;
