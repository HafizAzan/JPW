import { api, qs } from "@/lib/api";
import type { Application, ApplicationStatus, Paginated } from "@/types";

export const applicationService = {
  apply(payload: { jobId: string; coverLetter?: string }) {
    return api<Application>("/applications", { method: "POST", body: payload });
  },
  mine(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Application>>(`/applications/my${qs(params)}`);
  },
  get(id: string) {
    return api<Application>(`/applications/${id}`);
  },
  withdraw(id: string) {
    return api<{ deleted: boolean }>(`/applications/${id}`, { method: "DELETE" });
  },
  forJob(jobId: string, params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Application>>(`/jobs/${jobId}/applications${qs(params)}`);
  },
  updateStatus(id: string, status: ApplicationStatus, recruiterNote?: string) {
    return api<Application>(`/applications/${id}/status`, { method: "PATCH", body: { status, recruiterNote } });
  },
};
