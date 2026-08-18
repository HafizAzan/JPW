import { jobService } from "../services/job.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";

export const jobController = {
  list: asyncHandler(async (req, res) => {
    send(res, 200, await jobService.list(req.query, { publicOnly: true }));
  }),

  get: asyncHandler(async (req, res) => {
    const job = await jobService.getById(req.params.id, { incrementViews: true });
    const [saved, applied] = await Promise.all([
      jobService.isSaved(req.user?._id, job._id),
      jobService.hasApplied(req.user?._id, job._id),
    ]);
    send(res, 200, { job, saved, applied });
  }),

  close: asyncHandler(async (req, res) => {
    send(
      res,
      200,
      await jobService.close(req.params.id, req.user._id, req.user.role === "admin"),
      "Job closed"
    );
  }),

  duplicate: asyncHandler(async (req, res) => {
    send(res, 201, await jobService.duplicate(req.params.id, req.user._id), "Job duplicated as draft");
  }),

  create: asyncHandler(async (req, res) => {
    send(res, 201, await jobService.create(req.user._id, req.body), "Job submitted for review");
  }),

  update: asyncHandler(async (req, res) => {
    send(
      res,
      200,
      await jobService.update(req.params.id, req.user._id, req.body, req.user.role === "admin"),
      "Job updated"
    );
  }),

  remove: asyncHandler(async (req, res) => {
    send(
      res,
      200,
      await jobService.remove(req.params.id, req.user._id, req.user.role === "admin"),
      "Job deleted"
    );
  }),

  save: asyncHandler(async (req, res) => {
    send(res, 200, await jobService.save(req.user._id, req.params.id), "Job saved");
  }),

  unsave: asyncHandler(async (req, res) => {
    send(res, 200, await jobService.unsave(req.user._id, req.params.id), "Job removed from saved");
  }),
};
