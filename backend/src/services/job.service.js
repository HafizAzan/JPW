import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { Company } from "../models/Company.js";
import { SavedJob } from "../models/SavedJob.js";
import { Application } from "../models/Application.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginated } from "../utils/pagination.js";
import { slugify } from "../utils/slug.js";

async function uniqueSlug(Model, title) {
  const base = slugify(title) || "item";
  let slug = base;
  let index = 1;
  while (await Model.exists({ slug })) {
    slug = `${base}-${index++}`;
  }
  return slug;
}

function jobQuery(id) {
  if (mongoose.isValidObjectId(id)) return { $or: [{ _id: id }, { slug: id }] };
  return { slug: id };
}

function buildJobFilter(query, { publicOnly = false } = {}) {
  const filter = {};

  if (publicOnly) filter.status = "approved";
  if (query.search) {
    filter.$or = [
      { title: new RegExp(query.search, "i") },
      { description: new RegExp(query.search, "i") },
      { skills: new RegExp(query.search, "i") },
      { category: new RegExp(query.search, "i") },
    ];
  }
  if (query.location) filter.location = new RegExp(query.location, "i");
  if (query.type) filter.jobType = query.type;
  if (query.workplace) filter.workplace = query.workplace;
  if (query.experience) filter.experienceLevel = query.experience;
  if (query.category) filter.category = new RegExp(query.category, "i");
  if (query.skills) {
    filter.skills = { $in: query.skills.split(",").map((s) => s.trim()) };
  }
  if (query.minSalary || query.maxSalary) {
    filter["salary.min"] = {};
    if (query.minSalary) filter["salary.min"].$gte = Number(query.minSalary);
    if (query.maxSalary) filter["salary.max"] = { $lte: Number(query.maxSalary) };
  }
  if (query.datePosted) {
    const days = Number(query.datePosted);
    if (!Number.isNaN(days)) {
      filter.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    }
  }

  return filter;
}

function sortMap(sort) {
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "salary-asc") return { "salary.min": 1 };
  if (sort === "salary-desc") return { "salary.max": -1 };
  return { createdAt: -1 };
}

export const jobService = {
  async list(query, { publicOnly = true } = {}) {
    const { page, limit, skip } = parsePagination(query);
    const filter = buildJobFilter(query, { publicOnly });
    const [items, total] = await Promise.all([
      Job.find(filter)
        .populate("company", "name logo location industry verified")
        .sort(sortMap(query.sort))
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(id, { incrementViews = false } = {}) {
    const query = jobQuery(id);
    const job = incrementViews
      ? await Job.findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true })
      : await Job.findOne(query);

    if (!job) throw new ApiError(404, "Job not found");
    await job.populate("company", "name logo location industry website verified description slug");
    await job.populate("employer", "name avatar");
    return job;
  },

  async create(employerId, payload) {
    const company = await Company.findOne({ owner: employerId });
    if (!company) {
      throw new ApiError(400, "Create a company profile before posting a job");
    }

    return Job.create({
      ...payload,
      slug: await uniqueSlug(Job, payload.title),
      remote: payload.workplace === "remote" || payload.remote,
      employer: employerId,
      company: company._id,
      status: payload.status === "draft" ? "draft" : "pending",
    });
  },

  async update(id, employerId, payload, isAdmin = false) {
    const job = await Job.findById(id);
    if (!job) throw new ApiError(404, "Job not found");
    if (!isAdmin && String(job.employer) !== String(employerId)) {
      throw new ApiError(403, "You can only edit your own jobs");
    }

    Object.assign(job, payload);
    if (payload.workplace) job.remote = payload.workplace === "remote";
    if (payload.title) job.slug = job.slug || (await uniqueSlug(Job, payload.title));
    if (!isAdmin && payload.status !== "draft") job.status = "pending";
    await job.save();
    return job;
  },

  async close(id, employerId, isAdmin = false) {
    const job = await Job.findById(id);
    if (!job) throw new ApiError(404, "Job not found");
    if (!isAdmin && String(job.employer) !== String(employerId)) {
      throw new ApiError(403, "You can only close your own jobs");
    }
    job.status = "closed";
    await job.save();
    return job;
  },

  async duplicate(id, employerId) {
    const job = await Job.findById(id);
    if (!job) throw new ApiError(404, "Job not found");
    if (String(job.employer) !== String(employerId)) {
      throw new ApiError(403, "You can only duplicate your own jobs");
    }
    const copy = job.toObject();
    delete copy._id;
    copy.title = `${job.title} (Copy)`;
    copy.slug = await uniqueSlug(Job, copy.title);
    copy.status = "draft";
    copy.views = 0;
    return Job.create(copy);
  },

  async remove(id, employerId, isAdmin = false) {
    const job = await Job.findById(id);
    if (!job) throw new ApiError(404, "Job not found");
    if (!isAdmin && String(job.employer) !== String(employerId)) {
      throw new ApiError(403, "You can only delete your own jobs");
    }
    await job.deleteOne();
    await SavedJob.deleteMany({ job: id });
    return { deleted: true };
  },

  async employerJobs(employerId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { employer: employerId };
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      Job.find(filter).populate("company", "name logo").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async save(userId, jobId) {
    const job = await Job.findById(jobId);
    if (!job || job.status !== "approved") throw new ApiError(404, "Job not found");
    await SavedJob.updateOne({ user: userId, job: jobId }, { user: userId, job: jobId }, { upsert: true });
    return { saved: true };
  },

  async unsave(userId, jobId) {
    await SavedJob.deleteOne({ user: userId, job: jobId });
    return { saved: false };
  },

  async isSaved(userId, jobId) {
    if (!userId) return false;
    return Boolean(await SavedJob.exists({ user: userId, job: jobId }));
  },

  async hasApplied(userId, jobId) {
    if (!userId) return false;
    return Boolean(await Application.exists({ applicant: userId, job: jobId }));
  },
};
