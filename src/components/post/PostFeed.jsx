import React from "react";
import PostCard from "@/components/post/PostCard";
import CreatePostDialog from "./CreatePostDialog";

export default function PostFeed({ loggedInUser, allPosts, isOwnProfile, className }) {
  
  return (
    <div className={`w-full flex flex-col gap-3 md:gap-5 ${className} relative`}>
      {isOwnProfile && <CreatePostDialog loggedInUser = {loggedInUser} />}

      {allPosts.length === 0 && (
        <div className="w-full h-187.5 flex justify-center items-center">
          <p className="text-3xl font-semibold text-text2">
            No Post to Display
          </p>
        </div>
      )}

      {allPosts.length !== 0 &&
        allPosts.map((post, index) => (
          <PostCard
            key={post._id}
            post={post}
            priority={index < 2}
            loggedInUser={loggedInUser}
          />
        ))}
    </div>
  );
};