import StatsGrid from "@/components/admin/StatsGrid"
import WeeklyCharts from "@/components/admin/WeeklyCharts"
import RecentUsersTable from "@/components/admin/RecentUsersTable"
import { getDashboardData } from "@/actions/adminAction"

export default async function AdminDashboard() {
  const { stats, weeklyUsers, weeklyPosts, recentUsers } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      <StatsGrid stats={stats} />

      <WeeklyCharts weeklyUsers={weeklyUsers} weeklyPosts={weeklyPosts} />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Recently Joined Users
          </h2>
        </div>
        <RecentUsersTable users={recentUsers} />
      </div>
    </div>
  )
}
