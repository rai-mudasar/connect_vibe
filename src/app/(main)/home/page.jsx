import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllPost } from "@/actions/postActions";
import LeftSidebar from "@/components/LeftSideBar";
import PostFeed from "@/components/post/PostFeed";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const response = await getAllPost()

  const allPost = response.success ? response.data : []

  return (
    <div className="max-w-full h-screen bg-[#F2F4F7] dark:bg-[#333334] overflow-x-hidden pt-5">
      <LeftSidebar user={session.user} />
      <PostFeed user={session.user} posts={allPost} className={"mt-13"} />
    </div>
  );
}
