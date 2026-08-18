import { jobService } from "../services/job.service.js";
import { employerService } from "../services/employer.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";

export const employerController = {
  jobs: asyncHandler(async (req, res) => {
    send(res, 200, await jobService.employerJobs(req.user._id, req.query));
  }),
  analytics: asyncHandler(async (req, res) => {
    send(res, 200, await employerService.analytics(req.user._id));
  }),
};
