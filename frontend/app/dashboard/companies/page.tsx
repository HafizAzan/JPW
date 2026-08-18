"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Pagination } from "@/components/ui/Pagination";
import { companyService } from "@/services/company.service";
import type { Company } from "@/types";

export default function DashboardCompaniesPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load(term = search, nextPage = page) {
    setLoading(true);
    try {
      const res = await companyService.list({ search: term, page: nextPage, limit: 50 });
      setItems(res.data.items);
      setPages(res.data.pagination.pages);
      setTotal(res.data.pagination.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load(search, 1);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Companies"
        title="Companies"
        description="Every team hiring on HireHub. Open a company to see their live roles."
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <SearchInput
          placeholder="Search by company name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">{total} {total === 1 ? "company" : "companies"}</p>
      </div>

      {loading ? (
        <LoadingState rows={4} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No companies found"
          description={search ? "Try a different name." : "Employers will appear here after they create a profile."}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
          <Pagination
            page={page}
            pages={pages}
            onPage={(next) => {
              setPage(next);
              load(search, next);
            }}
          />
        </>
      )}
    </div>
  );
}
