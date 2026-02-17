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
  const suggestedUsers = [
    {
      id: 1,
      name: "Alex Johnson",
      profileImageUrl: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Sarah Williams",
      profileImageUrl: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Michael Chen",
      profileImageUrl: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Emma Davis",
      profileImageUrl: "https://i.pravatar.cc/150?u=4",
    },
    {
      id: 5,
      name: "Marcus Rodriguez",
      profileImageUrl: "https://i.pravatar.cc/150?u=5",
    },
    {
      id: 6,
      name: "Chloe Smith",
      profileImageUrl: "https://i.pravatar.cc/150?u=6",
    },
    {
      id: 7,
      name: "Jordan Lee",
      profileImageUrl: "https://i.pravatar.cc/150?u=7",
    },
    {
      id: 8,
      name: "Sophia Taylor",
      profileImageUrl: "https://i.pravatar.cc/150?u=8",
    },
    {
      id: 9,
      name: "Daniel Kim",
      profileImageUrl: "https://i.pravatar.cc/150?u=9",
    },
    {
      id: 10,
      name: "Olivia Brown",
      profileImageUrl: "https://i.pravatar.cc/150?u=10",
    },
  ];

  // 1. Fetch the Profile Owner's details
  const profileUser = await userModel.findOne({ username }).lean();

  if (!profileUser) return <div>User not found</div>;

  // 2. Fetch only THIS user's posts (Sorted newest first)
  const allPost = await postModel
    .find({ author: profileUser._id })
    .sort({ createdAt: -1 })
    .populate("author", "firstName lastName profileImageUrl")
    .lean();

  // 3. "People You May Know" (Example: Get 5 random users)
  // const suggestedPeople = await userModel
  //   .find({ _id: { $ne: profileUser._id } })
  //   .limit(5)
  //   .lean();

  return (
    <div>
      <div className="w-full max-h-full flex flex-col justify-center items-center pt-13 pb-2 bg-white">
        <ProfileHeader
          user={JSON.parse(JSON.stringify(profileUser))}
          isOwnProfile={session?.user?.id === String(profileUser._id)}
        />

        <div className="w-[70%] h-80 border border-gray-300 rounded-md">
          <PeopleYouMayKnow
            users={JSON.parse(JSON.stringify(suggestedUsers))}
          />
        </div>
      </div>
      <div className="w-full mah-h-full flex flex-col justify-center items-center bg-[#F2F4F7]">
        <div className="w-[70%] max-h-full flex flex-row gap-2 mt-5">
          <div className="w-[35%]">
            <UserDetail user={JSON.parse(JSON.stringify(profileUser))} />
          </div>
          <div className="w-[65%]">
            <PostFeed
              user={JSON.parse(JSON.stringify(profileUser))}
              posts={allPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
