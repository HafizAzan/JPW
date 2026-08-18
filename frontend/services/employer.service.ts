import { api, qs } from "@/lib/api";
import type { Job, Paginated } from "@/types";

export type EmployerAnalytics = {
  totals: {
    jobs: number;
    applications: number;
    shortlisted: number;
    interview: number;
    hired: number;
    rejected: number;
  };
  jobs: Array<{
    _id: string;
    title: string;
    views: number;
    status: string;
    applications: number;
    shortlisted: number;
    interview: number;
    hired: number;
    rejected: number;
  }>;
};

export const employerService = {
  jobs(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Job>>(`/employer/jobs${qs(params)}`);
  },
  analytics() {
    return api<EmployerAnalytics>("/employer/analytics");
  },
};
