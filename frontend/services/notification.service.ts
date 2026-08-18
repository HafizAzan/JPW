import { api, qs } from "@/lib/api";
import type { Notification, Paginated } from "@/types";

export const notificationService = {
  list(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Notification> & { unread: number }>(`/notifications${qs(params)}`);
  },
  read(id: string) {
    return api<Notification>(`/notifications/${id}/read`, { method: "PATCH" });
  },
  readAll() {
    return api<{ read: boolean }>("/notifications/read-all", { method: "PATCH" });
  },
};
