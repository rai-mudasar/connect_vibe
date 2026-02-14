"use client";

import React, { useEffect, useState } from "react";
import CreatePost from "@/components/CreatePost";
import Post from "@/components/Post";
import { toast } from "sonner";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const FeedPage = () => {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    fetchAllPost();
  }, []);

  const fetchAllPost = async () => {
    try {
      const response = await axios.get("/api/post/get-all");

      
      if (response.data.success) {
        setAllPosts(response.data?.data);
      } else {
        toast.error("No more Post");
      }
    } catch (error) {
      console.log(error);
    }
    console.log("Response of a Post : ", allPosts[0]);
  };
  return (
    <main className="max-w-170 w-full mx-auto pt-5 px-4 mt-13">
      <CreatePost />

      {allPosts.length === 0 &&
        <div className="w-full h-80 flex justify-center items-center">
          <p className="text-3xl font-semibold text-neutral-700">No Post to Display</p>
        </div>
      }

        {/* Display all post */}

      {allPosts.length !== 0 &&
        allPosts.map((post, index) => (
          <Post
            key={post._id}
            user={post.author.username}
            time={formatDistanceToNow(new Date(post.createdAt))}
            content={post.caption}
            image={post.media}
            priority={index < 2}
          />
        ))}
    </main>
  );
};

export default FeedPage;
