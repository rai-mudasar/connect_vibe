"use client";

// components/admin/UsersTable.jsx
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, ShieldCheck, Ban, UserCheck, UserX, RefreshCw, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  banUser, suspendUser, activateUser, verifyUser, changeUserRole, bulkAction,
} from "@/actions/admin";

// ── helpers ───────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active: "bg-emerald-950/60 text-emerald-400 border-emerald-900",
  Suspended: "bg-yellow-950/60 text-yellow-400 border-yellow-900",
  Banned: "bg-red-950/60 text-red-400 border-red-900",
  Pending: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

const ROLE_STYLES = {
  Admin: "bg-violet-950/60 text-violet-400 border-violet-900",
  Moderator: "bg-blue-950/60 text-blue-400 border-blue-900",
  Creator: "bg-orange-950/60 text-orange-400 border-orange-900",
  Member: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

function InitialAvatar({ initials }) {
  return (
    <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
      {initials}
    </div>
  );
}

function formatFollowers(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + "k";
  return String(n);
}

export default function UsersTable({ initialUsers, initialTotal }) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatus] = useState("all");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const PER_PAGE = 12;
  const totalPages = Math.ceil(total / PER_PAGE);

  const filtered = users
    .filter(u => roleFilter === "all" || u.role.toLowerCase() === roleFilter)
    .filter(u => statusFilter === "all" || u.status.toLowerCase() === statusFilter)
    .filter(u => !search || `${u.firstName} ${u.lastName} ${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── selection ──────────────────────────────────────────────────────────────
  const allChecked = paginated.length > 0 && paginated.every(u => selected.includes(u.id));
  const toggleAll = () => setSelected(allChecked ? [] : paginated.map(u => u.id));
  const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── row action ─────────────────────────────────────────────────────────────
  const rowAction = (fn, successMsg) => (id) => {
    startTransition(async () => {
      const res = await fn(id);
      if (res.success) {
        toast.success(res.message || successMsg);
        // optimistic update
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: res.status ?? u.status } : u));
      } else {
        toast.error(res.error || "Something went wrong.");
      }
    });
  };

  const handleBan = rowAction(banUser, "User banned.");
  const handleSuspend = rowAction(suspendUser, "User suspended.");
  const handleActivate = rowAction(activateUser, "User activated.");
  const handleVerify = rowAction(verifyUser, "User verified.");

  // ── bulk ───────────────────────────────────────────────────────────────────
  const handleBulk = (action) => {
    if (!selected.length) return;
    startTransition(async () => {
      const res = await bulkAction(selected, action);
      toast[res.success ? "success" : "error"](res.message || res.error);
      setSelected([]);
    });
  };

  return (
    <div className="flex flex-col gap-4">

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <Input
            placeholder="Search users…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-56 bg-label border-0 text-secondary placeholder:text-zinc-300 h-9 focus-visible:ring-[1px]"
          />

          <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36 bg-label border-border text-zinc-300 h-9">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-label border-border">
              {["all", "admin", "moderator", "creator", "member"].map(r => (
                <SelectItem key={r} value={r} className="text-secondary focus:bg-label2 capitalize">{r === "all" ? "All roles" : r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={v => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36 bg-label border-border text-zinc-300 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-label border-border">
              {["all", "active", "suspended", "banned", "pending"].map(s => (
                <SelectItem key={s} value={s} className="text-secondary focus:bg-label2 capitalize">{s === "all" ? "All statuses" : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || roleFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost" size="sm"
              onClick={() => { setSearch(""); setRoleFilter("all"); setStatus("all"); setPage(1); }}
              className="text-label hover:text-zinc-300 h-9"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
          )}
        </div>

        {/* Bulk + Export */}
        <div className="flex gap-2 shrink-0">
          {selected.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border bg-label text-zinc-300 hover:bg-zinc-800 h-9">
                  Bulk actions ({selected.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-label border-border">
                <DropdownMenuItem onClick={() => handleBulk("activate")} className="text-emerald-400 focus:bg-zinc-800 focus:text-emerald-300 cursor-pointer">
                  <UserCheck className="w-4 h-4 mr-2" /> Activate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulk("suspend")} className="text-yellow-400 focus:bg-zinc-800 focus:text-yellow-300 cursor-pointer">
                  <UserX className="w-4 h-4 mr-2" /> Suspend
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => handleBulk("ban")} className="text-red-400 focus:bg-zinc-800 focus:text-red-300 cursor-pointer">
                  <Ban className="w-4 h-4 mr-2" /> Ban all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 h-9">
            Export
          </Button> */}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table className={'bg-card'}>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={toggleAll}
                  className="border-border data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
              </TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs">User</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs hidden md:table-cell">Role</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs hidden lg:table-cell">Email</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs hidden sm:table-cell text-right">Posts</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs hidden xl:table-cell text-right">Reports</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs hidden xl:table-cell">Joined</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs hidden lg:table-cell">Last seen</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-12 text-zinc-500">
                  No users match the current filters.
                </TableCell>
              </TableRow>
            ) : paginated.map((user) => (
              <TableRow
                key={user.id}
                className={`border-zinc-800 hover:bg-zinc-800/40 transition-colors ${selected.includes(user.id) ? "bg-violet-950/20" : ""}`}
              >
                {/* Checkbox */}
                <TableCell className="pl-4">
                  <Checkbox
                    checked={selected.includes(user.id)}
                    onCheckedChange={() => toggleOne(user.id)}
                    className="border-border data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                  />
                </TableCell>

                {/* User */}
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <InitialAvatar initials={user.initials} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-zinc-200 truncate">
                          {user.firstName} {user.lastName}
                        </span>
                        {user.verified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">@{user.username}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className={`text-[11px] ${ROLE_STYLES[user.role]}`}>
                    {user.role}
                  </Badge>
                </TableCell>

                {/* Email */}
                <TableCell className="hidden lg:table-cell text-xs text-zinc-400">{user.email}</TableCell>

                {/* Posts */}
                <TableCell className="hidden sm:table-cell text-right text-sm text-zinc-300 tabular-nums">
                  {user.posts.toLocaleString()}
                </TableCell>

                {/* Reports */}
                <TableCell className="hidden xl:table-cell text-right tabular-nums pr-6">
                  {user.reports > 0 ? (
                    <span className="text-sm font-semibold text-red-400">{user.reports}</span>
                  ) : (
                    <span className="text-sm text-zinc-600">0</span>
                  )}
                </TableCell>

                {/* Joined */}
                <TableCell className="hidden xl:table-cell text-xs text-zinc-500">
                  {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>

                {/* Last seen */}
                <TableCell className="hidden lg:table-cell text-xs text-zinc-500">{user.lastSeen}</TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant="outline" className={`text-[11px] ${STATUS_STYLES[user.status]}`}>
                    {user.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
                        disabled={isPending}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 w-44">
                      <DropdownMenuItem
                        onClick={() => handleActivate(user.id)}
                        className="text-emerald-400 focus:bg-zinc-800 focus:text-emerald-300 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 mr-2" /> Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSuspend(user.id)}
                        className="text-yellow-400 focus:bg-zinc-800 focus:text-yellow-300 cursor-pointer"
                      >
                        <UserX className="w-4 h-4 mr-2" /> Suspend
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleVerify(user.id)}
                        className="text-violet-400 focus:bg-zinc-800 focus:text-violet-300 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Verify
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        onClick={() => handleBan(user.id)}
                        className="text-red-400 focus:bg-zinc-800 focus:text-red-300 cursor-pointer"
                      >
                        <Ban className="w-4 h-4 mr-2" /> Ban user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>
          Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} users
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 h-8"
          >
            Previous
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 h-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
