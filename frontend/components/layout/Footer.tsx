import Link from "next/link";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/jobs", label: "Jobs" },
      { href: "/companies", label: "Companies" },
      { href: "/for-employers", label: "For Employers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/register", label: "Get Started" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/login", label: "Login" },
      { href: "/forgot-password", label: "Reset password" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/about#privacy", label: "Privacy" },
      { href: "/about#terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border py-12">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="font-display text-2xl">HireHub</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Find talent. Find opportunity. Build what’s next.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-medium">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-300 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} HireHub</p>
        <p>A modern recruitment workspace.</p>
      </Container>
    </footer>
  );
}
