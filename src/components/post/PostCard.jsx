"use client";

import { Heart, MoreHorizontal } from "lucide-react";
import { deletePostById, toggleLikes } from "@/actions/postActions";
import { useState } from "react";
import ViewPostDialog from "./ViewPostDialog";
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
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function PostCard({ post, priority, loggedInUser }) {
  const [likedList, setLikedList] = useState(
    post.likes.map((id) => id.toString()),
  );
  const userId = loggedInUser?._id?.toString();
  const [isLiked, setIsLiked] = useState(likedList.includes(userId));

  const router = useRouter();

  const handleToggleLikes = async () => {
    const userId = loggedInUser?._id;
    if (!userId) return toast.error("Please login to like");

    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    setLikedList(prev => wasLiked
      ? prev.filter(id => id !== userId)
      : [...prev, userId]
    );
    router.refresh()

    try {
      const response = await toggleLikes(post._id);
      if (!response.success) throw new Error();
    } catch (error) {
      setIsLiked(wasLiked);
      setLikedList(post.likes);
      toast.error(`Could not update like : ${error.message || error}`);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await deletePostById(postId);

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
    <div className="w-full h-full bg-card rounded-xl shadow-sm border border-border mb-2 md:mb-4 overflow-hidden relative text-secondary">

      <div className="flex items-center justify-between p-4 pb-2 relative">
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10 bg-bg border border-border rounded-full overflow-hidden relative">
            {post.author.profileImageUrl && (
              <SafeImage
                src={post.author.profileImageUrl}
                fill
                alt="User Profile Image"
                className={"object-contain"}
              />
            )}
            <AvatarFallback className={'text-[22px] text-primary font-bold'}>{post?.author?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link className="font-semibold text-[15px] hover:underline cursor-pointer" href={`/user/${post.author.username}`}>
              {post.author.firstName} {post.author.lastName}
            </Link>
            <p className="text-label text-[13px]">
              {getSmartDateTime(post.createdAt)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger >
            <div className="p-2 rounded-full cursor-pointer border-0">
              <MoreHorizontal className="w-6 text-label hover:text-primary" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={'bg-bg text-secondary border-border absolute -top-1 right-1'}>
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

      {post.media && (
        <div className="w-full bg-label flex justify-center">
          <div className="w-full aspect-4/5 relative">
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

      <div className="px-4 py-2 flex justify-between text-label text-[14px] border-b border-border mx-2">
        <div className="flex items-center space-x-1">
          <div className="bg-primary rounded-full p-1">
            <Heart size={12} className="text-white" />
          </div>
          <span>{post.likes.length}</span>
        </div>
        <Link href={`/post/${post._id}`} className="flex space-x-3">
          <span>{post.comments.length} comments</span>
        </Link>
      </div>

      <div className="flex px-2 py-1 gap-2">
        <button
          className="w-[50%] flex items-center justify-center space-x-2 py-2 hover:bg-primary border border-border rounded-lg text-label font-medium cursor-pointer"
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
          <ViewPostDialog post={post} />
        </div>
      </div>
    </div>
  );
}
