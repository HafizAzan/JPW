import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function fileFilter(allowed) {
  return (_req, file, cb) => {
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
  };
}

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(IMAGE_TYPES),
}).single("file");

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(RESUME_TYPES),
}).single("file");
