import { getGlobalUnreadMessageCount } from "@/actions/chatActions";
import Navbar from "./Navbar";
import { getLoggedInUserNotifications } from "@/actions/notificationActions";

export default async function NavbarWrapper() {
    const response = await getLoggedInUserNotifications();
    const initialUnreadMessageRes = await getGlobalUnreadMessageCount();

    const notifications = response.success ? response.data.notifications : []
    const loggedInUser = response.success ? response.data.loggedInUser : null
    const isAdmin = response.success ? response.data.isAdmin : null

    const initialUnreadMessageCount = initialUnreadMessageRes?.success ? initialUnreadMessageRes?.data : 0;

    return (
        <Navbar loggedInUser={loggedInUser} notifications={notifications} isAdmin={isAdmin} initialUnreadMessageCount={initialUnreadMessageCount} />
    )
}