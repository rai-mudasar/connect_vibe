import ProfileHeader from './ProfileHeader'
import { getLoggedInUserProfile } from '@/actions/userActions';

export default async function ProfileHeaderWrapper({ params, isPublicView }) {
    const { username } = await params;

    const response = await getLoggedInUserProfile(username)

    const currentProfileUser = response.success ? response.data.loggedInUser : [];
    const isOwnProfile = response.success ? response.data.isOwnProfile : null;

    return (
        <ProfileHeader
            currentProfileUser={currentProfileUser}
            isOwnProfile={isPublicView ? false : isOwnProfile}
        />
    )
}

