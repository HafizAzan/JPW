import { Router } from "express";
import { notificationController } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", notificationController.list);
router.patch("/read-all", notificationController.readAll);
router.patch("/:id/read", notificationController.read);

export default router;
