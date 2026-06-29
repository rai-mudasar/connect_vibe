'use client'

import Link from "next/link";
import Loading from "../Loading";
import SafeImage from "../SafeImage";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getExactDateAndTime } from "@/helpers/getSmartDate";
import { Heart, MessageCircle, MoreHorizontal, Send, CornerDownRight, Trash2 } from "lucide-react";
import { deletePostById, toggleLikes, addNewComment, toggleCommentLike, addCommentReply, getCommentReplies, deleteComment } from "@/actions/postActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

export default function Post({ fetchedPost, currentUser, comments, likes, isLike }) {
    const [post, setPost] = useState(fetchedPost);
    const [likedList, setLikedList] = useState(likes);
    const [loggedInUser, setLoggedInUser] = useState(currentUser);
    const [loadedComments, setLoadedComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(isLike);
    const [newComment, setNewComment] = useState("");
    const [commentSubmitLoading, setCommentSubmitLoading] = useState(false);

    const router = useRouter();
    const scrollRef = useRef(null);

    // Initial comments set karna jo server se aye hain (Main comments layer)
    useEffect(() => {
        if (comments) {
            const mainComments = comments.filter(c => !c.parentId);
            setLoadedComments(mainComments);
        }
    }, [comments]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [loadedComments]);

    const handleToggleLikes = async () => {
        const userId = loggedInUser?.id || loggedInUser?._id;
        if (!userId) return toast.error("Please login to like");

        const wasLiked = isLiked;
        setIsLiked(!isLiked);
        setLikedList(prev => wasLiked
            ? prev.filter(id => id !== userId)
            : [...prev, userId]
        );
        router.refresh();

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
                router.replace('/home');
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || error);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        setCommentSubmitLoading(true);
        try {
            const response = await addNewComment(post._id, newComment);
            if (response.success) {
                setNewComment("");
                setLoadedComments((prev) => [...prev, response.data]);
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to post comment");
        } finally {
            setCommentSubmitLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (!post) return <div className="w-full h-screen bg-bg-white1 pt-50 text-2xl text-text2 text-center font-semibold">Post not found!</div>;

    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-5 md:pt-20 relative overflow-y-scroll hide-scrollbar pb-24">
            <div className="w-[90%] sm:w-[50%] lg:w-[40%] rounded-xl shadow-sm border border-border mb-2 md:mb-4 overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-bg-gray2 rounded-full overflow-hidden relative">
                            {post?.author?.profileImageUrl && (
                                <SafeImage
                                    src={post?.author?.profileImageUrl}
                                    fill
                                    alt="Profile"
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <Link className="font-semibold text-[15px] text-text1 hover:underline" href={`/user/${post?.author?.username}`}>
                                {post?.author?.firstName} {post?.author?.lastName}
                            </Link>
                            <p className="text-text2 text-[13px]">{getExactDateAndTime(post?.createdAt)}</p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 text-text2">
                                <MoreHorizontal className="h-8" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-50 md:w-70 bg-bg-white1 text-text1 border-border">
                            {(loggedInUser?.id === post.author._id.toString() || loggedInUser?._id === post.author._id.toString()) ? (
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
                    <div className="w-full flex justify-center">
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
                    <span>{loadedComments.length} comments</span>
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
                            onClick={() => {
                                const element = document.getElementById("post-comment-textarea");
                                if (element) element.focus();
                            }}
                        >
                            <MessageCircle size={22} strokeWidth="2.5px" />
                            <span>Comment</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-[90%] sm:w-[50%] lg:w-[40%] h-2 border-b-2 border-border mt-1"></div>

            {/* Comments Section */}
            <div className="w-[90%] sm:w-[50%] lg:w-[40%] mt-2 ml-7 mb-10">
                <div className="py-3">
                    <h4 className="text-sm font-semibold text-label">Comments</h4>
                    <div className="mt-4 space-y-4">
                        {loadedComments?.length > 0 ? (
                            loadedComments.map((comment) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    postId={post._id}
                                    loggedInUserId={loggedInUser?._id || loggedInUser?.id}
                                    postAuthorId={post.author._id}
                                    onDeleteSuccess={(deletedId) => {
                                        setLoadedComments((prev) => prev.filter(c => c._id !== deletedId));
                                    }}
                                    currentUserDetails={{
                                        firstName: loggedInUser?.firstName,
                                        lastName: loggedInUser?.lastName,
                                        profileImageUrl: loggedInUser?.profileImageUrl
                                    }}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-center text-label py-4">
                                No comments yet. Be the first!
                            </p>
                        )}
                    </div>
                </div>
            </div>


            {/* Sticky/Fixed Bottom Footer Comment Box */}
            <div className="w-[90%] sm:w-[50%] lg:w-[40%] fixed bottom-3 bg-bg-gray2 border border-border rounded-3xl p-4 z-30 flex justify-center">
                <div ref={scrollRef} />
                <div className="w-full flex gap-2 items-end">
                    <Textarea
                        id="post-comment-textarea"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-10 max-h-30 rounded-xl resize-none border-border bg-white"
                    />
                    <Button
                        size="icon"
                        onClick={handlePostComment}
                        disabled={!newComment.trim() || commentSubmitLoading}
                        className='h-10 w-10 bg-primary hover:bg-primary/90 cursor-pointer text-white flex items-center justify-center shrink-0'
                    >
                        <Send className="w-5 h-5 stroke-[2px]" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// 🟢 COMMENT ITEM SUB-COMPONENT (SAME AS VIEWPOSTDIALOG)
function CommentItem({ comment, postId, loggedInUserId, isReplyThread = false, postAuthorId, onDeleteSuccess, currentUserDetails, onChildReplyAdded }) {
    const [likes, setLikes] = useState(comment.likes || []);
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [repliesCount, setRepliesCount] = useState(comment.repliesCount || 0);
    const [isDeleting, setIsDeleting] = useState(false);

    const isLikedByMe = likes.includes(loggedInUserId);
    const canDelete = comment.author._id === loggedInUserId || postAuthorId === loggedInUserId;

    const handleLike = async () => {
        const res = await toggleCommentLike(comment._id);
        if (res.success) setLikes(res.likes);
    };

    const handleLoadReplies = async () => {
        if (showReplies) {
            setShowReplies(false);
            return;
        }
        const res = await getCommentReplies(comment._id);
        if (res.success) {
            setReplies(res.data);
            setShowReplies(true);
        }
    };

    const handlePostReply = async () => {
        const typedText = replyText.trim();
        if (!typedText) return;

        const targetParentId = isReplyThread ? comment.parentId : comment._id;
        const finalContent = isReplyThread
            ? `@${comment.author.firstName}${comment.author.lastName} ${typedText}`
            : typedText;

        const optimisticReplyId = `temp-${Date.now()}`;
        const optimisticReplyObj = {
            _id: optimisticReplyId,
            postId,
            parentId: targetParentId,
            content: finalContent,
            likes: [],
            repliesCount: 0,
            createdAt: new Date().toISOString(),
            author: {
                _id: loggedInUserId,
                firstName: currentUserDetails?.firstName || "Me",
                lastName: currentUserDetails?.lastName || "",
                profileImageUrl: currentUserDetails?.profileImageUrl || ""
            }
        };

        setReplyText("");
        setIsReplying(false);

        if (isReplyThread && onChildReplyAdded) {
            onChildReplyAdded(optimisticReplyObj, optimisticReplyId, targetParentId, finalContent);
        } else {
            setShowReplies(true);
            setReplies((prev) => [...prev, optimisticReplyObj]);
            setRepliesCount((prev) => prev + 1);

            const res = await addCommentReply(postId, targetParentId, finalContent);
            if (res.success) {
                setReplies((prev) => prev.map((r) => (r._id === optimisticReplyId ? res.data : r)));
            } else {
                toast.error(res.message || "Failed to send reply");
                setReplies((prev) => prev.filter((r) => r._id !== optimisticReplyId));
                setRepliesCount((prev) => Math.max(0, prev - 1));
            }
        }
    };

    const handleDeleteClick = async () => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            setIsDeleting(true);
            const res = await deleteComment(comment._id);
            if (res.success) {
                toast.success(res.message);
                if (onDeleteSuccess) onDeleteSuccess(comment._id);
            } else {
                toast.error(res.message);
                setIsDeleting(false);
            }
        }
    };

    const renderCommentContent = (content) => {
        if (content.startsWith("@")) {
            const parts = content.split(" ");
            const mention = parts[0];
            const restOfText = parts.slice(1).join(" ");
            return (
                <p className="text-sm mt-0.5 break-words">
                    <span className="text-primary font-semibold hover:underline cursor-pointer mr-1">{mention}</span>
                    {restOfText}
                </p>
            );
        }
        return <p className="text-sm mt-0.5 break-words">{content}</p>;
    };

    if (isDeleting) return null;

    return (
        <div className="flex flex-col gap-1 w-full text-text1 group">
            <div className="flex gap-2.5 items-start w-full relative">
                <Avatar className={`mt-1 relative ${isReplyThread ? "h-6 w-6" : "h-8 w-8"}`}>
                    <AvatarImage src={comment.author.profileImageUrl} className="object-cover" />
                    <AvatarFallback className="text-xs">{comment.author.firstName?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 flex flex-col items-start">
                    <div className="flex items-center gap-1.5 max-w-full group/bubble">
                        <div className="bg-bg-gray1 p-2 px-3 rounded-2xl inline-block">
                            <p className="text-xs font-bold text-text2">
                                {comment.author.firstName} {comment.author.lastName}
                            </p>
                            {renderCommentContent(comment.content)}
                        </div>

                        {canDelete && !comment._id.startsWith("temp-") && (
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="h-6 w-6 rounded-full cursor-pointer bg-bg-gray2 text-text2 flex justify-center items-center">
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="bg-white border-border text-text1">
                                        <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive font-medium focus:bg-destructive/10 cursor-pointer flex items-center gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-text2 mt-0.5 pl-1">
                        <button onClick={handleLike} className={`hover:underline cursor-pointer transition ${isLikedByMe ? "text-primary font-bold" : ""}`}>
                            {isLikedByMe ? "Liked" : "Like"} {likes.length > 0 && `(${likes.length})`}
                        </button>
                        <button onClick={() => setIsReplying(!isReplying)} className="hover:underline cursor-pointer">
                            Reply
                        </button>
                    </div>

                    {isReplying && (
                        <div className="flex gap-2 mt-2 w-[95%] items-end">
                            <Textarea
                                placeholder={`Reply to ${comment.author.firstName}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-8 max-h-20 text-xs rounded-xl bg-white border-border resize-none py-1"
                            />
                            <Button size="sm" onClick={handlePostReply} disabled={!replyText.trim()} className="h-8 px-3 bg-primary text-white text-xs rounded-xl cursor-pointer">
                                Reply
                            </Button>
                        </div>
                    )}

                    {!isReplyThread && repliesCount > 0 && (
                        <button onClick={handleLoadReplies} className="text-xs font-bold text-primary flex items-center gap-1 mt-1 hover:underline cursor-pointer">
                            <CornerDownRight className="w-3.5 h-3.5" />
                            {showReplies ? "Hide replies" : `View ${repliesCount} replies`}
                        </button>
                    )}

                    {showReplies && replies.length > 0 && !isReplyThread && (
                        <div className="space-y-3 mt-2 border-l-2 border-border/60 pl-3 w-full transition-all">
                            {replies.map((reply) => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    postId={postId}
                                    loggedInUserId={loggedInUserId}
                                    isReplyThread={true}
                                    postAuthorId={postAuthorId}
                                    currentUserDetails={currentUserDetails}
                                    onDeleteSuccess={(deletedId) => {
                                        setReplies((prev) => prev.filter(r => r._id !== deletedId));
                                        setRepliesCount((prev) => Math.max(0, prev - 1));
                                    }}
                                    onChildReplyAdded={async (optimisticObj, tempId, parentId, finalContent) => {
                                        setReplies((prev) => [...prev, optimisticObj]);
                                        setRepliesCount((prev) => prev + 1);
                                        const res = await addCommentReply(postId, parentId, finalContent);
                                        if (res.success) {
                                            setReplies((prev) => prev.map((r) => (r._id === tempId ? res.data : r)));
                                        } else {
                                            toast.error(res.message || "Failed to send reply");
                                            setReplies((prev) => prev.filter((r) => r._id !== tempId));
                                            setRepliesCount((prev) => Math.max(0, prev - 1));
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}