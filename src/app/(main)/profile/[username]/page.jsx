import { Suspense } from "react";
import Loading from "@/components/Loading";
import UserDetailWrapper from "@/components/profile/UserDetailWrapper";
import ProfileHeaderWrapper from "@/components/profile/ProfileHeaderWrapper";
import ProfileHeaderSkeleton from "@/components/profile/ProfileHeaderSkeleton";
import ProfilePostFeedWrapper from "@/components/profile/ProfilePostFeedWrapper";
import PeopleYouMayKnowWrapper from "@/components/profile/PeopleYouMayKnowWrapper";
import PeopleYouMayKnowSkeleton from "@/components/profile/PeopleYouMayKnowSkeleton";

export default async function ProfilePage({ params }) {
  return (
    <div className="w-full overflow-x-hidden bg-bg">
      <div className="w-full flex flex-col justify-center items-center pt-13 pb-4 bg-whit">
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeaderWrapper params={params} />
        </Suspense>

        <div className="w-[90%] md:w-[70%] h-70 md:h-85 bg-card border border-border rounded-md pt-3 overflow-hidden relative">
          <Suspense fallback={<PeopleYouMayKnowSkeleton />}>
            <PeopleYouMayKnowWrapper />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-[90%] md:w-[70%] max-h-full flex flex-col md:flex-row gap-5 md:gap-2 mt-5">
          <div className="w-full md:w-[35%]">
            <Suspense fallback={<Loading />}>
              <UserDetailWrapper params={params} />
            </Suspense>
          </div>
          <div className="w-full md:w-[65%]">
            <Suspense fallback={<Loading />}>
              <ProfilePostFeedWrapper params={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div >
  );
}
