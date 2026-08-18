import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    workplace: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "onsite",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior"],
      default: "mid",
    },
    salary: salarySchema,
    skills: [{ type: String, trim: true }],
    category: { type: String, required: true },
    deadline: Date,
    remote: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "closed", "expired"],
      default: "pending",
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", skills: "text" });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ employer: 1, status: 1 });
jobSchema.index({ slug: 1 });
jobSchema.index({ category: 1, jobType: 1, experienceLevel: 1 });
jobSchema.index({ "salary.min": 1, "salary.max": 1 });

export const Job = mongoose.model("Job", jobSchema);
