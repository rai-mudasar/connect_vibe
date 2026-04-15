import UserDetail from "./UserDetail";
import { getLoggedInUserProfile } from "@/actions/userActions";

export default async function UserDetailWrapper({ params }) {
    const { username } = await params;

    const response = await getLoggedInUserProfile(username)
    const currentProfileUser = response.success ? response.data.loggedInUser : [];

    return (
        <UserDetail
            currentProfileUser={currentProfileUser}
        />
    )
}
