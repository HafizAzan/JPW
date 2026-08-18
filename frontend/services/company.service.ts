import { api, qs } from "@/lib/api";
import type { Company, Job, Paginated } from "@/types";

export const companyService = {
  list(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Company>>(`/companies${qs(params)}`);
  },
  get(id: string) {
    return api<{ company: Company; jobs: Job[] }>(`/companies/${id}`);
  },
  mine() {
    return api<Company | null>("/companies/mine");
  },
  create(payload: unknown) {
    return api<Company>("/companies", { method: "POST", body: payload });
  },
  update(id: string, payload: unknown) {
    return api<Company>(`/companies/${id}`, { method: "PUT", body: payload });
  },
  uploadLogo(id: string, file: File) {
    const body = new FormData();
    body.append("file", file);
    return api<Company>(`/companies/${id}/logo`, { method: "POST", body });
  },
};
