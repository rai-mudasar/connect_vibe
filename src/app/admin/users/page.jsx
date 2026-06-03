import { getUsers } from "@/actions/adminAction"
import UsersTable from "@/components/admin/UsersTable"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View, search, ban, and delete users.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <UsersTable initialUsers={users} />
      </div>
    </div>
  )
}
