import { api, qs } from "@/lib/api";
import type { Job, Paginated, User } from "@/types";

export const userService = {
  profile() {
    return api<User>("/users/profile");
  },
  updateProfile(payload: Partial<User>) {
    return api<User>("/users/profile", { method: "PUT", body: payload });
  },
  updateSkills(skills: string[]) {
    return api<User>("/users/skills", { method: "PUT", body: { skills } });
  },
  uploadAvatar(file: File) {
    const body = new FormData();
    body.append("file", file);
    return api<User>("/users/avatar", { method: "POST", body });
  },
  uploadResume(file: File) {
    const body = new FormData();
    body.append("file", file);
    return api<User>("/users/resume", { method: "POST", body });
  },
  setActiveResume(id: string) {
    return api<User>(`/users/resume/${id}/active`, { method: "PUT" });
  },
  deleteResume(id?: string) {
    return api<User>(id ? `/users/resume/${id}` : "/users/resume", { method: "DELETE" });
  },
  savedJobs(params: Record<string, string | number | undefined> = {}) {
    return api<Paginated<Job>>(`/users/saved-jobs${qs(params)}`);
  },
  recommended() {
    return api<Job[]>("/users/recommended");
  },
  updateAiSettings(payload: { ollamaBaseUrl: string; ollamaModel: string }) {
    return api<User>("/users/ai-settings", { method: "PUT", body: payload });
  },
};
