"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { homeFor, useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
  { href: "/for-employers", label: "For Employers" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight transition-opacity duration-300 hover:opacity-80">
          HireHub
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors duration-300",
                pathname.startsWith(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <NotificationBell />
              <Button variant="ghost" onClick={() => router.push(homeFor(user.role))}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => setSignOutOpen(true)}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/register")}>Get Started</Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full transition duration-300 hover:bg-muted"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </Container>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-2 py-2 transition-colors duration-300 hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="block rounded-xl px-2 py-2 transition-colors duration-300 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
    </header>
  );
}
