import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllPost } from "@/actions/postActions";
import LeftSidebar from "@/components/LeftSideBar";
import PostFeed from "@/components/post/PostFeed";
import { getLoggedInUser } from "@/actions/userActions";

export default async function HomePage() {
  let loggedInUser;
  const session = await getServerSession(authOptions);

  const res = await getLoggedInUser(session?.user?.id);
  if (res.success) {
    // console.log("Logged : ", res.data);
    loggedInUser = res.data;
  }

  const response = await getAllPost();

  const allPost = response.success ? response.data : [];

  return (
    <div className="max-w-full h-screen bg-[#F2F4F7] dark:bg-[#333334] overflow-x-hidden pt-14 md:pt-5 flex flex-row relative">
      <div className="w-0 md:w-[25%]">
        <LeftSidebar loggedInUser={loggedInUser} />
      </div>
      <div className="w-full md:w-[55%]">
        <PostFeed
          loggedInUser={loggedInUser}
          posts={allPost}
          isOwnProfile={true}
          className={"mt-13"}
        />
      </div>
    </div>
  );
}
