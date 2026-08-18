import { Notification } from "../models/Notification.js";
import { parsePagination, paginated } from "../utils/pagination.js";

export const notificationService = {
  create({ user, title, message, type = "system", link }) {
    return Notification.create({ user, title, message, type, link });
  },

  async list(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { user: userId };
    const [items, total, unread] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: userId, read: false }),
    ]);
    return { ...paginated(items, total, page, limit), unread };
  },

  async markRead(userId, id) {
    return Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { read: true },
      { new: true }
    );
  },

  markAllRead(userId) {
    return Notification.updateMany({ user: userId, read: false }, { read: true });
  },
};
