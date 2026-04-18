import FriendStatsGrid from "@/components/admin/FriendStatsGrid"
import FriendRequestsTable from "@/components/admin/FriendRequestsTable"
import { getFriendData } from "@/actions/adminAction"

export default async function FriendRequestsPage() {
  const { stats, requests } = await getFriendData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Friend Requests</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of all friend request activity.
        </p>
      </div>

      <FriendStatsGrid stats={stats} />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">All Requests</h2>
        </div>
        <FriendRequestsTable requests={requests} />
      </div>
    </div>
  )
}
