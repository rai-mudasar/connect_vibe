
import { getFriendData } from "@/actions/adminActions"
import FriendRequestsTable from "@/components/admin/friend-requests/FriendRequestsTable"
import FriendStatsGrid from "@/components/admin/friend-requests/FriendStatsGrid"

export default async function FriendRequestsPage() {
  const { stats, requests } = await getFriendData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Friend Requests</h1>
        <p className="text-sm text-secondary mt-1">
          Overview of all friend request activity.
        </p>
      </div>

      <FriendStatsGrid stats={stats} />

      <div className="bg-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-secondary">All Requests</h2>
        </div>
        <FriendRequestsTable requests={requests} />
      </div>
    </div>
  )
}
