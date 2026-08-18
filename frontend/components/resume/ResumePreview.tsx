"use client";

import { FileText } from "lucide-react";
import type { ResumeKind } from "@/lib/resume";
import { resumeEmbedUrl } from "@/lib/resume";
import { cn } from "@/lib/cn";

export function ResumePreview({
  url,
  kind,
  title = "Resume preview",
  local,
  className,
}: {
  url?: string;
  kind: ResumeKind;
  title?: string;
  local?: boolean;
  className?: string;
}) {
  if (!url) {
    return (
      <div className={cn("grid h-full min-h-0 place-items-center px-6 text-center", className)}>
        <div>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <FileText size={22} />
          </span>
          <h3 className="mt-4 font-display text-2xl">No preview yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Upload a PDF, DOC, or DOCX and the document will appear here.
          </p>
        </div>
      </div>
    );
  }

  const src = local && kind === "pdf" ? `${url}#toolbar=0&navpanes=0&view=FitH` : resumeEmbedUrl(url, kind);

  return (
    <div className={cn("relative min-h-0 flex-1 overflow-hidden rounded-[1.4rem] bg-muted", className)}>
      <iframe title={title} src={src} className="absolute inset-0 h-full w-full border-0" />
    </div>
  );
}
