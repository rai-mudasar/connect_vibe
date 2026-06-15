import StatsGrid from "@/components/admin/home/StatsGrid"
import WeeklyCharts from "@/components/admin/home/WeeklyCharts"
import RecentUsersTable from "@/components/admin/home/RecentUsersTable"
import { getDashboardData } from "@/actions/adminActions"

export default async function AdminDashboard() {
  const { stats, weeklyUsers, weeklyPosts, recentUsers } = await getDashboardData()

  return (
    <div className="space-y-6 bg-bg">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <p className="text-sm text-label mt-1">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      <StatsGrid stats={stats} />

      <WeeklyCharts weeklyUsers={weeklyUsers} weeklyPosts={weeklyPosts} />

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-secondary">
            Recently Joined Users
          </h2>
        </div>
        <RecentUsersTable users={recentUsers} />
      </div>
    </div>
  )
}
