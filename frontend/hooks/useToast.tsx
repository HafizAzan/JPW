"use client";

import { toast } from "sonner";

export function useToast() {
  return {
    push(title: string, tone: "default" | "danger" = "default") {
      if (tone === "danger") toast.error(title);
      else toast.success(title);
    },
  };
}
