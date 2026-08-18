"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { Chatbot } from "@/components/ai/Chatbot";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        {children}
        <Chatbot />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "border-border bg-card text-card-foreground shadow-soft",
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
