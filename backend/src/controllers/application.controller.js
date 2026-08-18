import { applicationService } from "../services/application.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";

export const applicationController = {
  create: asyncHandler(async (req, res) => {
    send(res, 201, await applicationService.apply(req.user._id, req.body), "Application submitted");
  }),

  mine: asyncHandler(async (req, res) => {
    send(res, 200, await applicationService.myApplications(req.user._id, req.query));
  }),

  get: asyncHandler(async (req, res) => {
    send(res, 200, await applicationService.getById(req.params.id, req.user));
  }),

  withdraw: asyncHandler(async (req, res) => {
    send(res, 200, await applicationService.withdraw(req.params.id, req.user._id), "Application withdrawn");
  }),

  forJob: asyncHandler(async (req, res) => {
    send(
      res,
      200,
      await applicationService.forJob(
        req.params.jobId,
        req.user._id,
        req.query,
        req.user.role === "admin"
      )
    );
  }),

  updateStatus: asyncHandler(async (req, res) => {
    send(
      res,
      200,
      await applicationService.updateStatus(
        req.params.id,
        req.user._id,
        req.body.status,
        req.user.role === "admin",
        req.body.recruiterNote
      ),
      "Status updated"
    );
  }),
};
