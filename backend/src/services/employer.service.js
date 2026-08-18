import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";

export const employerService = {
  async analytics(employerId) {
    const employer = new mongoose.Types.ObjectId(employerId);
    const [jobs, applications, byStatus, perJob] = await Promise.all([
      Job.countDocuments({ employer }),
      Application.countDocuments({ employer }),
      Application.aggregate([
        { $match: { employer } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: { employer } },
        {
          $lookup: {
            from: "applications",
            localField: "_id",
            foreignField: "job",
            as: "applications",
          },
        },
        {
          $project: {
            title: 1,
            views: 1,
            status: 1,
            applications: { $size: "$applications" },
            shortlisted: {
              $size: {
                $filter: {
                  input: "$applications",
                  as: "app",
                  cond: { $eq: ["$$app.status", "shortlisted"] },
                },
              },
            },
            interview: {
              $size: {
                $filter: {
                  input: "$applications",
                  as: "app",
                  cond: { $eq: ["$$app.status", "interview"] },
                },
              },
            },
            hired: {
              $size: {
                $filter: {
                  input: "$applications",
                  as: "app",
                  cond: { $eq: ["$$app.status", "hired"] },
                },
              },
            },
            rejected: {
              $size: {
                $filter: {
                  input: "$applications",
                  as: "app",
                  cond: { $eq: ["$$app.status", "rejected"] },
                },
              },
            },
          },
        },
        { $sort: { applications: -1 } },
        { $limit: 12 },
      ]),
    ]);

    const statusMap = Object.fromEntries(byStatus.map((row) => [row._id, row.count]));

    return {
      totals: {
        jobs,
        applications,
        shortlisted: statusMap.shortlisted ?? 0,
        interview: statusMap.interview ?? 0,
        hired: statusMap.hired ?? 0,
        rejected: statusMap.rejected ?? 0,
      },
      jobs: perJob,
    };
  },
};
