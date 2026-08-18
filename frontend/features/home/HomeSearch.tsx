"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { JOB_TYPES } from "@/lib/constants";

export function HomeSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  return (
    <section className="pb-16">
      <Container>
        <Reveal>
          <form
            className="grid gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft md:grid-cols-[1.3fr_1fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              if (location) params.set("location", location);
              if (type) params.set("type", type);
              router.push(`/jobs?${params.toString()}`);
            }}
          >
            <Input
              aria-label="Job title or keyword"
              placeholder="Job title / keyword"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Input
              aria-label="Location"
              placeholder="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <Select
              aria-label="Job type"
              options={[{ label: "Job type", value: "" }, ...JOB_TYPES]}
              value={type}
              onChange={(event) => setType(event.target.value)}
            />
            <Button type="submit" className="md:h-11">
              Search
            </Button>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
