'use client'

import Link from "next/link";
import Loading from "../Loading";
import SafeImage from "../SafeImage";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getExactDateAndTime } from "@/helpers/getSmartDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { deletePostById, toggleLikes } from "@/actions/postActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function Post({ fetchedPost, currentUser, comments, likes, isLike }) {
    const [post, setPost] = useState(fetchedPost);
    const [likedList, setLikedList] = useState(likes);
    const [loggedInUser, setLoggedInUser] = useState(currentUser);
    const [loadedComments, setLoadedComments] = useState(comments);
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(isLike);
    const [newComment, setNewComment] = useState("");

    const router = useRouter();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [loadedComments]);

    const handleToggleLikes = async () => {
        const userId = loggedInUser?.id;
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
                router.replace('/home')
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error.message || error)
        }
    };


    if (loading) return <Loading />;
    if (!post) return <div className="w-full h-screen bg-bg-white1 pt-50 text-2xl text-text2 text-center font-semibold">Post not found!</div>;

    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-25 md:pt-20 relative overflow-y-scroll hide-scrollbar">
            <div className="w-[90%] sm:w-[50%] lg:w-[40%] rounded-xl shadow-sm border border-border mb-2 md:mb-4 overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-bg-gray2 rounded-full overflow-hidden relative">
                            {post.author.profileImageUrl && (
                                <SafeImage
                                    src={post.author.profileImageUrl}
                                    fill
                                    alt="Profile"
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <Link className="font-semibold text-[15px] text-text1 hover:underline" href={`/user/${post?.author?.username}`}>
                                {post.author.firstName} {post.author.lastName}
                            </Link>
                            <p className="text-text2 text-[13px]">{getExactDateAndTime(post.createdAt)}</p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 text-text2">
                                <MoreHorizontal className="h-8" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-50 md:w-70 bg-bg-white1 text-text1 border-border">
                            {loggedInUser?.id === post.author._id.toString() ? (
                                <DropdownMenuItem onClick={() => handleDeletePost(post._id)}>
                                    <div className="w-full hover:bg-bg-gray-hover px-2 py-1 rounded-lg cursor-pointer">
                                        <p className="font-bold">Delete Post</p>
                                        <p className="text-text2">This will deleted permanently</p>
                                    </div>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem>
                                    <div className="w-full hover:bg-bg-gray-hover px-2 py-1 rounded-lg cursor-pointer">
                                        <p className="font-bold">Report Post</p>
                                        <p className="text-text2">Hide such post?</p>
                                    </div>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="px-4 pb-3">
                    <p className="text-[15px] text-secondary">{post.caption}</p>
                </div>

                {post.media && (
                    <div className="w- flex justify-center">
                        <div className="w-full aspect-4/5 relative">
                            <SafeImage
                                src={post?.media}
                                fill
                                alt="Post Image"
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="px-4 py-2 flex justify-between text-label text-[14px] border-b border-border">
                    <div className="flex items-center space-x-1">
                        <div className="bg-primary rounded-full p-1">
                            <Heart size={10} className="text-white fill-white" />
                        </div>
                        <span>{likedList.length}</span>
                    </div>
                    <span>{post.comments.length} comments</span>
                </div>

                {/* Actions */}
                <div className="flex px-2 py-1 gap-3 md:gap-7 md:mx-7">
                    <button
                        className="flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-bg-gray-hover rounded-lg text-text1 border border-border font-medium cursor-pointer"
                        onClick={handleToggleLikes}
                    >
                        <Heart size={20} className={isLiked ? "fill-red-600 text-red-600" : ""} />
                        <span>Like</span>
                    </button>
                    <div className="flex-1">
                        <Button
                            className="w-full flex items-center justify-center mt-0.5 p-2 bg-card hover:bg-bg-gray-hover rounded-lg text-[16px] text-text1 border border-border font-medium cursor-pointer"
                        >
                            <MessageCircle size={22} strokeWidth="2.5px" />
                            <span>Comment</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="w-[80%] lg:w-[60%] h-2 border-b-2 border-border mt-1"></div>

            {/* Comments Section */}
            <div className="w-[95%] sm:w-[80%] lg:w-[60%] mt-2 ml-7">
                <div className="py-3">
                    <h4 className="text-sm font-semibold text-label">Comments</h4>
                    <div className="ml-4 mt-4 space-y-4">
                        {loadedComments?.length > 0 ? (
                            loadedComments.map((comment) => (
                                <div key={comment._id} className="flex gap-3">
                                    <Avatar className="h-7 w-7 relative">
                                        <SafeImage
                                            src={comment.author.profileImageUrl !== "" ? comment.author.profileImageUrl : null}
                                            fill
                                            alt="User Profile Image"
                                            className="object-contain"
                                        />
                                        <AvatarFallback>
                                            {comment.author.firstName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-bg-gray1 p-2 px-3 rounded-tr-xl rounded-bl-xl max-w-[85%]">
                                        <p className="text-xs font-bold text-text2">
                                            {comment.author.firstName} {comment.author.lastName}
                                        </p>
                                        <p className="text-sm text-text1">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center text-label py-4">
                                No comments yet. Be the first!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}