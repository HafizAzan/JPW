import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uploadImage, uploadResume } from "../middleware/upload.middleware.js";
import { updateProfileSchema, updateSkillsSchema, updateAiSettingsSchema } from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);
router.get("/profile", userController.profile);
router.put("/profile", validate(updateProfileSchema), userController.updateProfile);
router.put("/ai-settings", validate(updateAiSettingsSchema), userController.updateAiSettings);
router.put("/skills", validate(updateSkillsSchema), userController.updateSkills);
router.post("/avatar", uploadImage, userController.avatar);
router.post("/resume", uploadResume, userController.resume);
router.put("/resume/:id/active", userController.setActiveResume);
router.delete("/resume/:id", userController.deleteResume);
router.delete("/resume", userController.deleteResume);
router.get("/saved-jobs", userController.savedJobs);
router.get("/recommended", userController.recommended);

export default router;
