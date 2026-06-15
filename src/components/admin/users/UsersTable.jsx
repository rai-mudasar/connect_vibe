"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { getPresenceStatus } from "@/helpers/PresenceTracker";
import { activateUser, banUser, suspendUser, bulkAction } from "@/actions/adminActions";
import { MoreHorizontal, Ban, UserCheck, UserX, RefreshCw, BadgeCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SafeImage from "@/components/SafeImage";

const STATUS_STYLES = {
  active: "bg-emerald-950/60 text-emerald-400 border-emerald-900",
  suspended: "bg-yellow-950/60 text-yellow-400 border-yellow-900",
  banned: "bg-red-950/60 text-red-400 border-red-900",
  pending: "bg-zinc-800  text-zinc-400 border-zinc-700",
};

const ROLE_STYLES = {
  admin: "bg-violet-950/60 text-violet-400 border-violet-900",
  moderator: "bg-blue-950/60 text-blue-400 border-blue-900",
  creator: "bg-orange-950/60 text-orange-400 border-orange-900",
  user: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

const STATUS_DOT = {
  active: "bg-emerald-400",
  suspended: "bg-yellow-400",
  banned: "bg-red-400",
  pending: "bg-zinc-500",
};

function UserCard({ user, selected, onToggle, onBan, onSuspend, onActivate, isPending }) {
  return (
    <div
      className={`
        rounded-2xl border border-border bg-card p-4 flex flex-col gap-3
        transition-colors
        ${selected ? "bg-label2 border-border" : ""}
      `}
    >
      {/* Row 1 — checkbox · avatar · name · menu */}
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          className="mt-0.5 border-zinc-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
        />

        <Avatar className="w-12 h-12 border border-border bg-bg">
          <SafeImage
            src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
            fill
            alt="User Profile Image"
            className="object-contain"
          />
          <AvatarFallback className={'text-[22px] text-primary font-bold flex justify-center items-center'}>{user?.firstName?.[0] + user?.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 mt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-zinc-100 leading-tight">
              {user.firstName} {user.lastName}
            </span>
            {user.verified && (
              <BadgeCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-zinc-500 truncate mt-0.5">
            @{user.username} · {user.email}
          </p>
        </div>

        {/* Action menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 shrink-0 -mt-0.5"
              disabled={isPending}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 w-44">
            <DropdownMenuItem
              onClick={() => onActivate(user?._id)}
              className="text-emerald-400 focus:bg-zinc-800 focus:text-emerald-300 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 mr-2" /> Activate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSuspend(user?._id)}
              className="text-yellow-400 focus:bg-zinc-800 focus:text-yellow-300 cursor-pointer"
            >
              <UserX className="w-4 h-4 mr-2" /> Suspend
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              onClick={() => onBan(user?._id)}
              className="text-red-400 focus:bg-zinc-800 focus:text-red-300 cursor-pointer"
            >
              <Ban className="w-4 h-4 mr-2" /> Ban user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Row 2 — status dot pill + role badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`
            inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border
            ${STATUS_STYLES[user?.status]}
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user?.status]}`} />
          {user.status}
        </span>

        <Badge
          variant="outline"
          className={`text-[11px] ${ROLE_STYLES[user?.role]}`}
        >
          {user.role}
        </Badge>
      </div>

      {/* Row 3 — stats grid */}
      <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden">
        {[
          { label: "POSTS", value: user?.posts?.length, red: false},
          { label: "LASTSEEN", value: getPresenceStatus(user?.lastSeen), red: getPresenceStatus(user?.lastSeen) === 'Online'},
          { label: "REPORTS", value: user?.reports, red: user?.reports > 0 },
        ].map(({ label, value, red }) => (
          <div key={label} className="flex flex-col items-center py-2.5 gap-0.5 bg-bg">
            <span className="text-[9px] font-semibold tracking-widest text-zinc-500 uppercase">
              {label}
            </span>
            <span className={`text-sm ${red ? "text-red-400" : "text-zinc-200"}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function UsersTable({ initialUsers }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [users, setUsers] = useState(initialUsers);
  const [statusFilter, setStatus] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const PER_PAGE = 12;
  const totalPages = 10;

  const filtered = users
    .filter(u => roleFilter === "all" || u.role.toLowerCase() === roleFilter)
    .filter(u => statusFilter === "all" || u.status.toLowerCase() === statusFilter)
    .filter(u => !search || `${u.firstName} ${u.lastName} ${u.username} ${u.email}`
      .toLowerCase().includes(search.toLowerCase()));


  // selection
  const allChecked = filtered.length > 0 && filtered.every(u => selected.includes(u._id));
  const toggleAll = () => setSelected(allChecked ? [] : filtered.map(u => u._id));
  const toggleOne = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // row actions
  const rowAction = (fn, successMsg, newStatus) => (id) => {
    setUsers(prev => prev.map(u =>
      u._id === id ? { ...u, status: newStatus } : u));
    startTransition(async () => {
      const res = await fn(id);
      if (res.success) {
        toast.success(res.message || successMsg);
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    });
  };

  const handleBan = rowAction(banUser, "User banned.", 'banned');
  const handleSuspend = rowAction(suspendUser, "User suspended.", 'suspended');
  const handleActivate = rowAction(activateUser, "User activated.", 'active');

  // bulk
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

      {/* ══════════════════ Toolbar ══════════════════ */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <Input
            placeholder="Search users…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-56 bg-label2 border-0 text-secondary placeholder:text-zinc-300 h-9 focus-visible:ring-[1px]"
          />

          <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36 bg-label2 border-border text-zinc-300 h-9 capitalize">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-label2 border-border">
              {["all", "admin", "moderator", "creator", "member"].map(r => (
                <SelectItem key={r} value={r} className="text-secondary focus:bg-label2 capitalize">
                  {r === "all" ? "All roles" : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={v => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36 bg-label2 border-border text-zinc-300 h-9 capitalize">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-label2 border-border">
              {["all", "active", "suspended", "banned", "pending"].map(s => (
                <SelectItem key={s} value={s} className="text-secondary focus:bg-label capitalize">
                  {s === "all" ? "All statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || roleFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost" size="sm"
              onClick={() => { setSearch(""); setRoleFilter("all"); setStatus("all"); setPage(1); }}
              className="text-red-600 hover:text-label2 h-9"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
          )}
        </div>

        {/* ══════════════════ Bulk actions ══════════════════ */}
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
        </div>
      </div>

      {/* ══════════════════ MOBILE — card list  (shown only on < sm) ══════════════════ */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.length > 0 && (
          <div className="flex items-center gap-3 px-1">
            <Checkbox
              checked={allChecked}
              onCheckedChange={toggleAll}
              className="border-zinc-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
            />
            <span className="text-xs text-zinc-500">
              {selected.length > 0
                ? `${selected.length} selected`
                : `${filtered.length} users`}
            </span>
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center py-12 text-zinc-500 text-sm">
            No users match the current filters.
          </p>
        ) : (
          filtered.map(user => (
            <UserCard
              key={user?._id}
              user={user}
              selected={selected.includes(user?._id)}
              onToggle={() => toggleOne(user?._id)}
              onBan={handleBan}
              onSuspend={handleSuspend}
              onActivate={handleActivate}
              isPending={isPending}
            />
          ))
        )}
      </div>

      {/* ══════════════════ DESKTOP — table  (hidden on < sm) ══════════════════ */}
      <div className="rounded-xl border border-border overflow-hidden hidden sm:block">
        <Table className="bg-card">
          <TableHeader>
            <TableRow className="bg-bg border-border text-xs text-secondary font-medium">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={toggleAll}
                  className="border-border text-black data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                />
              </TableHead>
              <TableHead className="">User</TableHead>
              <TableHead className=" hidden md:table-cell">Role</TableHead>
              <TableHead className=" hidden lg:table-cell">Email</TableHead>
              <TableHead className=" hidden sm:table-cell text-right">Posts</TableHead>
              <TableHead className=" hidden xl:table-cell text-right">Reports</TableHead>
              <TableHead className=" hidden xl:table-cell pl-10">Joined</TableHead>
              <TableHead className=" hidden lg:table-cell">Last seen</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-12 text-zinc-500">
                  No users match the current filters.
                </TableCell>
              </TableRow>
            ) : filtered.map((user) => (
              <TableRow
                key={user?._id}
                className={`border-border hover:bg-card-hover transition-colors ${selected.includes(user?._id) ? "bg-violet-950/20" : ""}`}
              >
                <TableCell className="pl-4">
                  <Checkbox
                    checked={selected.includes(user?._id)}
                    onCheckedChange={() => toggleOne(user?._id)}
                    className="border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary cursor-pointer"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-17 h-17 border border-border bg-bg">
                      <SafeImage
                        src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                        fill
                        alt="User Profile Image"
                        className="object-contain"
                      />
                      <AvatarFallback className={'text-[24px] text-primary font-bold'}>{user?.firstName?.[0] + user?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-medium text-zinc-200 truncate">
                          {user?.firstName} {user?.lastName}
                        </span>
                        {user?.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">@{user.username}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className={`text-[11px] ${ROLE_STYLES[user.role]}`}>
                    {user?.role}
                  </Badge>
                </TableCell>

                <TableCell className="hidden lg:table-cell text-xs text-zinc-400">{user.email}</TableCell>

                <TableCell className="hidden sm:table-cell text-right text-sm text-zinc-300 tabular-nums">
                  {user?.posts?.length}
                </TableCell>

                <TableCell className="hidden xl:table-cell text-right tabular-nums pr-6">
                  {user?.reports > 0
                    ? <span className="text-sm font-semibold text-red-400">{user.reports}</span>
                    : <span className="text-sm text-zinc-600">0</span>}
                </TableCell>

                <TableCell className="hidden xl:table-cell text-xs text-zinc-500 pl-8 ">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </TableCell>

                <TableCell className={`hidden lg:table-cell text-xs ${getPresenceStatus(user.lastSeen) === 'Online' ? 'text-green-400' : 'text-zinc-500'}`}>{getPresenceStatus(user.lastSeen)}</TableCell>

                <TableCell>
                  <Badge variant="outline" className={`text-[11px] ${STATUS_STYLES[user.status]}`}>
                    {user.status}
                  </Badge>
                </TableCell>

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
                        onClick={() => handleActivate(user._id)}
                        className="text-emerald-400 focus:bg-zinc-800 focus:text-emerald-300 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 mr-2" /> Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSuspend(user._id)}
                        className="text-yellow-400 focus:bg-zinc-800 focus:text-yellow-300 cursor-pointer"
                      >
                        <UserX className="w-4 h-4 mr-2" /> Suspend
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        onClick={() => handleBan(user._id)}
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

      {/* ══════════════════ Pagination ══════════════════ */}
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
