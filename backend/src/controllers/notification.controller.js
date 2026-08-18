import { notificationService } from "../services/notification.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const notificationController = {
  list: asyncHandler(async (req, res) => {
    send(res, 200, await notificationService.list(req.user._id, req.query));
  }),
  read: asyncHandler(async (req, res) => {
    const item = await notificationService.markRead(req.user._id, req.params.id);
    if (!item) throw new ApiError(404, "Notification not found");
    send(res, 200, item, "Marked as read");
  }),
  readAll: asyncHandler(async (req, res) => {
    await notificationService.markAllRead(req.user._id);
    send(res, 200, { read: true }, "All notifications marked as read");
  }),
};
