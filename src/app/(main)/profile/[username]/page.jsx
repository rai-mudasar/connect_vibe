import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PeopleYouMayKnow from "@/components/profile/PeopleYouMayKnow";
import PostFeed from "@/components/post/PostFeed";
import UserDetail from "@/components/profile/UserDetail";

export default async function ProfilePage({ params }) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  
  const profileUser = await userModel
  .findOne({ username })
  .select(
    "username firstName lastName profileImageUrl coverImageUrl bio location occupation relationshipStatus",
  )
  .lean();
  
  const isOwnProfile = session?.user?.id === String(profileUser._id)

  // 2. Fetch only THIS user's posts (Sorted newest first)
  const allPost = await postModel
    .find({ author: profileUser._id })
    .sort({ createdAt: -1 })
    .populate("author", "firstName lastName profileImageUrl")
    .lean();

  return (
    <div>
      <div className="w-full max-h-full flex flex-col justify-center items-center pt-13 pb-2 bg-white">
        <ProfileHeader
          currentProfileUser={JSON.parse(JSON.stringify(profileUser))}
          isOwnProfile={session?.user?.id === String(profileUser._id)}
        />

        {isOwnProfile &&
          <div className="w-[90%] md:w-[70%] h-70 md:h-80 border border-gray-300 rounded-md pt-3">
            <PeopleYouMayKnow />
          </div>}
      </div>

      <div className="w-full mah-h-full flex flex-col justify-center items-center bg-[#F2F4F7]">
        <div className="w-[90%] md:w-[70%] max-h-full flex flex-col md:flex-row gap-5 md:gap-2 mt-5">
          <div className="w-full md:w-[35%]">
            <UserDetail
              currentProfileUser={JSON.parse(JSON.stringify(profileUser))}
            />
          </div>
          <div className="w-full md:w-[65%]">
            <PostFeed
              loggedInUser={JSON.parse(JSON.stringify(profileUser))}
              posts={JSON.parse(JSON.stringify(allPost))}
              isOwnProfile={isOwnProfile}
              className={''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
