import { DashboardShell } from "@/components/layout/DashboardShell";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/settings", label: "Settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="admin" nav={nav}>
      {children}
    </DashboardShell>
  );
}
