import React from "react";
import PostFeed from "@/components/post/PostFeed";
import LeftSidebar from "@/components/LeftSideBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllPost } from "@/actions/postActions";
import { getLoggedInUser } from "@/actions/userActions";

export default async function HomePage() {
  let loggedInUser;
  const session = await getServerSession(authOptions);

  const res = await getLoggedInUser(session?.user?.id);
  if (res?.success) {
    loggedInUser = res.data;
  }

  const response = await getAllPost();

  const allPost = response.success ? response.data : [];

  return (
    <div className="w-[calc(100vw-14px) bg-[#F2F4F7] dark:bg-[#333334] pt-23.5 md:pt-17 flex flex-row gap-2 lg:gap-22 relative">
      <div className="hidden md:block md:min-w-70 md:w-[23%]">
        <LeftSidebar loggedInUser={loggedInUser} />
      </div>
      <div className="w-screen md:w-150 mx-4 z-20">
        <PostFeed
          loggedInUser={loggedInUser}
          posts={allPost}
          isOwnProfile={true}
        />
        <div className="flex md:hidden w-full h-3"></div>
      </div>
    </div>
  );
}
