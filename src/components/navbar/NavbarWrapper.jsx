import Navbar from "./Navbar";
import { getLoggedInUserNotifications } from "@/actions/notificationActions";
import NavbarSkeleton from "./NavbarSkeleton";


export default async function NavbarWrapper() {
    const response = await getLoggedInUserNotifications();
    const notifications = response.success ? response.data.notifications : []
    const loggedInUser = response.success ? response.data.loggedInUser : null

    return (
        <Navbar loggedInUser={loggedInUser} notifications={notifications} />
    )
}