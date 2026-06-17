import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ stats }) {
  const cards = [
    stats.totalUsers,
    stats.activeUsers,
    stats.bannedUsers,
    stats.newToday,
    stats.verified,
    stats.growth30d,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((stat) => (
        <Card key={stat?.label} className="bg-card border-border shadow-none">
          <CardContent className="p-1 pl-4">
            <p className="text-md text-label font-medium mb-1 truncate">{stat?.label}</p>
            <p className="text-xl font-bold text-secondary tabular-nums">{stat?.formatted}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat?.changeType === 'positive' ? "text-emerald-400" : "text-red-400"}`}>
              {stat?.changeType === 'positive'
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {stat?.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
