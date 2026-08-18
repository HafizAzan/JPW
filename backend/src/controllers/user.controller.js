import { userService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";

export const userController = {
  profile: asyncHandler(async (req, res) => {
    send(res, 200, await userService.getProfile(req.user._id));
  }),

  updateProfile: asyncHandler(async (req, res) => {
    send(res, 200, await userService.updateProfile(req.user._id, req.body), "Profile updated");
  }),

  updateAiSettings: asyncHandler(async (req, res) => {
    send(res, 200, await userService.updateAiSettings(req.user._id, req.body), "AI settings saved");
  }),

  updateSkills: asyncHandler(async (req, res) => {
    send(res, 200, await userService.updateSkills(req.user._id, req.body.skills), "Skills updated");
  }),

  avatar: asyncHandler(async (req, res) => {
    send(res, 200, await userService.uploadAvatar(req.user._id, req.file), "Avatar updated");
  }),

  resume: asyncHandler(async (req, res) => {
    send(res, 200, await userService.uploadResume(req.user._id, req.file), "Resume uploaded");
  }),

  setActiveResume: asyncHandler(async (req, res) => {
    send(res, 200, await userService.setActiveResume(req.user._id, req.params.id), "Resume selected");
  }),

  deleteResume: asyncHandler(async (req, res) => {
    send(res, 200, await userService.deleteResume(req.user._id, req.params.id), "Resume removed");
  }),

  savedJobs: asyncHandler(async (req, res) => {
    send(res, 200, await userService.savedJobs(req.user._id, req.query));
  }),

  recommended: asyncHandler(async (req, res) => {
    send(res, 200, await userService.recommendedJobs(req.user._id));
  }),
};
