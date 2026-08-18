import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

function assertConfigured() {
  if (!env.cloudinary.cloudName) {
    throw new ApiError(503, "File storage is not configured");
  }
}

function uploadBuffer(file, folder, resourceType = "image") {
  assertConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(new ApiError(500, "File upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(file.buffer);
  });
}

export const uploadService = {
  uploadImage(file, folder = "hirehub/images") {
    if (!file) throw new ApiError(400, "File is required");
    return uploadBuffer(file, folder, "image");
  },

  async uploadResume(file, folder = "hirehub/resumes") {
    if (!file) throw new ApiError(400, "Resume file is required");
    const stored = await uploadBuffer(file, folder, "raw");
    const originalName = file.originalname || "resume";
    const format = String(originalName.split(".").pop() || "").toLowerCase();
    return {
      ...stored,
      originalName,
      format,
      bytes: file.size,
    };
  },

  async destroy(publicId, resourceType = "image") {
    if (!publicId || !env.cloudinary.cloudName) return;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  },
};
