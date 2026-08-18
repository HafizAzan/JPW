import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { notificationService } from "./notification.service.js";
import { parsePagination, paginated } from "../utils/pagination.js";

const STATUS_COPY = {
  applied: "Your application was received.",
  reviewing: "Your application is under review.",
  shortlisted: "Your application has been shortlisted.",
  interview: "You have been invited to interview.",
  rejected: "Your application was not selected this time.",
  hired: "Congratulations — you have been hired.",
};

export const applicationService = {
  async apply(applicantId, { jobId, coverLetter, resumeUrl, resumePublicId }) {
    const job = await Job.findById(jobId);
    if (!job || job.status !== "approved") throw new ApiError(404, "Job is not available");
    if (job.deadline && new Date(job.deadline) < new Date()) {
      throw new ApiError(400, "This job is no longer accepting applications");
    }

    const existing = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existing) throw new ApiError(409, "You have already applied to this job");

    const applicant = await User.findById(applicantId);
    const resume = resumeUrl
      ? { url: resumeUrl, publicId: resumePublicId }
      : applicant.resume;

    if (!resume?.url) {
      throw new ApiError(400, "Upload a resume before applying");
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      employer: job.employer,
      resume,
      coverLetter,
    });

    await notificationService.create({
      user: job.employer,
      title: "New application",
      message: `${applicant.name} applied for ${job.title}.`,
      type: "application",
      link: `/employer/jobs/${job._id}/applicants`,
    });

    return application;
  },

  async myApplications(applicantId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { applicant: applicantId };
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate({
          path: "job",
          populate: { path: "company", select: "name logo location" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(id, user) {
    const application = await Application.findById(id)
      .populate({
        path: "job",
        populate: { path: "company", select: "name logo location" },
      })
      .populate("applicant", "name email avatar headline bio skills experience education resume location phone linkedin github portfolio");

    if (!application) throw new ApiError(404, "Application not found");

    const isOwner = String(application.applicant._id) === String(user._id);
    const isEmployer = String(application.employer) === String(user._id);
    if (!isOwner && !isEmployer && user.role !== "admin") {
      throw new ApiError(403, "You cannot view this application");
    }
    if (isEmployer || user.role === "admin") {
      return Application.findById(id)
        .select("+recruiterNote")
        .populate({
          path: "job",
          populate: { path: "company", select: "name logo location" },
        })
        .populate("applicant", "name email avatar headline bio skills experience education resume location phone linkedin github portfolio");
    }
    return application;
  },

  async withdraw(id, applicantId) {
    const application = await Application.findById(id);
    if (!application) throw new ApiError(404, "Application not found");
    if (String(application.applicant) !== String(applicantId)) {
      throw new ApiError(403, "You can only withdraw your own application");
    }
    if (["hired", "interview"].includes(application.status)) {
      throw new ApiError(400, "This application can no longer be withdrawn");
    }
    await application.deleteOne();
    return { deleted: true };
  },

  async forJob(jobId, employerId, query, isAdmin = false) {
    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(404, "Job not found");
    if (!isAdmin && String(job.employer) !== String(employerId)) {
      throw new ApiError(403, "You can only view applicants for your jobs");
    }

    const { page, limit, skip } = parsePagination(query);
    const filter = { job: jobId };
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate("applicant", "name email avatar skills location resume")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async updateStatus(id, employerId, status, isAdmin = false, recruiterNote) {
    const application = await Application.findById(id).select("+recruiterNote").populate("job", "title");
    if (!application) throw new ApiError(404, "Application not found");
    if (!isAdmin && String(application.employer) !== String(employerId)) {
      throw new ApiError(403, "You can only update applicants for your jobs");
    }

    application.status = status;
    if (recruiterNote !== undefined) application.recruiterNote = recruiterNote;
    await application.save();

    await notificationService.create({
      user: application.applicant,
      title: "Application update",
      message: STATUS_COPY[status] ?? "Your application status has changed.",
      type: "status",
      link: "/dashboard/applications",
    });

    return application;
  },
};
