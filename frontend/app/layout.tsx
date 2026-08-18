import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans-loaded",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-display-loaded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HireHub — Find talent. Find opportunity.",
    template: "%s · HireHub",
  },
  description:
    "HireHub is a modern recruitment platform for job seekers, employers, and administrators.",
  openGraph: {
    title: "HireHub",
    description: "Find talent. Find opportunity. Build what's next.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
