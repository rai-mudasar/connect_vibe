// components/admin/ActivitySidebar.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function InitialAvatar({ initials, className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

function SideCard({ title, children }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-none">
      <CardHeader className="px-4 pt-4 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {title}
        </CardTitle>
        <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
          View all
        </button>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}

export default function ActivitySidebar({ feeds }) {
  const { recentSignups, recentReports, recentBans, moderationLog } = feeds;

  return (
    <div className="space-y-3">

      {/* Recent signups */}
      <SideCard title="Recent signups">
        {recentSignups.map((u) => (
          <div key={u.username} className="flex items-center gap-2.5">
            <InitialAvatar initials={u.initials} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{u.name}</p>
              <p className="text-xs text-zinc-500">@{u.username} · {u.time}</p>
            </div>
          </div>
        ))}
      </SideCard>

      {/* Recent reports */}
      <SideCard title="Recent reports">
        {recentReports.map((r) => (
          <div key={r.name} className="flex items-center gap-2.5">
            <InitialAvatar initials={r.initials} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-200 truncate">{r.name}</p>
              <p className="text-xs text-zinc-500">{r.reason}</p>
            </div>
            <Badge variant="destructive" className="text-[10px] bg-red-950/60 text-red-400 border-red-900 shrink-0">
              {r.count}
            </Badge>
          </div>
        ))}
      </SideCard>

      {/* Recent bans */}
      <SideCard title="Recent bans">
        {recentBans.map((b) => (
          <div key={b.name} className="flex items-center gap-2.5">
            <InitialAvatar initials={b.initials} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{b.name}</p>
              <p className="text-xs text-zinc-500">Banned by {b.by} · {b.time}</p>
            </div>
          </div>
        ))}
      </SideCard>

      {/* Moderation log */}
      <SideCard title="Moderation log">
        {moderationLog.map((m, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">
              {m.actor.slice(1, 3).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-300">
                <span className="text-violet-400">{m.actor}</span> {m.action}
              </p>
              <p className="text-[11px] text-zinc-500">{m.reason}</p>
            </div>
          </div>
        ))}
      </SideCard>

    </div>
  );
}
