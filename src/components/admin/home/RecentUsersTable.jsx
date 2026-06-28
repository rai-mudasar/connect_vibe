import SafeImage from "@/components/SafeImage"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function RecentUsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-gray1">
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide">User</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide hidden sm:table-cell">Email</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide hidden md:table-cell">Joined</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user._id} className="bg-bg-white1 hover:bg-bg-gray-hover transition-colors group">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 border md:border-0 border-border bg-bg-gray2 group-hover:bg-bg-gray1">
                    <SafeImage
                      src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                      fill
                      alt="User Profile Image"
                      className="object-contain"
                    />
                    <AvatarFallback className={'text-2xl font-bold text-primary'}>{user?.firstName?.[0] + user?.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-text1">{user.firstName + " " + user.lastName}</span>
                </div>
              </td>
              <td className="px-6 py-3 text-text1 dark:text-gray-400 hidden sm:table-cell">{user.email}</td>
              <td className="px-6 py-3 text-text1 dark:text-gray-400 hidden md:table-cell">
                {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-6 py-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${!user.isBanned
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                  {user.isBanned || "active"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
