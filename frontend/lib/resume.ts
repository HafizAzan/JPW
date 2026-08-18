export type ResumeKind = "pdf" | "doc" | "docx" | "unknown";

export const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export function resumeKindFrom(nameOrUrl = "", mime = ""): ResumeKind {
  const value = `${nameOrUrl} ${mime}`.toLowerCase();
  if (value.includes("pdf")) return "pdf";
  if (value.includes("docx") || value.includes("wordprocessingml")) return "docx";
  if (value.includes("msword") || /(^|[./])doc(\b|$)/.test(value)) return "doc";
  return "unknown";
}

export function formatBytes(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function resumeEmbedUrl(url: string, kind: ResumeKind) {
  if (kind === "pdf") {
    const base = /\.pdf($|\?)/i.test(url)
      ? url
      : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
    if (base.includes("gview") || base.includes("#")) return base;
    return `${base}#toolbar=0&navpanes=0&view=FitH`;
  }
  if (kind === "doc" || kind === "docx") {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }
  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
}
