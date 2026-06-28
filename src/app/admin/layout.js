import Topbar from "@/components/admin/nav/Topbar"
import Sidebar from "@/components/admin/nav/Sidebar"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { getLoggedInUser } from "@/actions/userActions"

export const metadata = {
  title: "Admin Panel | Connect Vibe",
}

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.role === 'admin') {
    redirect("/login")
  }

  const response = await getLoggedInUser();
  const loggedInUser = response.success ? response.data : null

  return (
    <div className="flex h-screen bg-bg-gray1 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar user={loggedInUser} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
