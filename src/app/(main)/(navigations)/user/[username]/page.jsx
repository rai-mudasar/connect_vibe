import ProfileHeader from "@/components/profile/ProfileHeader";
import UserDetail from "@/components/profile/UserDetail";
import { Suspense } from "react";
import { getLoggedInUserProfile } from "@/actions/userActions";
import ProfilePostFeedWrapper from "@/components/post/ProfilePostFeedWrapper";

export default async function ProfilePage({ params }) {
  const { username } = await params;

    const response = await getLoggedInUserProfile(username)
  
    const currentProfileUser = response.success ? response.data.loggedInUser : [];
    const isOwnProfile = response.success ? response.data.isOwnProfile : null;

  if (!currentProfileUser) return <div>User not found</div>;

  return (
    <div>
      <div className="w-full max-h-full flex flex-col justify-center items-center pt-13 pb-2 bg-white">
        <ProfileHeader
          currentProfileUser={currentProfileUser}
          isOwnProfile={isOwnProfile}
        />
      </div>

      <div className="w-full mah-h-full flex flex-col justify-center items-center bg-[#F2F4F7]">
        <div className="w-[90%] md:w-[70%] max-h-full flex flex-col md:flex-row gap-5 md:gap-2 mt-5">
          <div className="w-full md:w-[35%]">
            <UserDetail
              currentProfileUser={currentProfileUser}
            />
          </div>
          <div className="w-full md:w-[65%]">
            <Suspense fallback={<p></p>}>
              <ProfilePostFeedWrapper
                currentProfileUser={currentProfileUser}
                isOwnProfile={isOwnProfile}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
