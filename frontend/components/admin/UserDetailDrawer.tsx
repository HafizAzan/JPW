"use client";

import { useEffect, useState } from "react";
import { Briefcase, ExternalLink, FileText, GraduationCap, Link2, MapPin, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { adminService } from "@/services/admin.service";
import { formatDate } from "@/lib/format";
import { ROLE_TONE, roleLabel } from "@/lib/userDisplay";
import type { User } from "@/types";

function completeness(user: User) {
  const checks = [
    user.name,
    user.headline,
    user.bio,
    user.location,
    user.phone,
    user.skills?.length,
    user.experience?.length,
    user.education?.length,
    user.avatar?.url,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function LinkRow({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return (
      <p className="text-sm text-muted-foreground">
        {label}: not added
      </p>
    );
  }
  return (
    <a
      href={href.startsWith("http") ? href : `https://${href}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary-strong"
    >
      <ExternalLink size={14} />
      <span className="truncate">{label}</span>
    </a>
  );
}

export function UserDetailDrawer({
  user,
  isSelf,
  busy,
  onClose,
  onSuspend,
  onRestore,
  onDelete,
}: {
  user: User | null;
  isSelf: boolean;
  busy: boolean;
  onClose: () => void;
  onSuspend: (user: User) => void;
  onRestore: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  const [detail, setDetail] = useState<User | null>(user);

  useEffect(() => {
    if (!user) return;
    setDetail(user);
    adminService.getUser(user._id).then((res) => setDetail(res.data)).catch(() => setDetail(user));
  }, [user]);

  const profile = detail ?? user;
  const complete = profile ? completeness(profile) : 0;

  return (
    <Drawer
      open={Boolean(user)}
      onClose={onClose}
      eyebrow="Account"
      title="Profile details"
      labelledBy="user-detail-title"
      footer={
        profile ? (
          <>
            {isSelf ? (
              <p className="mr-auto text-sm text-muted-foreground">This is your account</p>
            ) : (
              <>
                {profile.status === "active" ? (
                  <Button variant="outline" disabled={busy} onClick={() => onSuspend(profile)}>
                    Suspend
                  </Button>
                ) : (
                  <Button variant="secondary" loading={busy} onClick={() => onRestore(profile)}>
                    Restore
                  </Button>
                )}
                {profile.role !== "admin" ? (
                  <Button variant="ghost" disabled={busy} onClick={() => onDelete(profile)}>
                    Delete
                  </Button>
                ) : null}
              </>
            )}
            <Button onClick={onClose}>Done</Button>
          </>
        ) : null
      }
    >
      {profile ? (
        <>
              <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-4">
                  <Avatar name={profile.name} src={profile.avatar?.url} size="lg" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-2xl leading-tight">{profile.name}</h3>
                      <Badge tone={ROLE_TONE[profile.role]}>{roleLabel(profile.role)}</Badge>
                      {isSelf ? <Badge>You</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{profile.headline || profile.email}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge value={profile.status} />
                      <Badge tone="copper">{complete}% complete</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {profile.bio ? (
                <section className="mt-5">
                  <p className="text-xs tracking-[0.18em] text-primary uppercase">About</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
                </section>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">No bio added yet.</p>
              )}

              <section className="mt-6 grid gap-3 rounded-3xl border border-border bg-card p-5 sm:grid-cols-2">
                <div className="flex items-start gap-3 sm:col-span-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-xs text-muted-foreground">How this person can be reached.</p>
                  </div>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <br />
                  {profile.email}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <br />
                  {profile.phone || "Not added"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <br />
                  {profile.location || "Not added"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <br />
                  {formatDate(profile.createdAt)}
                </p>
              </section>

              <section className="mt-4 rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                    <Link2 size={16} />
                  </span>
                  <div>
                    <h4 className="font-medium">Links</h4>
                    <p className="text-xs text-muted-foreground">Public profiles attached to this account.</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  <LinkRow href={profile.linkedin} label="LinkedIn" />
                  <LinkRow href={profile.github} label="GitHub" />
                  <LinkRow href={profile.portfolio} label="Portfolio" />
                </div>
              </section>

              <section className="mt-4 rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <h4 className="font-medium">Skills</h4>
                    <p className="text-xs text-muted-foreground">Used for matching and search.</p>
                  </div>
                </div>
                {profile.skills?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} tone="copper">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No skills listed.</p>
                )}
              </section>

              <section className="mt-4 rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                    <Briefcase size={16} />
                  </span>
                  <div>
                    <h4 className="font-medium">Experience</h4>
                    <p className="text-xs text-muted-foreground">{profile.experience?.length || 0} roles on file.</p>
                  </div>
                </div>
                {profile.experience?.length ? (
                  <ul className="mt-4 grid gap-3">
                    {profile.experience.map((item, index) => (
                      <li key={item._id ?? index} className="rounded-2xl border border-border px-4 py-3">
                        <p className="font-medium">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[item.company, item.location, item.current ? "Present" : [item.startDate, item.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                        </p>
                        {item.description ? <p className="mt-2 text-sm text-muted-foreground">{item.description}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No experience added.</p>
                )}
              </section>

              <section className="mt-4 rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                    <GraduationCap size={16} />
                  </span>
                  <div>
                    <h4 className="font-medium">Education</h4>
                    <p className="text-xs text-muted-foreground">{profile.education?.length || 0} schools on file.</p>
                  </div>
                </div>
                {profile.education?.length ? (
                  <ul className="mt-4 grid gap-3">
                    {profile.education.map((item, index) => (
                      <li key={item._id ?? index} className="rounded-2xl border border-border px-4 py-3">
                        <p className="font-medium">{item.school}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[item.degree, item.field, [item.startDate, item.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No education added.</p>
                )}
              </section>

              <section className="mt-4 rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                    <FileText size={16} />
                  </span>
                  <div>
                    <h4 className="font-medium">Resumes</h4>
                    <p className="text-xs text-muted-foreground">{profile.resumes?.length || (profile.resume?.url ? 1 : 0)} files.</p>
                  </div>
                </div>
                {profile.resumes?.length ? (
                  <ul className="mt-4 grid gap-2">
                    {profile.resumes.map((file) => (
                      <li key={file._id}>
                        {file.url ? (
                          <a href={file.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-primary-strong">
                            {file.originalName || "Resume"} {String(file._id) === String(profile.activeResumeId) ? "· active" : ""}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{file.originalName || "Resume"}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : profile.resume?.url ? (
                  <a href={profile.resume.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-primary hover:text-primary-strong">
                    Open resume
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No resume uploaded.</p>
                )}
              </section>
        </>
      ) : null}
    </Drawer>
  );
}
