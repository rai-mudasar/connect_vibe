import { formatDistanceToNow } from "date-fns";
import React from "react";
import PostCard from "@/components/post/PostCard";
import CreatePostDialog from "./CreatePostDialogue";

const PostFeed = ({ loggedInUser, posts, isOwnProfile, className }) => {
  return (
    <main
      className={`max-w-170 w-full mx-auto px-4 flex flex-col gap-5 ${className} relative`}
    >
      {isOwnProfile && <CreatePostDialog loggedInUser={loggedInUser} />}

      {posts.length === 0 && (
        <div className="w-full h-80 flex justify-center items-center">
          <p className="text-3xl font-semibold text-neutral-700">
            No Post to Display
          </p>
        </div>
      )}

      {posts.length !== 0 &&
        posts.map((post, index) => (
          <PostCard
            key={post._id}
            postId={post._id}
            author={post.author}
            authorProfileImage={post.author.profileImageUrl}
            time={formatDistanceToNow(new Date(post.createdAt))}
            content={post.caption}
            image={post.media}
            likes={post.likes}
            comment={post.comments}
            loggedInUser={loggedInUser}
            priority={index < 2}
            post={post}
          />
        ))}
    </main>
  );
};

export default PostFeed;
