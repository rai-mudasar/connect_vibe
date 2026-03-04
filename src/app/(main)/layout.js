import { getLoggedInUserNotifications } from "@/actions/notificationActions";
import Navbar from "@/components/Navbar";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function MainLayout({ children }) {
  let notifications;

  const session = await getServerSession(authOptions);
  const response = await getLoggedInUserNotifications(session?.user?.id);
  if (response.success) {
    notifications = response?.data;
  }

  return (
    <div className="w-full relative">
      <Navbar loggedInUser={session?.user} notifications={notifications} />
      <main>{children}</main>
    </div>
  );
}
