import { Router } from "express";
import { companyController } from "../controllers/company.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";
import { createCompanySchema, updateCompanySchema } from "../validators/company.validator.js";

const router = Router();

router.get("/", companyController.list);
router.get("/mine", authenticate, authorize("employer", "admin"), companyController.mine);
router.get("/:id", companyController.get);
router.post("/", authenticate, authorize("employer"), validate(createCompanySchema), companyController.create);
router.put("/:id", authenticate, authorize("employer", "admin"), validate(updateCompanySchema), companyController.update);
router.delete("/:id", authenticate, authorize("employer", "admin"), companyController.remove);
router.post("/:id/logo", authenticate, authorize("employer"), uploadImage, companyController.logo);

export default router;
