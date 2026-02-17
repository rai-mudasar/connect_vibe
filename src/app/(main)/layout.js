import Navbar from "@/components/Navbar";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";



export default async function MainLayout({ children }) {

  const session = await getServerSession(authOptions)

  return (
    <div className="w-full relative">
        <Navbar loggedInUser={session.user} />
      <main>{children}</main>
    </div>
  )
}