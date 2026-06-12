import LeftSidebar from "./LeftSidebar";
import { getLoggedInUser } from "@/actions/userActions";

export default async function LeftSidebarWrapper() {
    const response = await getLoggedInUser();

    const loggedInUser = response.success ? response.data : null

    return (
        <LeftSidebar loggedInUser={loggedInUser} />
    )
} 