import StatsCards from "@/components/admin/users/StatsCards";
import UsersTable from "@/components/admin/users/UsersTable";
import { getAdminStats, getUsersByFilter } from "@/actions/adminActions";

export default async function AdminUsersPage() {
  const [statsRes, usersRes] = await Promise.all([
    getAdminStats(),
    getUsersByFilter(),
  ]);

  const stats = statsRes.data;
  const users = usersRes.success ? usersRes.data.users : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Users</h1>
        <p className="text-sm text-text2 mt-0.5">
          Manage members, moderation, verification, and access across Vibe Connect.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="flex flex-col xl:flex-row gap-6">

        <div className="flex-1 min-w-0">
          <UsersTable initialUsers={users} />
        </div>
      </div>
    </div>
  );
}
