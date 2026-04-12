'use client'

import { deletePostById, getPostAllcomments, getPostById, toggleLikes } from "@/actions/postActions";
import SafeImage from "@/components/SafeImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import getSmartDateTime from "@/helpers/getSmartDate";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function PostPage({ params }) {

    const [post, setPost] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [likedList, setLikedList] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [loadedComments, setLoadedComments] = useState([]);

    let postId

    const router = useRouter();

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [loadedComments]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { postId } = await params;
                const [postRes, commentRes] = await Promise.all([
                    getPostById(postId),
                    getPostAllcomments(postId)
                ])

                if (postRes.success) {
                    const { loggedInUser, fetchedPost } = postRes.data;
                    setLoggedInUser(loggedInUser);
                    setPost(fetchedPost);

                    const likes = fetchedPost.likes.map(id => id.toString());
                    setLikedList(likes);
                    setIsLiked(likes.includes(loggedInUser?.id));
                } else {
                    throw new Error(postRes.message)
                }

                if (commentRes.success) {
                    console.log("Response comnts area : ", commentRes.data);
                    setLoadedComments(commentRes.data);
                } else {
                    throw new Error(commentRes.message)
                }
            } catch (error) {
                toast.error(`Failed to load post with error : ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [params]);

    const handleToggleLikes = async () => {
        const userId = loggedInUser?.id;
        if (!userId) return toast.error("Please login to like");

        const wasLiked = isLiked;
        setIsLiked(!isLiked);
        setLikedList(prev => wasLiked
            ? prev.filter(id => id !== userId)
            : [...prev, userId]
        );

        try {
            const response = await toggleLikes(post._id);
            if (!response.success) throw new Error();
        } catch (error) {
            // Rollback on failure
            setIsLiked(wasLiked);
            setLikedList(post.likes);
            toast.error("Could not update like");
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


    if (loading) return <div className="p-10 text-center">Loading post...</div>;
    if (!post) return <div className="p-10 text-center">Post not found</div>;

    return (
        <div className="w-[100vw-0] flex flex-col items-center pt-25 md:pt-20 relative overflow-hidden">
            <div className="w-[90%] sm:w-[80%] lg:w-[60%] bg-white rounded-xl shadow-sm border border-gray-200 mb-2 md:mb-4 overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden relative">
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
                            <Link className="font-semibold text-[15px] hover:underline" href={`/user/${post?.author?.username}`}>
                                {post.author.firstName} {post.author.lastName}
                            </Link>
                            <p className="text-gray-500 text-[13px]">{getSmartDateTime(post.createdAt)}</p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                                <MoreHorizontal size={20} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                            {loggedInUser?.id === post.author._id.toString() ? (
                                <DropdownMenuItem onClick={() => handleDeletePost(post._id)}>
                                    <span className="text-red-600 cursor-pointer">Delete Post</span>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem>Report</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="px-4 pb-3">
                    <p className="text-[15px]">{post.caption}</p>
                </div>

                {post.media && (
                    <div className="w-full bg-gray-100 h-96 relative">
                        <SafeImage src={post.media} fill alt="Post media" className="object-contain" />
                    </div>
                )}

                {/* Stats */}
                <div className="px-4 py-2 flex justify-between text-gray-500 text-[14px] border-b border-gray-100">
                    <div className="flex items-center space-x-1">
                        <div className="bg-blue-500 rounded-full p-1">
                            <Heart size={10} className="text-white fill-white" />
                        </div>
                        <span>{likedList.length}</span>
                    </div>
                    <span>{post.comments.length} comments</span>
                </div>

                {/* Actions */}
                <div className="flex px-2 py-1">
                    <button
                        className="flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium cursor-pointer"
                        onClick={handleToggleLikes}
                    >
                        <Heart size={20} className={isLiked ? "fill-red-600 text-red-600" : ""} />
                        <span>Like</span>
                    </button>
                    <div className="flex-1">
                        <Button
                            className="w-full flex items-center justify-center mt-0.5 p-2 hover:bg-gray-100 rounded-lg text-[16px] text-gray-600 font-medium cursor-pointer"
                        >
                            <MessageCircle size={22} strokeWidth="2.5px" />
                            <span>Comment</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div  ref={scrollRef} className="w-[80%] lg:w-[60%] h-2 border-b-2 border-gray-300 mt-1"></div>

            {/* Comments Section */}
            <div className="w-[95%] sm:w-[80%] lg:w-[60%] mt-2 ml-7">
                <div className="">
                    <h4 className="text-sm font-semibold text-gray-500">Comments</h4>
                    <div className="ml-4 mt-4 space-y-4">
                        {loadedComments?.length > 0 ? (
                            loadedComments.map((comment) => (
                                <div key={comment._id} className="flex gap-3">
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage src={comment.author.profileImageUrl} />
                                        <AvatarFallback>
                                            {comment.author.firstName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-gray-100 p-2 px-3 rounded-2xl max-w-[85%]">
                                        <p className="text-xs font-bold">
                                            {comment.author.firstName} {comment.author.lastName}
                                        </p>
                                        <p className="text-sm">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center text-gray-400 py-4">
                                No comments yet. Be the first!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}