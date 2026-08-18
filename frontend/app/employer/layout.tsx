import { DashboardShell } from "@/components/layout/DashboardShell";

const nav = [
  { href: "/employer", label: "Overview" },
  { href: "/employer/company", label: "Company" },
  { href: "/employer/jobs", label: "Jobs" },
  { href: "/employer/jobs/create", label: "Create job" },
  { href: "/employer/settings", label: "Settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="employer" nav={nav}>
      {children}
    </DashboardShell>
  );
}
