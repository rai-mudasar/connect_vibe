import { Suspense } from "react";
import UserDetail from "@/components/profile/UserDetail";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePostFeedWrapper from "@/components/post/ProfilePostFeedWrapper";
import PeopleYouMayKnowWrapper from "@/components/profile/PeopleYouMayKnowWrapper";
import PeopleYouMayKnowSkeleton from "@/components/profile/PeopleYouMayKnowSkeleton";
import { getLoggedInUserProfile } from "@/actions/userActions";

export default async function ProfilePage({ params }) {
  const { username } = await params;

  const response = await getLoggedInUserProfile(username)

  const currentProfileUser = response.success ? response.data.loggedInUser : [];
  const isOwnProfile = response.success ? response.data.isOwnProfile : null;

  return (
    <div className="w-[98vw] overflow-x-hidden">
      <div className="w-full flex flex-col justify-center items-center pt-13 pb-4 bg-whit">
        <ProfileHeader
          currentProfileUser= {currentProfileUser}
          isOwnProfile={isOwnProfile}
        />

        {isOwnProfile &&
          <div className="w-[90%] md:w-[70%] h-70 md:h-85 border border-gray-300 rounded-md pt-3 overflow-hidden relative">
            <Suspense fallback={<PeopleYouMayKnowSkeleton />}>
              <PeopleYouMayKnowWrapper />
            </Suspense>
          </div>}
      </div>

      <div className="w-full flex flex-col justify-center items-center bg-[#F2F4F7]">
        <div className="w-[90%] md:w-[70%] max-h-full flex flex-col md:flex-row gap-5 md:gap-2 mt-5">
          <div className="w-full md:w-[35%]">
            <UserDetail
              currentProfileUser= {currentProfileUser}
            />
          </div>
          <div className="w-full md:w-[65%]">
            <ProfilePostFeedWrapper
              currentProfileUser= {currentProfileUser}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
