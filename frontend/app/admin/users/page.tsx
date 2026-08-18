"use client";

import { useEffect, useState } from "react";
import { Ban, Briefcase, Eye, RotateCcw, Shield, Trash2, UserRound, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/format";
import { ROLE_TONE, roleLabel } from "@/lib/userDisplay";
import { ApiError } from "@/lib/api";
import type { Role, User, UserStatus } from "@/types";

const ROLE_FILTERS: { label: string; value: Role | "" }[] = [
  { label: "All roles", value: "" },
  { label: "Job seekers", value: "jobseeker" },
  { label: "Employers", value: "employer" },
  { label: "Admins", value: "admin" },
];

const STATUS_FILTERS: { label: string; value: UserStatus | "" }[] = [
  { label: "All status", value: "" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const { push } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [pendingSuspend, setPendingSuspend] = useState<User | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [counts, setCounts] = useState({
    users: 0,
    jobseekers: 0,
    employers: 0,
    admins: 0,
    suspended: 0,
  });

  async function loadCounts() {
    const [stats, suspended] = await Promise.all([
      adminService.stats(),
      adminService.users({ status: "suspended", limit: 1 }),
    ]);
    setCounts({
      users: stats.data.users,
      jobseekers: stats.data.jobseekers,
      employers: stats.data.employers,
      admins: Math.max(0, stats.data.users - stats.data.jobseekers - stats.data.employers),
      suspended: suspended.data.pagination.total,
    });
  }

  async function loadList(showSpinner = true, nextPage = page, nextSearch = search, nextRole = role, nextStatus = status) {
    if (showSpinner) setLoading(true);
    try {
      const res = await adminService.users({
        search: nextSearch.trim() || undefined,
        role: nextRole || undefined,
        status: nextStatus || undefined,
        page: nextPage,
        limit: 12,
      });
      setUsers(res.data.items);
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
      loadList(true, 1, search, role, status);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, status]);

  async function refresh() {
    await loadCounts();
    const nextPage = page;
    const res = await adminService.users({
      search: search.trim() || undefined,
      role: role || undefined,
      status: status || undefined,
      page: nextPage,
      limit: 12,
    });
    if (res.data.items.length === 0 && nextPage > 1) {
      setPage(1);
      await loadList(false, 1, search, role, status);
      return;
    }
    setUsers(res.data.items);
    setPages(res.data.pagination.pages);
    setTotal(res.data.pagination.total);
  }

  async function restore(user: User) {
    setBusyId(user._id);
    try {
      await adminService.updateUserStatus(user._id, "active");
      push(`${user.name} restored`);
      setSelected((prev) => (prev && prev._id === user._id ? { ...prev, status: "active" } : prev));
      await refresh();
    } catch (error) {
      push(error instanceof ApiError ? error.message : "Could not restore user", "danger");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <PageHeader
        eyebrow="Moderation"
        title="Users"
        description="Search the platform, suspend abuse, and keep hiring accounts in good standing."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Everyone" value={counts.users} hint="All accounts" icon={<Users size={18} />} />
        <StatCard label="Job seekers" value={counts.jobseekers} hint="Candidate accounts" icon={<UserRound size={18} />} />
        <StatCard label="Employers" value={counts.employers} hint="Hiring accounts" icon={<Briefcase size={18} />} />
        <StatCard label="Admins" value={counts.admins} hint="Platform operators" icon={<Shield size={18} />} />
        <StatCard label="Suspended" value={counts.suspended} hint="Blocked from signing in" icon={<Ban size={18} />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <SearchInput
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "account" : "accounts"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ROLE_FILTERS.map((item) => (
          <Button
            key={item.label}
            size="sm"
            variant={role === item.value ? "primary" : "outline"}
            onClick={() => setRole(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="-mt-1 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((item) => (
          <Button
            key={item.label}
            size="sm"
            variant={status === item.value ? "secondary" : "outline"}
            onClick={() => setStatus(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <LoadingState rows={4} />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description={search || role || status ? "Try a different name, role, or status." : "Accounts will appear here as people join HireHub."}
        />
      ) : (
        <>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th className="px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">User</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Role</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Contact</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Joined</th>
                    <th className="px-4 py-3.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Status</th>
                    <th className="px-5 py-3.5 text-right text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isSelf = me?._id === user._id;
                    return (
                      <tr
                        key={user._id}
                        className="cursor-pointer border-b border-border last:border-b-0 odd:bg-muted/45 even:bg-transparent transition-colors duration-300 hover:bg-primary/8"
                        onClick={() => setSelected(user)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={user.name} src={user.avatar?.url} />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-medium">{user.name}</p>
                                {isSelf ? <Badge>You</Badge> : null}
                              </div>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.headline || user.location || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge tone={ROLE_TONE[user.role]}>{roleLabel(user.role)}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <p className="truncate text-sm">{user.email}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.phone || "No phone on file"}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-4">
                          <StatusBadge value={user.status} />
                        </td>
                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <IconButton label="Details" onClick={() => setSelected(user)}>
                              <Eye size={15} />
                            </IconButton>
                            {isSelf ? null : (
                              <>
                                {user.status === "active" ? (
                                  <IconButton
                                    label="Suspend"
                                    disabled={busyId === user._id}
                                    onClick={() => setPendingSuspend(user)}
                                  >
                                    <Ban size={15} />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    label="Restore"
                                    variant="secondary"
                                    loading={busyId === user._id}
                                    onClick={() => restore(user)}
                                  >
                                    <RotateCcw size={15} />
                                  </IconButton>
                                )}
                                {user.role !== "admin" ? (
                                  <IconButton
                                    label="Delete"
                                    variant="danger"
                                    disabled={busyId === user._id}
                                    onClick={() => setPendingDelete(user)}
                                  >
                                    <Trash2 size={15} />
                                  </IconButton>
                                ) : null}
                              </>
                            )}
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
              loadList(true, next, search, role, status);
            }}
          />
        </>
      )}

      <UserDetailDrawer
        user={selected}
        isSelf={Boolean(selected && me?._id === selected._id)}
        busy={Boolean(selected && busyId === selected._id)}
        onClose={() => setSelected(null)}
        onSuspend={setPendingSuspend}
        onRestore={restore}
        onDelete={setPendingDelete}
      />

      <ConfirmDialog
        open={Boolean(pendingSuspend)}
        title="Suspend this account?"
        description={`${pendingSuspend?.name} will not be able to sign in until you restore them.`}
        confirmLabel="Suspend"
        danger
        onClose={() => setPendingSuspend(null)}
        onConfirm={async () => {
          if (!pendingSuspend) return;
          const target = pendingSuspend;
          setPendingSuspend(null);
          setBusyId(target._id);
          try {
            await adminService.updateUserStatus(target._id, "suspended");
            push(`${target.name} suspended`);
            setSelected((prev) => (prev && prev._id === target._id ? { ...prev, status: "suspended" } : prev));
            await refresh();
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not suspend user", "danger");
          } finally {
            setBusyId(null);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this account?"
        description={`${pendingDelete?.name} and their account data will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          setPendingDelete(null);
          setBusyId(target._id);
          try {
            await adminService.deleteUser(target._id);
            push(`${target.name} deleted`);
            if (selected?._id === target._id) setSelected(null);
            await refresh();
          } catch (error) {
            push(error instanceof ApiError ? error.message : "Could not delete user", "danger");
          } finally {
            setBusyId(null);
          }
        }}
      />
    </div>
  );
}
