"use client";

import Link from "next/link";
import SafeImage from "../SafeImage";
import ViewPostDialog from "./ViewPostDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useConfirm } from "@/context/ConfirmContext";
import { Heart, MoreHorizontal, Trash2 } from "lucide-react";
import { getExactDateAndTime } from "@/helpers/getSmartDate";
import { deletePostById, toggleLikes } from "@/actions/postActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function PostCard({ post, priority, loggedInUser }) {
  const userId = loggedInUser?._id?.toString();

  const [likedList, setLikedList] = useState(post.likes.map((id) => id.toString()));
  const [isLiked, setIsLiked] = useState(likedList.includes(userId));
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  const router = useRouter();
  const textRef = useRef(null)
  const { confirm, close } = useConfirm();

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxLineHeight = lineHeight * 4;

      setIsClamped(el.scrollHeight > maxLineHeight)
    }
  }, [post?.caption])

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

    confirm({
      title: "Delete Post Permanently?",
      description: "Are you sure? This action cannot be undone and will clear all comments.",
      confirmText: "Yes, Delete",
      variant: "destructive",
      icon: Trash2,
      onConfirm: async () => {
        try {
          const response = await deletePostById(postId);

          if (response.success) {
            close();
            router.refresh()
            toast.success(response.message)
          } else {
            toast.error(response.message)
          }
        } catch (error) {
          toast.error(error.message || error)
        }
      },
    });
  };

  return (
    <div className="w-full h-full bg-bg-white1 dark:bg-dark-card text-text1 rounded-xl shadow-sm border border-border dark:border-border-dark mb-2 md:mb-4 overflow-hidden relative">

      <div className="flex items-center justify-between p-4 pb-2 relative">
        <div className="flex items-center space-x-2 dark:text-text-dark">
          <Avatar className="w-10 h-10 bg-dark-card2 border border-border dark:border-border-dark rounded-full overflow-hidden relative">
            {post?.author?.profileImageUrl && (
              <SafeImage
                src={post?.author?.profileImageUrl}
                fill
                alt="User Profile Image"
                className={"object-contain"}
              />
            )}
            <AvatarFallback className={'text-[22px] text-text1 dark:text-text-dark font-bold'}>{post?.author?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link className="font-semibold text-[15px] hover:underline cursor-pointer" href={`/user/${post?.author?.username}`}>
              {post?.author?.firstName} {post?.author?.lastName}
            </Link>
            <p className="text-text2 text-[13px]">
              {getExactDateAndTime(post?.createdAt)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          {loggedInUser?._id.toString() === post?.author?._id.toString() &&
            <DropdownMenuTrigger >
              <div className="p-2 rounded-full cursor-pointer border-0">
                <MoreHorizontal className="w-6 text-text2 dark:text-text-dark" />
              </div>
            </DropdownMenuTrigger>
          }
          <DropdownMenuContent className={'w-70 bg-bg-white1 dark:bg-dark-card text-text1 dark:text-text-dark border-border dark:border-border-dark absolute -top-1 right-1'}>
            <DropdownMenuItem>
              <div className="w-full p-2 cursor-pointer hover:bg-bg-gray-hover dark:hover:bg-dark-card2 rounded-md" onClick={() => handleDeletePost(post?._id.toString())}>
                <p className="font-bold">Delete Post</p>
                <p className="text-text2">This will be deleted permanently.</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={`px-4 pb-3`}>
        <p ref={textRef} className={`text-[15px] text-text1 dark:text-text-dark ${isExpanded ? '' : 'line-clamp-2'}`}>{post?.caption}</p>
        {isClamped && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold cursor-pointer"
          >
            {isExpanded ? 'See less...' : '...See More'}
          </button>
        )}
      </div>


      {post?.media && (
        <div className="w-full flex justify-center">
          <div className="w-full aspect-4/5 relative">
            <SafeImage
              src={post?.media}
              fill
              alt="Post Image"
              priority={priority}
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="px-4 py-2 flex justify-between text-text2 text-[14px] border-b border-border dark:border-border-dark mx-2">
        <div className="flex items-center space-x-1">
          <div className="bg-primary rounded-full p-1">
            <Heart size={12} className="text-white" />
          </div>
          <span>{post?.likes?.length}</span>
        </div>
        <Link href={`/post/${post._id}`} className="flex space-x-3">
          <span>{post?.commentsCount} comments</span>
        </Link>
      </div>

      <div className="flex px-2 py-1 gap-2">
        <button
          className="w-[50%] flex items-center justify-center space-x-2 py-2 hover:bg-bg-gray-hover dark:hover:bg-dark-card2 border border-border dark:border-border-dark rounded-lg text-text2 dark:text-text-dark font-medium cursor-pointer"
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
          <ViewPostDialog post={post} loggedInUser={loggedInUser} />
        </div>
      </div>
    </div>
  );
}
