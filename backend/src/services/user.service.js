import { User } from "../models/User.js";
import { SavedJob } from "../models/SavedJob.js";
import { Job } from "../models/Job.js";
import { Company } from "../models/Company.js";
import { Application } from "../models/Application.js";
import { Notification } from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadService } from "./upload.service.js";
import { parsePagination, paginated } from "../utils/pagination.js";

const MAX_RESUMES = 8;

function snapshotResume(file) {
  if (!file?.url) return undefined;
  return {
    url: file.url,
    publicId: file.publicId,
    originalName: file.originalName,
    format: file.format,
    bytes: file.bytes,
  };
}

function syncActiveResume(user) {
  if ((!user.resumes || user.resumes.length === 0) && user.resume?.url) {
    user.resumes.push({ ...snapshotResume(user.resume) });
  }

  const list = user.resumes ?? [];
  let active = list.find((item) => String(item._id) === String(user.activeResumeId));
  if (!active) active = list[0];
  user.activeResumeId = active?._id;
  user.resume = snapshotResume(active);
}

export const userService = {
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    syncActiveResume(user);
    if (user.isModified()) await user.save();
    return user.toPublic();
  },

  async updateProfile(userId, payload) {
    const user = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new ApiError(404, "User not found");
    return user.toPublic();
  },

  async updateSkills(userId, skills) {
    const user = await User.findByIdAndUpdate(
      userId,
      { skills },
      { new: true, runValidators: true }
    );
    if (!user) throw new ApiError(404, "User not found");
    return user.toPublic();
  },

  async updateAiSettings(userId, { ollamaBaseUrl, ollamaModel }) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    user.ollamaBaseUrl = ollamaBaseUrl ?? "";
    user.ollamaModel = ollamaModel ?? "";
    await user.save();
    return user.toPublic();
  },

  async uploadAvatar(userId, file) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    if (user.avatar?.publicId) await uploadService.destroy(user.avatar.publicId);
    user.avatar = await uploadService.uploadImage(file, "hirehub/avatars");
    await user.save();
    return user.toPublic();
  },

  async uploadResume(userId, file) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    syncActiveResume(user);
    if ((user.resumes?.length ?? 0) >= MAX_RESUMES) {
      throw new ApiError(400, `You can keep up to ${MAX_RESUMES} resumes`);
    }
    const stored = await uploadService.uploadResume(file, "hirehub/resumes");
    user.resumes.push(stored);
    user.activeResumeId = user.resumes[user.resumes.length - 1]._id;
    syncActiveResume(user);
    await user.save();
    return user.toPublic();
  },

  async setActiveResume(userId, resumeId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    syncActiveResume(user);
    const match = user.resumes.find((item) => String(item._id) === String(resumeId));
    if (!match) throw new ApiError(404, "Resume not found");
    user.activeResumeId = match._id;
    syncActiveResume(user);
    await user.save();
    return user.toPublic();
  },

  async deleteResume(userId, resumeId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    syncActiveResume(user);

    const targetId = resumeId || user.activeResumeId;
    const item = user.resumes.find((entry) => String(entry._id) === String(targetId));
    if (!item) throw new ApiError(404, "Resume not found");

    if (item.publicId) await uploadService.destroy(item.publicId, "raw");
    user.resumes = user.resumes.filter((entry) => String(entry._id) !== String(item._id));
    if (String(user.activeResumeId) === String(item._id)) {
      user.activeResumeId = user.resumes[0]?._id;
    }
    syncActiveResume(user);
    await user.save();
    return user.toPublic();
  },

  async savedJobs(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { user: userId };
    const [rows, total] = await Promise.all([
      SavedJob.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "job",
          populate: { path: "company", select: "name logo location industry" },
        }),
      SavedJob.countDocuments(filter),
    ]);
    return paginated(
      rows.map((row) => row.job).filter(Boolean),
      total,
      page,
      limit
    );
  },

  async recommendedJobs(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const skills = (user.skills ?? []).map((s) => s.toLowerCase());
    const jobs = await Job.find({ status: "approved" })
      .populate("company", "name logo location industry")
      .sort({ createdAt: -1 })
      .limit(40);

    const scored = jobs
      .map((job) => {
        const jobSkills = (job.skills ?? []).map((s) => s.toLowerCase());
        const matches = skills.filter((skill) => jobSkills.includes(skill));
        const score = jobSkills.length ? matches.length / jobSkills.length : 0;
        return { job, score, matches: matches.length };
      })
      .filter((item) => item.score > 0 || skills.length === 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ job, score }) => ({
        ...job.toObject(),
        matchScore: Math.round(score * 100),
      }));

    return scored;
  },

  async purgeAccount(user) {
    if (user.role === "admin") {
      const admins = await User.countDocuments({ role: "admin" });
      if (admins <= 1) {
        throw new ApiError(400, "The last admin account cannot be deleted");
      }
    }

    const companies = await Company.find({ owner: user._id }).select("_id");
    const companyIds = companies.map((company) => company._id);
    const jobs = await Job.find({
      $or: [{ employer: user._id }, { company: { $in: companyIds } }],
    }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    await Application.deleteMany({
      $or: [{ applicant: user._id }, { employer: user._id }, { job: { $in: jobIds } }],
    });
    await SavedJob.deleteMany({ $or: [{ user: user._id }, { job: { $in: jobIds } }] });
    if (jobIds.length) await Job.deleteMany({ _id: { $in: jobIds } });
    if (companyIds.length) await Company.deleteMany({ _id: { $in: companyIds } });
    await Notification.deleteMany({ user: user._id });
    await user.deleteOne();
    return { deleted: true };
  },
};
