import { DashboardShell } from "@/components/layout/DashboardShell";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/resume", label: "Resume" },
  { href: "/dashboard/applications", label: "Applications" },
  { href: "/dashboard/companies", label: "Companies" },
  { href: "/dashboard/saved-jobs", label: "Saved jobs" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="jobseeker" nav={nav}>
      {children}
    </DashboardShell>
  );
}
