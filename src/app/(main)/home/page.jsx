import LeftSidebar from "@/components/LeftSideBar";
import React from "react";
import PostFeed from "@/components/post/PostFeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import axios from "axios";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  let allPost = []

  try {
    const response = await axios.get("http://localhost:3000/api/post/get-all");

    if (response.data.success) {
      allPost = response.data?.data
    } else {
      console.log("All post Response not success")
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="max-w-full h-screen bg-[#F2F4F7] dark:bg-[#333334] overflow-x-hidden pt-5">
      <LeftSidebar user={session.user} />
      <PostFeed user={session.user} posts={allPost} className={"mt-13"} />
    </div>
  );
}
