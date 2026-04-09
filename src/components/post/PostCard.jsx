"use client";

import { Heart, MoreHorizontal } from "lucide-react";
import { deletePost, toggleLikes } from "@/actions/postActions";
import { useState } from "react";
import ViewPost from "./ViewPost";
import SafeImage from "../SafeImage";
import getSmartDateTime from "@/helpers/getSmartDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function PostCard({ post, priority, loggedInUser }) {
  const [likedList, setLikedList] = useState(
    post.likes.map((id) => id.toString()),
  );
  const userId = loggedInUser?._id?.toString();
  const [isLiked, setIsLiked] = useState(likedList.includes(userId));

  const router = useRouter();

  const handleToggleLikes = async () => {
    const updatedLikes = isLiked
      ? likedList.filter((id) => id !== userId)
      : [...likedList, userId];
    setLikedList(updatedLikes);
    setIsLiked(!isLiked)

    try {
      const response = await toggleLikes(post._id);
      if (response.success) return setLikedList(post.likes)
    } catch (error) {
      setLikedList(post.likes);
      toast.error(error.message || error)
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await deletePost(postId);

      if (response.success) {
        router.refresh()
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error(error.message || error)
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-2 md:mb-4 overflow-hidden relative">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-2 relative">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden relative">
            {post.author.profileImageUrl && (
              <SafeImage
                src={post.author.profileImageUrl}
                fill
                alt="User Profile Image"
                className={"object-contain"}
              />
            )}
          </div>
          <div>
            <Link className="font-semibold text-[15px] hover:underline cursor-pointer" href={`/user/${post.author.username}`}>
              {post.author.firstName} {post.author.lastName}
            </Link>
            <p className="text-gray-500 text-[13px]">
              {getSmartDateTime(post.createdAt)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger >
            <div className="p-2 hover:bg-gray-100 rounded-full text-gray-600 cursor-pointer border-0">
              <MoreHorizontal size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={'bg-white absolute -top-1 right-1'}>
            {loggedInUser._id.toString() === post.author._id.toString() &&
              <DropdownMenuItem>
                <div className="w-full cursor-pointer hover:underline" onClick={() => handleDeletePost(post._id.toString())}>
                  Delete Post
                </div>
              </DropdownMenuItem>
            }
            {loggedInUser._id !== post.author._id &&
              <DropdownMenuItem>
                <div className="w-full cursor-pointer hover:underline">
                  Report
                </div>
              </DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 pb-3">
        <p className="text-[15px]">{post.caption}</p>
      </div>

      {/* Optional Post Image */}
      {post.media && (
        <div className="w-full bg-gray-100 flex justify-center">
          <div className="w-full h-120 relative">
            <SafeImage
              src={post.media}
              fill
              alt="Post Image"
              priority={priority}
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex justify-between text-gray-500 text-[14px] border-b border-gray-100 mx-2">
        <div className="flex items-center space-x-1">
          <div className="bg-blue-500 rounded-full p-1">
            <Heart size={12} className="text-white" />
          </div>
          <span>{post.likes.length}</span>
        </div>
        <div className="flex space-x-3">
          <span>{post.comments.length} comments</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex px-2 py-1">
        <button
          className="w-[50%] flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium cursor-pointer"
          onClick={handleToggleLikes}
        >
          {isLiked ? (
            <Heart size={20} fill="red" className="text-red-600" />
          ) : (
            <Heart size={20} />
          )}
          <span>Like</span>
        </button>
        <div className="w-[50%] cursor-pointer">
          <ViewPost post={post} />
        </div>
      </div>
    </div>
  );
}
