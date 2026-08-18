"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { CATEGORIES, EXPERIENCE_LEVELS, JOB_TYPES, WORKPLACES } from "@/lib/constants";

export type JobFilterState = {
  search: string;
  location: string;
  type: string;
  workplace: string;
  experience: string;
  category: string;
  minSalary: string;
  maxSalary: string;
  sort: string;
};

const empty: JobFilterState = {
  search: "",
  location: "",
  type: "",
  workplace: "",
  experience: "",
  category: "",
  minSalary: "",
  maxSalary: "",
  sort: "newest",
};

function Fields({
  value,
  onChange,
  onSubmit,
}: {
  value: JobFilterState;
  onChange: (value: JobFilterState) => void;
  onSubmit: () => void;
}) {
  function set<K extends keyof JobFilterState>(key: K, next: JobFilterState[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Input placeholder="Search React, Next.js…" value={value.search} onChange={(e) => set("search", e.target.value)} />
      <Input placeholder="Location" value={value.location} onChange={(e) => set("location", e.target.value)} />
      <Select options={[{ label: "All types", value: "" }, ...JOB_TYPES]} value={value.type} onChange={(e) => set("type", e.target.value)} />
      <Select options={[{ label: "Any workplace", value: "" }, ...WORKPLACES]} value={value.workplace} onChange={(e) => set("workplace", e.target.value)} />
      <Select options={[{ label: "Any experience", value: "" }, ...EXPERIENCE_LEVELS]} value={value.experience} onChange={(e) => set("experience", e.target.value)} />
      <Select options={[{ label: "All categories", value: "" }, ...CATEGORIES.map((c) => ({ label: c, value: c }))]} value={value.category} onChange={(e) => set("category", e.target.value)} />
      <Input placeholder="Min salary" value={value.minSalary} onChange={(e) => set("minSalary", e.target.value)} />
      <Select
        options={[
          { label: "Newest", value: "newest" },
          { label: "Oldest", value: "oldest" },
          { label: "Salary low to high", value: "salary-asc" },
          { label: "Salary high to low", value: "salary-desc" },
        ]}
        value={value.sort}
        onChange={(e) => set("sort", e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit">Apply filters</Button>
        <Button type="button" variant="ghost" onClick={() => onChange(empty)}>
          Reset
        </Button>
      </div>
    </form>
  );
}

export function JobFilters({
  value,
  onChange,
  onSubmit,
}: {
  value: JobFilterState;
  onChange: (value: JobFilterState) => void;
  onSubmit: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden rounded-3xl border border-border bg-card p-4 lg:block">
        <Fields value={value} onChange={onChange} onSubmit={onSubmit} />
      </div>
      <div className="lg:hidden">
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <SlidersHorizontal size={16} /> Filters
        </Button>
        <Drawer open={open} onClose={() => setOpen(false)} eyebrow="Search" title="Filters" labelledBy="job-filters-title">
          <Fields
            value={value}
            onChange={onChange}
            onSubmit={() => {
              onSubmit();
              setOpen(false);
            }}
          />
        </Drawer>
      </div>
    </>
  );
}
