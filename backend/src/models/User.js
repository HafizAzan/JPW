import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

const resumeFileSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    originalName: String,
    format: String,
    bytes: Number,
  },
  { _id: true, timestamps: true }
);

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    description: String,
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true },
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    description: String,
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    avatar: fileSchema,
    headline: { type: String, maxlength: 160 },
    bio: { type: String, maxlength: 1000 },
    location: String,
    phone: String,
    linkedin: String,
    github: String,
    portfolio: String,
    skills: [{ type: String, trim: true }],
    experience: [experienceSchema],
    education: [educationSchema],
    resume: fileSchema,
    resumes: [resumeFileSchema],
    activeResumeId: { type: mongoose.Schema.Types.ObjectId },
    emailVerified: { type: Boolean, default: true },
    otpHash: { type: String, select: false },
    otpPurpose: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    otpAttempts: { type: Number, select: false, default: 0 },
    otpSentAt: { type: Date, select: false },
    pendingEmail: { type: String, select: false, lowercase: true, trim: true },
    pendingPasswordHash: { type: String, select: false },
    ollamaBaseUrl: { type: String, trim: true, default: "" },
    ollamaModel: { type: String, trim: true, default: "" },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });
userSchema.index({ skills: 1 });

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || this.$locals.skipPasswordHash) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublic = function toPublic() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.otpHash;
  delete obj.otpPurpose;
  delete obj.otpExpires;
  delete obj.otpAttempts;
  delete obj.otpSentAt;
  delete obj.pendingEmail;
  delete obj.pendingPasswordHash;
  return obj;
};

export const User = mongoose.model("User", userSchema);
