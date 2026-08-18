import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Company } from "../models/Company.js";
import { Application } from "../models/Application.js";
import { ApiError } from "../utils/ApiError.js";
import { notificationService } from "./notification.service.js";
import { parsePagination, paginated } from "../utils/pagination.js";

export const adminService = {
  async stats() {
    const [
      users,
      employers,
      jobseekers,
      jobs,
      applications,
      activeJobs,
      pendingJobs,
      companies,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "employer" }),
      User.countDocuments({ role: "jobseeker" }),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ status: "approved" }),
      Job.countDocuments({ status: "pending" }),
      Company.countDocuments(),
    ]);

    return {
      users,
      employers,
      jobseekers,
      jobs,
      applications,
      activeJobs,
      pendingJobs,
      companies,
    };
  },

  async users(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: new RegExp(query.search, "i") },
        { email: new RegExp(query.search, "i") },
      ];
    }
    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async getUser(id) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user.toPublic();
  },

  async updateUserStatus(id, status) {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) throw new ApiError(404, "User not found");
    return user.toPublic();
  },

  async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    if (user.role === "admin") throw new ApiError(400, "Admin accounts cannot be deleted here");
    await user.deleteOne();
    return { deleted: true };
  },

  async jobs(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.search) filter.title = new RegExp(query.search, "i");
    const [items, total] = await Promise.all([
      Job.find(filter)
        .populate("company", "name logo")
        .populate("employer", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async setJobStatus(id, status) {
    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) throw new ApiError(404, "Job not found");
    await notificationService.create({
      user: job.employer,
      title: status === "approved" ? "Job approved" : "Job rejected",
      message:
        status === "approved"
          ? `“${job.title}” is now live.`
          : `“${job.title}” was not approved.`,
      type: "job",
      link: "/employer/jobs",
    });
    return job;
  },

  async deleteJob(id) {
    const job = await Job.findById(id);
    if (!job) throw new ApiError(404, "Job not found");
    await job.deleteOne();
    return { deleted: true };
  },

  async companies(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.search) filter.name = new RegExp(query.search, "i");
    if (query.verified === "true") filter.verified = true;
    if (query.verified === "false") filter.verified = false;
    const [items, total] = await Promise.all([
      Company.find(filter).populate("owner", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Company.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async verifyCompany(id) {
    const company = await Company.findByIdAndUpdate(id, { verified: true }, { new: true });
    if (!company) throw new ApiError(404, "Company not found");
    return company;
  },

  async deleteCompany(id) {
    const company = await Company.findById(id);
    if (!company) throw new ApiError(404, "Company not found");
    await Job.deleteMany({ company: id });
    await company.deleteOne();
    return { deleted: true };
  },

  async applications(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      const term = new RegExp(query.search, "i");
      const [users, jobs] = await Promise.all([
        User.find({ $or: [{ name: term }, { email: term }] }).select("_id"),
        Job.find({ title: term }).select("_id"),
      ]);
      filter.$or = [{ applicant: { $in: users.map((row) => row._id) } }, { job: { $in: jobs.map((row) => row._id) } }];
    }
    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate({
          path: "job",
          select: "title location slug company",
          populate: { path: "company", select: "name logo" },
        })
        .populate("applicant", "name email avatar headline location")
        .populate("employer", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async deleteApplication(id) {
    const application = await Application.findById(id);
    if (!application) throw new ApiError(404, "Application not found");
    await application.deleteOne();
    return { deleted: true };
  },
};
