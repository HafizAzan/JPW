import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    originalName: String,
    format: String,
    bytes: Number,
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: fileSchema,
    coverLetter: { type: String, maxlength: 4000 },
    recruiterNote: { type: String, maxlength: 2000, select: false },
    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "interview", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, createdAt: -1 });
applicationSchema.index({ employer: 1, status: 1 });

export const Application = mongoose.model("Application", applicationSchema);
