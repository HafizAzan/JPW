import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import jobRoutes from "./job.routes.js";
import companyRoutes from "./company.routes.js";
import applicationRoutes from "./application.routes.js";
import adminRoutes from "./admin.routes.js";
import employerRoutes from "./employer.routes.js";
import notificationRoutes from "./notification.routes.js";
import aiRoutes from "./ai.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/companies", companyRoutes);
router.use("/applications", applicationRoutes);
router.use("/admin", adminRoutes);
router.use("/employer", employerRoutes);
router.use("/notifications", notificationRoutes);
router.use("/ai", aiRoutes);

export default router;
