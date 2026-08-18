"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { homeFor, useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/cn";
import type { Role } from "@/types";

type NavItem = { href: string; label: string };

export function DashboardShell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [signOutOpen, setSignOutOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role && user.role !== "admin") {
      router.replace(homeFor(user.role));
    }
  }, [user, loading, role, router]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Preparing your workspace…</div>;
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="shrink-0 border-b border-sidebar-foreground/10 bg-sidebar text-sidebar-foreground lg:h-svh lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/" className="font-display text-2xl tracking-tight text-sidebar-foreground">
            HireHub
          </Link>
        </div>
        <nav className="flex gap-2 overflow-auto px-3 pb-4 lg:flex-col">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm whitespace-nowrap transition duration-300",
                  active
                    ? "bg-sidebar-foreground/15 font-medium text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-xs tracking-[0.18em] text-primary uppercase">{role}</p>
            <p className="font-medium">Welcome, {user.name.split(" ")[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell />
            <Avatar name={user.name} src={user.avatar?.url} />
            <button
              type="button"
              className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              onClick={() => setSignOutOpen(true)}
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-8 sm:px-8">
          {children}
        </main>
      </div>
      <ConfirmDialog
        open={signOutOpen}
        title="Sign out?"
        description="You will need to log in again to access your dashboard."
        confirmLabel="Sign out"
        cancelLabel="Stay"
        danger
        onClose={() => setSignOutOpen(false)}
        onConfirm={() => {
          setSignOutOpen(false);
          logout().then(() => router.push("/"));
        }}
      />
    </div>
  );
}
