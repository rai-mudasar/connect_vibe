
import { formatDistanceToNow } from "date-fns";
import React from "react";
import PostCard from "@/components/post/PostCard";
import CreatePostDialog from "./CreatePostDialogue";

const PostFeed = ({user, posts, className}) => {
  return (
    <main className={`max-w-170 w-full mx-auto px-4 flex flex-col gap-5 ${className}`}>
      <CreatePostDialog user={user} />
      {posts.length === 0 &&
        <div className="w-full h-80 flex justify-center items-center">
          <p className="text-3xl font-semibold text-neutral-700">No Post to Display</p>
        </div>
      }

        {/* Display all post */}

      {posts.length !== 0 &&
        posts.map((post, index) => (
          <PostCard
            key={post._id}
            author={post.author}
            authorProfileImage={post.author.profileImageUrl}
            time={formatDistanceToNow(new Date(post.createdAt))}
            content={post.caption}
            image={post.media}
            priority={index < 2}
          />
        ))}
    </main>
  );
};

export default PostFeed;
