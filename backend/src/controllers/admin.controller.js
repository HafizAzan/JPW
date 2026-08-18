import { adminService } from "../services/admin.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";

export const adminController = {
  stats: asyncHandler(async (_req, res) => {
    send(res, 200, await adminService.stats());
  }),
  users: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.users(req.query));
  }),
  user: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.getUser(req.params.id));
  }),
  userStatus: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.updateUserStatus(req.params.id, req.body.status), "User updated");
  }),
  deleteUser: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.deleteUser(req.params.id), "User deleted");
  }),
  jobs: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.jobs(req.query));
  }),
  approveJob: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.setJobStatus(req.params.id, "approved"), "Job approved");
  }),
  rejectJob: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.setJobStatus(req.params.id, "rejected"), "Job rejected");
  }),
  deleteJob: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.deleteJob(req.params.id), "Job deleted");
  }),
  companies: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.companies(req.query));
  }),
  verifyCompany: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.verifyCompany(req.params.id), "Company verified");
  }),
  deleteCompany: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.deleteCompany(req.params.id), "Company deleted");
  }),
  applications: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.applications(req.query));
  }),
  deleteApplication: asyncHandler(async (req, res) => {
    send(res, 200, await adminService.deleteApplication(req.params.id), "Application deleted");
  }),
};
