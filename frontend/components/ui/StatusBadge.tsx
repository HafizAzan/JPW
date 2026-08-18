import { Badge } from "./Badge";
import { titleCase } from "@/lib/format";

const map: Record<string, "sand" | "copper" | "forest" | "gold" | "rose"> = {
  applied: "sand",
  reviewing: "gold",
  draft: "sand",
  pending: "gold",
  shortlisted: "copper",
  interview: "copper",
  approved: "forest",
  hired: "forest",
  rejected: "rose",
  closed: "sand",
  active: "forest",
  suspended: "rose",
};

export function StatusBadge({ value }: { value?: string }) {
  if (!value) return null;
  return <Badge tone={map[value] ?? "sand"}>{titleCase(value)}</Badge>;
}
