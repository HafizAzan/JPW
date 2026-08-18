"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { companyService } from "@/services/company.service";
import type { Company } from "@/types";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Company[]>([]);

  async function load(term = search) {
    const res = await companyService.list({ search: term, limit: 12 });
    setItems(res.data.items);
  }

  useEffect(() => {
    load("").catch(() => undefined);
  }, []);

  return (
    <Container className="py-12">
      <PageHeader eyebrow="Studios" title="Companies on HireHub" description="Meet the teams behind the roles." />
      <form
        className="mb-8 max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <Input placeholder="Search companies" value={search} onChange={(e) => setSearch(e.target.value)} />
      </form>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>
      {items.length === 0 ? <EmptyState title="No companies yet" description="Employers will appear here after they create a profile." /> : null}
    </Container>
  );
}
