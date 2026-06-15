import SafeImage from "@/components/SafeImage"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function FriendRequestsTable({ requests }) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    declined: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  const UserCell = ({ user }) => (
    <div className="flex items-center gap-3">
      <Avatar className="w-14 h-14 border md:border-0 border-border bg-label2">
        <SafeImage
          src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
          fill
          alt="User Profile Image"
          className="object-contain"
        />
        <AvatarFallback className={'text-2xl font-bold'}>{user?.firstName?.[0]}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-secondary whitespace-nowrap">
        {user?.firstName + " " + user?.lastName || "Deleted user"}
      </span>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-label2">
            <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide">Sender</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide">Receiver</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide">Status</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide hidden md:table-cell">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-label">No friend requests found</td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req._id} className="hover:bg-card-hover transition-colors">
                <td className="px-6 py-3"><UserCell user={req.sender} /></td>
                <td className="px-6 py-3"><UserCell user={req.receiver} /></td>
                <td className="px-6 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusStyles[req.status] || statusStyles.pending}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                  {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
