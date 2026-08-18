"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Camera, GraduationCap, Link2, MapPin, Plus, Sparkles, Trash2, UserRound } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { userService } from "@/services/user.service";
import { ApiError } from "@/lib/api";
import type { Education, Experience } from "@/types";

const emptyExperience: Experience = {
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

const emptyEducation: Education = {
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { push } = useToast();
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    headline: "",
    bio: "",
    location: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    skills: "",
  });
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name ?? "",
      headline: user.headline ?? "",
      bio: user.bio ?? "",
      location: user.location ?? "",
      phone: user.phone ?? "",
      linkedin: user.linkedin ?? "",
      github: user.github ?? "",
      portfolio: user.portfolio ?? "",
      skills: user.skills?.join(", ") ?? "",
    });
    setExperience(user.experience ?? []);
    setEducation(user.education ?? []);
  }, [user]);

  if (!user) return null;

  const skillList = form.skills.split(",").map((item) => item.trim()).filter(Boolean);
  const checks = [form.name, form.headline, form.bio, form.location, skillList.length, experience.length, education.length, user.avatar?.url];
  const complete = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function patchExperience(index: number, patch: Partial<Experience>) {
    setExperience((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function patchEducation(index: number, patch: Partial<Education>) {
    setEducation((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Profile"
        title="My profile"
        description="Keep this current. Recommendations follow your skills and experience."
        action={
          <Button form="profile-form" loading={loading}>
            Save profile
          </Button>
        }
      />

      <Card className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div className="relative w-fit">
          <Avatar name={form.name || user.name} src={user.avatar?.url} size="lg" />
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            className="absolute -right-1 -bottom-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-primary/40"
            aria-label="Change photo"
          >
            <Camera size={14} />
          </button>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setPhotoLoading(true);
              try {
                const res = await userService.uploadAvatar(file);
                setUser(res.data);
                push("Portrait updated");
              } catch (error) {
                push(error instanceof ApiError ? error.message : "Upload failed", "danger");
              } finally {
                setPhotoLoading(false);
                if (photoRef.current) photoRef.current.value = "";
              }
            }}
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl tracking-tight">{form.name || user.name}</h2>
            <Badge tone="copper">{complete}% complete</Badge>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{form.headline || user.email}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {photoLoading ? "Uploading photo…" : "A strong headline and skills help the right roles find you."}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => photoRef.current?.click()}>
          Change photo
        </Button>
      </Card>

      <form
        id="profile-form"
        className="grid gap-4 lg:gap-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          try {
            const res = await userService.updateProfile({
              ...form,
              skills: skillList,
              experience,
              education,
            });
            setUser(res.data);
            push("Profile saved");
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not save", "danger");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <UserRound size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">About you</h2>
                <p className="mt-1 text-sm text-muted-foreground">Name, headline, and a short bio.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
                <Input label="Headline" placeholder="Frontend engineer · React" value={form.headline} onChange={(e) => setField("headline", e.target.value)} />
              </div>
              <Textarea label="Bio" value={form.bio} onChange={(e) => setField("bio", e.target.value)} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <MapPin size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Contact</h2>
                <p className="mt-1 text-sm text-muted-foreground">Where employers can reach you.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Input label="Location" value={form.location} onChange={(e) => setField("location", e.target.value)} />
              <Input label="Phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
            </div>
          </Card>
        </div>

        <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Link2 size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Links</h2>
                <p className="mt-1 text-sm text-muted-foreground">Portfolio and social profiles.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Input label="LinkedIn" value={form.linkedin} onChange={(e) => setField("linkedin", e.target.value)} />
              <Input label="GitHub" value={form.github} onChange={(e) => setField("github", e.target.value)} />
              <Input label="Portfolio" value={form.portfolio} onChange={(e) => setField("portfolio", e.target.value)} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Sparkles size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Skills</h2>
                <p className="mt-1 text-sm text-muted-foreground">Comma separated. These drive recommendations.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Input
                label="Skills"
                hint="Example: React, Node.js, MongoDB"
                value={form.skills}
                onChange={(e) => setField("skills", e.target.value)}
              />
              {skillList.length ? (
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <Badge key={skill} tone="copper">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Briefcase size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Experience</h2>
                <p className="mt-1 text-sm text-muted-foreground">Roles that show how you work.</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setExperience((prev) => [...prev, emptyExperience])}>
              <Plus size={14} /> Add role
            </Button>
          </div>
          {experience.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No roles yet. Add your latest position.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {experience.map((item, index) => (
                <div key={item._id ?? index} className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-2">
                  <div className="flex items-center justify-between md:col-span-2">
                    <p className="text-sm font-medium">Role {index + 1}</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setExperience((prev) => prev.filter((_, i) => i !== index))}>
                      <Trash2 size={14} /> Remove
                    </Button>
                  </div>
                  <Input label="Title" value={item.title} onChange={(e) => patchExperience(index, { title: e.target.value })} />
                  <Input label="Company" value={item.company} onChange={(e) => patchExperience(index, { company: e.target.value })} />
                  <Input label="Location" value={item.location ?? ""} onChange={(e) => patchExperience(index, { location: e.target.value })} />
                  <Input label="Start" placeholder="2022" value={item.startDate ?? ""} onChange={(e) => patchExperience(index, { startDate: e.target.value })} />
                  <Input label="End" placeholder="Present" value={item.endDate ?? ""} onChange={(e) => patchExperience(index, { endDate: e.target.value })} />
                  <div className="flex items-end pb-2">
                    <Checkbox
                      id={`current-role-${index}`}
                      label="I currently work here"
                      checked={Boolean(item.current)}
                      onChange={(e) => patchExperience(index, { current: e.target.checked })}
                    />
                  </div>
                  <Textarea
                    className="md:col-span-2"
                    label="Description"
                    value={item.description ?? ""}
                    onChange={(e) => patchExperience(index, { description: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                <GraduationCap size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight">Education</h2>
                <p className="mt-1 text-sm text-muted-foreground">Schools and programs that shaped your work.</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setEducation((prev) => [...prev, emptyEducation])}>
              <Plus size={14} /> Add school
            </Button>
          </div>
          {education.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No schools yet. Add a degree or course.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {education.map((item, index) => (
                <div key={item._id ?? index} className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-2">
                  <div className="flex items-center justify-between md:col-span-2">
                    <p className="text-sm font-medium">School {index + 1}</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEducation((prev) => prev.filter((_, i) => i !== index))}>
                      <Trash2 size={14} /> Remove
                    </Button>
                  </div>
                  <Input label="School" value={item.school} onChange={(e) => patchEducation(index, { school: e.target.value })} />
                  <Input label="Degree" value={item.degree ?? ""} onChange={(e) => patchEducation(index, { degree: e.target.value })} />
                  <Input label="Field" value={item.field ?? ""} onChange={(e) => patchEducation(index, { field: e.target.value })} />
                  <Input label="Start" value={item.startDate ?? ""} onChange={(e) => patchEducation(index, { startDate: e.target.value })} />
                  <Input label="End" value={item.endDate ?? ""} onChange={(e) => patchEducation(index, { endDate: e.target.value })} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex justify-end lg:hidden">
          <Button loading={loading}>Save profile</Button>
        </div>
      </form>
    </div>
  );
}
