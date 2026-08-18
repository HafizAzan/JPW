"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, ExternalLink, FileText, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { userService } from "@/services/user.service";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";
import {
  RESUME_ACCEPT,
  RESUME_MAX_BYTES,
  formatBytes,
  resumeKindFrom,
  type ResumeKind,
} from "@/lib/resume";
import type { ResumeFile } from "@/types";

function kindLabel(kind: ResumeKind) {
  if (kind === "pdf") return "PDF";
  if (kind === "docx") return "DOCX";
  if (kind === "doc") return "DOC";
  return "File";
}

function listFor(user: { resume?: ResumeFile | { url?: string }; resumes?: ResumeFile[]; activeResumeId?: string }) {
  if (user.resumes?.length) {
    return [...user.resumes].sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
    );
  }
  if (user.resume?.url) {
    return [{ ...(user.resume as ResumeFile), _id: user.activeResumeId || "current" }];
  }
  return [] as ResumeFile[];
}

export default function ResumePage() {
  const { user, setUser } = useAuth();
  const { push } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<{ url: string; kind: ResumeKind; name: string } | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview?.url.startsWith("blob:")) URL.revokeObjectURL(localPreview.url);
    };
  }, [localPreview]);

  if (!user) return null;

  const resumes = listFor(user);
  const activeId = user.activeResumeId || resumes[0]?._id;
  const selected = resumes.find((item) => item._id === selectedId) ?? resumes.find((item) => item._id === activeId) ?? resumes[0];
  const storedKind = resumeKindFrom(selected?.originalName || selected?.format || selected?.url);
  const previewKind = localPreview?.kind ?? storedKind;
  const previewUrl = localPreview?.url || selected?.url;
  const fileName = localPreview?.name || selected?.originalName || (selected?.url ? "Resume" : "No file");

  async function handleFile(file: File) {
    const kind = resumeKindFrom(file.name, file.type);
    if (kind === "unknown") {
      push("Use a PDF, DOC, or DOCX file.", "danger");
      return;
    }
    if (file.size > RESUME_MAX_BYTES) {
      push("File must be 5 MB or smaller.", "danger");
      return;
    }

    if (localPreview?.url.startsWith("blob:")) URL.revokeObjectURL(localPreview.url);
    const blobUrl = kind === "pdf" ? URL.createObjectURL(file) : "";
    setLocalPreview({ url: blobUrl, kind, name: file.name });

    setUploading(true);
    try {
      const res = await userService.uploadResume(file);
      setUser(res.data);
      const newest = listFor(res.data)[0];
      setSelectedId(newest?._id ?? null);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
      push("Resume added to your list");
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Upload failed. Configure Cloudinary to store files.", "danger");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageHeader
          eyebrow="Documents"
          title="My resume"
          description="Your files only — upload, preview, and pick which CV is used when you apply."
        />
      </div>

      <div className="grid min-h-0 flex-1 items-stretch gap-4 lg:grid-cols-[minmax(240px,360px)_1fr] lg:gap-6">
        <div className="grid content-start gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Upload size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Upload</h2>
                <p className="mt-1 text-sm text-muted-foreground">PDF, DOC, or DOCX · up to 5 MB · max 8 files</p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={RESUME_ACCEPT}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                const file = event.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className={cn(
                "mt-5 grid w-full cursor-pointer place-items-center rounded-[1.6rem] border border-dashed px-4 py-8 text-center transition duration-300",
                dragging
                  ? "border-primary bg-primary/8"
                  : "border-border bg-muted/40 hover:border-primary/40 hover:bg-muted",
              )}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
                <FileText size={20} />
              </span>
              <p className="mt-3 text-sm font-medium">Drop a CV here, or browse</p>
              <p className="mt-1 text-xs text-muted-foreground">New uploads are added to your list, not replaced.</p>
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>PDF</Badge>
              <Badge tone="copper">DOCX</Badge>
              <Badge tone="forest">DOC</Badge>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="text-xs tracking-[0.18em] text-primary uppercase">Your files</p>
              <p className="text-xs text-muted-foreground">{resumes.length} / 8</p>
            </div>

            {resumes.length === 0 ? (
              <p className="mt-4 px-1 text-sm text-muted-foreground">No resumes yet. Upload one to get started.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {resumes.map((item) => {
                  const kind = resumeKindFrom(item.originalName || item.format || item.url);
                  const isActive = item._id === activeId;
                  const isSelected = item._id === (selected?._id ?? selectedId);
                  return (
                    <li key={item._id}>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalPreview(null);
                          setSelectedId(item._id);
                        }}
                        className={cn(
                          "w-full rounded-2xl border px-3 py-3 text-left transition duration-300",
                          isSelected
                            ? "border-primary/40 bg-primary/8"
                            : "border-border bg-card hover:border-primary/30 hover:bg-muted/50",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-medium">
                            {item.originalName || "Resume"}
                          </p>
                          {isActive ? <Badge tone="forest">Active</Badge> : null}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[kindLabel(kind), formatBytes(item.bytes), timeAgo(item.createdAt)].filter(Boolean).join(" · ")}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {selected?.url ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {selected._id !== activeId ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={async () => {
                      try {
                        const res = await userService.setActiveResume(selected._id);
                        setUser(res.data);
                        push("This resume will be used when you apply");
                      } catch (error) {
                        push(error instanceof ApiError ? error.message : "Could not set active resume", "danger");
                      }
                    }}
                  >
                    <Check size={14} /> Use when applying
                  </Button>
                ) : null}
                <a href={selected.url} target="_blank" rel="noreferrer">
                  <Button type="button" variant="outline" size="sm">
                    <ExternalLink size={14} /> Open
                  </Button>
                </a>
                <a href={selected.url} download={selected.originalName || "resume"}>
                  <Button type="button" variant="outline" size="sm">
                    <Download size={14} /> Download
                  </Button>
                </a>
                <Button type="button" variant="ghost" size="sm" onClick={() => setRemoveId(selected._id)}>
                  <Trash2 size={14} /> Remove
                </Button>
              </div>
            ) : null}
          </Card>
        </div>

        <Card className="relative flex min-h-[24rem] flex-col overflow-hidden p-3 sm:min-h-[28rem] lg:min-h-0">
          {uploading ? (
            <div className="absolute inset-3 z-10 grid place-items-center rounded-[1.4rem] bg-background/70 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">Uploading preview…</p>
            </div>
          ) : null}
          <ResumePreview
            url={previewUrl}
            kind={previewKind}
            title={fileName}
            local={Boolean(localPreview?.url.startsWith("blob:"))}
            className="min-h-0 flex-1"
          />
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(removeId)}
        title="Remove this resume?"
        description="This file is removed from your account. Applications already sent keep their copy."
        confirmLabel="Remove"
        danger
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          if (!removeId) return;
          try {
            const res = await userService.deleteResume(removeId);
            setUser(res.data);
            setSelectedId(null);
            setLocalPreview(null);
            push("Resume removed");
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not remove resume", "danger");
          } finally {
            setRemoveId(null);
          }
        }}
      />
    </div>
  );
}
