import { titleCase } from "@/lib/format";
import type { Role } from "@/types";

export const ROLE_TONE: Record<Role, "copper" | "forest" | "gold"> = {
  jobseeker: "copper",
  employer: "forest",
  admin: "gold",
};

export function roleLabel(role: Role) {
  if (role === "jobseeker") return "Job seeker";
  return titleCase(role);
}
