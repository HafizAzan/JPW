import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    logo: fileSchema,
    description: { type: String, maxlength: 3000 },
    website: String,
    industry: String,
    location: String,
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    foundedYear: Number,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

companySchema.index({ owner: 1 });
companySchema.index({ name: "text", industry: "text", location: "text" });

export const Company = mongoose.model("Company", companySchema);
