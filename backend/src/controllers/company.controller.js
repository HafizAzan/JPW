import { companyService } from "../services/company.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";

export const companyController = {
  list: asyncHandler(async (req, res) => {
    send(res, 200, await companyService.list(req.query));
  }),

  get: asyncHandler(async (req, res) => {
    send(res, 200, await companyService.getById(req.params.id));
  }),

  mine: asyncHandler(async (req, res) => {
    send(res, 200, await companyService.mine(req.user._id));
  }),

  create: asyncHandler(async (req, res) => {
    send(res, 201, await companyService.create(req.user._id, req.body), "Company created");
  }),

  update: asyncHandler(async (req, res) => {
    send(
      res,
      200,
      await companyService.update(req.params.id, req.user._id, req.body, req.user.role === "admin"),
      "Company updated"
    );
  }),

  remove: asyncHandler(async (req, res) => {
    send(
      res,
      200,
      await companyService.remove(req.params.id, req.user._id, req.user.role === "admin"),
      "Company deleted"
    );
  }),

  logo: asyncHandler(async (req, res) => {
    send(res, 200, await companyService.uploadLogo(req.params.id, req.user._id, req.file), "Logo updated");
  }),
};
