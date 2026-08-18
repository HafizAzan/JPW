import { api, qs } from "@/lib/api";
import type { Application, Company, Job, Paginated, User, UserStatus } from "@/types";

export type AdminStats = {
  users: number;
  employers: number;
  jobseekers: number;
  jobs: number;
  applications: number;
  activeJobs: number;
  pendingJobs: number;
  companies: number;
};

export const adminService = {
  stats() {
    return api<AdminStats>("/admin/stats");
  },
  users(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<User>>(`/admin/users${qs(params)}`);
  },
  getUser(id: string) {
    return api<User>(`/admin/users/${id}`);
  },
  updateUserStatus(id: string, status: UserStatus) {
    return api<User>(`/admin/users/${id}/status`, { method: "PATCH", body: { status } });
  },
  deleteUser(id: string) {
    return api<{ deleted: boolean }>(`/admin/users/${id}`, { method: "DELETE" });
  },
  jobs(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Job>>(`/admin/jobs${qs(params)}`);
  },
  approveJob(id: string) {
    return api<Job>(`/admin/jobs/${id}/approve`, { method: "PATCH" });
  },
  rejectJob(id: string) {
    return api<Job>(`/admin/jobs/${id}/reject`, { method: "PATCH" });
  },
  deleteJob(id: string) {
    return api<{ deleted: boolean }>(`/admin/jobs/${id}`, { method: "DELETE" });
  },
  companies(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Company>>(`/admin/companies${qs(params)}`);
  },
  verifyCompany(id: string) {
    return api<Company>(`/admin/companies/${id}/verify`, { method: "PATCH" });
  },
  deleteCompany(id: string) {
    return api<{ deleted: boolean }>(`/admin/companies/${id}`, { method: "DELETE" });
  },
  applications(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Application>>(`/admin/applications${qs(params)}`);
  },
  deleteApplication(id: string) {
    return api<{ deleted: boolean }>(`/admin/applications/${id}`, { method: "DELETE" });
  },
};
