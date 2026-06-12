import Navbar from "./Navbar";
import { getLoggedInUserNotifications } from "@/actions/notificationActions";

export default async function NavbarWrapper() {
    const response = await getLoggedInUserNotifications();
    const notifications = response.success ? response.data.notifications : []
    const loggedInUser = response.success ? response.data.loggedInUser : null
    const isAdmin = response.success ? response.data.isAdmin : null

    return (
        <Navbar loggedInUser={loggedInUser} notifications={notifications} isAdmin={isAdmin} />
    )
}