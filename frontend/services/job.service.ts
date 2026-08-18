import { api, qs } from "@/lib/api";
import type { Job, Paginated } from "@/types";

export const jobService = {
  list(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Job>>(`/jobs${qs(params)}`);
  },
  get(id: string) {
    return api<{ job: Job; saved: boolean; applied: boolean }>(`/jobs/${id}`);
  },
  create(payload: unknown) {
    return api<Job>("/jobs", { method: "POST", body: payload });
  },
  update(id: string, payload: unknown) {
    return api<Job>(`/jobs/${id}`, { method: "PUT", body: payload });
  },
  remove(id: string) {
    return api<{ deleted: boolean }>(`/jobs/${id}`, { method: "DELETE" });
  },
  save(id: string) {
    return api<{ saved: boolean }>(`/jobs/${id}/save`, { method: "POST" });
  },
  unsave(id: string) {
    return api<{ saved: boolean }>(`/jobs/${id}/save`, { method: "DELETE" });
  },
  close(id: string) {
    return api<Job>(`/jobs/${id}/close`, { method: "POST" });
  },
  duplicate(id: string) {
    return api<Job>(`/jobs/${id}/duplicate`, { method: "POST" });
  },
};
