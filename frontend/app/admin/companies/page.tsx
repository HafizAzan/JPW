"use client";

import { useEffect, useState } from "react";
import { Building2, Eye, ShieldCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { CompanyDetailDrawer, ownerOf } from "@/components/admin/CompanyDetailDrawer";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Company } from "@/types";

const FILTERS: { label: string; value: "" | "true" | "false" }[] = [
  { label: "All", value: "" },
  { label: "Verified", value: "true" },
  { label: "Unverified", value: "false" },
];

export default function AdminCompaniesPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verified, setVerified] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Company | null>(null);
  const [counts, setCounts] = useState({ companies: 0, verified: 0, unverified: 0 });

  async function loadCounts() {
    const [stats, verifiedRes, unverifiedRes] = await Promise.all([
      adminService.stats(),
      adminService.companies({ verified: "true", limit: 1 }),
      adminService.companies({ verified: "false", limit: 1 }),
    ]);
    setCounts({
      companies: stats.data.companies,
      verified: verifiedRes.data.pagination.total,
      unverified: unverifiedRes.data.pagination.total,
    });
  }

  async function loadList(showSpinner = true, nextPage = page, nextSearch = search, nextVerified = verified) {
    if (showSpinner) setLoading(true);
    try {
      const res = await adminService.companies({
        search: nextSearch.trim() || undefined,
        verified: nextVerified || undefined,
        page: nextPage,
        limit: 12,
      });
      setItems(res.data.items);
      setPages(res.data.pagination.pages);
      setTotal(res.data.pagination.total);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadList(true, 1, search, verified);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, verified]);

  async function refresh() {
    await loadCounts();
    const res = await adminService.companies({
      search: search.trim() || undefined,
      verified: verified || undefined,
      page,
      limit: 12,
    });
    if (res.data.items.length === 0 && page > 1) {
      setPage(1);
      await loadList(false, 1, search, verified);
      return;
    }
    setItems(res.data.items);
    setPages(res.data.pagination.pages);
    setTotal(res.data.pagination.total);
  }

  async function verify(company: Company) {
    setBusyId(company._id);
    try {
      await adminService.verifyCompany(company._id);
      push(`${company.name} verified`);
      setSelected((prev) => (prev && prev._id === company._id ? { ...prev, verified: true } : prev));
      await refresh();
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not verify company", "danger");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Moderation"
        title="Companies"
        description="Verify teams that should appear trustworthy on the public board."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="All companies" value={counts.companies} hint="Every employer workspace" icon={<Building2 size={18} />} />
        <StatCard label="Verified" value={counts.verified} hint="Trusted on the board" icon={<ShieldCheck size={18} />} />
        <StatCard label="Unverified" value={counts.unverified} hint="Waiting on review" icon={<Eye size={18} />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <SearchInput
          placeholder="Search by company name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "company" : "companies"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.label}
            size="sm"
            variant={verified === item.value ? "primary" : "outline"}
            onClick={() => setVerified(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <LoadingState rows={4} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No companies found"
          description={search || verified ? "Try a different name or filter." : "Employers will appear here after they create a profile."}
        />
      ) : (
        <>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th className="px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Company</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Location</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Owner</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Joined</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Status</th>
                    <th className="px-5 py-3.5 text-right text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((company) => {
                    const owner = ownerOf(company);
                    return (
                      <tr
                        key={company._id}
                        className="cursor-pointer border-b border-border last:border-b-0 odd:bg-muted/45 even:bg-transparent transition-colors duration-300 hover:bg-primary/8"
                        onClick={() => setSelected(company)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={company.name} src={company.logo?.url} />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{company.name}</p>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">{company.industry || "Industry not set"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="truncate text-sm">{company.location || "—"}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{company.size ? `${company.size} people` : "Size not set"}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="truncate text-sm">{owner?.name || "—"}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{owner?.email || "No email"}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(company.createdAt)}</td>
                        <td className="px-4 py-4">
                          {company.verified ? <Badge tone="forest">Verified</Badge> : <Badge tone="gold">Unverified</Badge>}
                        </td>
                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <IconButton label="Details" onClick={() => setSelected(company)}>
                              <Eye size={15} />
                            </IconButton>
                            <IconButton
                              label="View public page"
                              onClick={() => window.open(`/companies/${company._id}`, "_blank", "noopener,noreferrer")}
                            >
                              <Building2 size={15} />
                            </IconButton>
                            {!company.verified ? (
                              <IconButton
                                label="Verify"
                                variant="secondary"
                                loading={busyId === company._id}
                                onClick={() => verify(company)}
                              >
                                <ShieldCheck size={15} />
                              </IconButton>
                            ) : null}
                            <IconButton
                              label="Delete"
                              variant="danger"
                              disabled={busyId === company._id}
                              onClick={() => setPendingDelete(company)}
                            >
                              <Trash2 size={15} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Pagination
            page={page}
            pages={pages}
            onPage={(next) => {
              setPage(next);
              loadList(true, next, search, verified);
            }}
          />
        </>
      )}

      <CompanyDetailDrawer
        company={selected}
        busy={Boolean(selected && busyId === selected._id)}
        onClose={() => setSelected(null)}
        onVerify={verify}
        onDelete={setPendingDelete}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this company?"
        description={`${pendingDelete?.name} and all of its job listings will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          setPendingDelete(null);
          setBusyId(target._id);
          try {
            await adminService.deleteCompany(target._id);
            push(`${target.name} deleted`);
            if (selected?._id === target._id) setSelected(null);
            await refresh();
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not delete company", "danger");
          } finally {
            setBusyId(null);
          }
        }}
      />
    </div>
  );
}
