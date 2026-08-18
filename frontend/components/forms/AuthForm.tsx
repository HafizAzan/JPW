"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[80vh] place-items-center px-4 py-16">
      <Card className="w-full max-w-md animate-rise">
        <Link href="/" className="font-display text-2xl">
          HireHub
        </Link>
        <h1 className="mt-6 font-display text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-5 text-sm text-muted-foreground">{footer}</div> : null}
      </Card>
    </div>
  );
}
