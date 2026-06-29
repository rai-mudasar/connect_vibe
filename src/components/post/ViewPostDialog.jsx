"use client";

import SafeImage from "../SafeImage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, CornerDownRight, Trash2, MoreHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addNewComment, getPostAllcomments, toggleCommentLike, addCommentReply, getCommentReplies, deleteComment } from "@/actions/postActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function ViewPostDialog({ post, loggedInUser }) {
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadedComments, setLoadedComments] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadedComments]);

  const handleDialogState = (open) => {
    if (open) handleLoadComments();
  };

  const handleLoadComments = async () => {
    try {
      const response = await getPostAllcomments(post._id);
      if (response.success) {
        const mainComments = response.data.filter(c => !c.parentId);
        setLoadedComments(mainComments);
      }
    } catch (error) {
      toast.error(error.message || "Loading comments error");
    }
  };

  const handlePostComment = async () => {
    setLoading(true);
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
      console.log("Error : ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleDialogState}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center mt-0.5 p-2 bg-card hover:bg-bg-gray-hover border border-border rounded-lg text-[16px] text-label font-medium cursor-pointer">
          <MessageCircle size={22} strokeWidth="2.5px" />
          <span>Comment</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 max-h-[calc(100vh-20px)] flex flex-col p-0 gap-0 bg-bg-white1 border-border text-text1 overflow-hidden">
        <DialogHeader className="p-4 bg-card border-b border-border">
          <DialogTitle>Post by <span className="text-primary font-semibold">{`${post?.author?.firstName} ${post?.author?.lastName}`}</span> </DialogTitle>
          <DialogDescription className="sr-only">Post details and interaction drawer</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4 overflow-y-scroll hide-scrollbar">
            {/* 1. ORIGINAL POST INTERFACE */}
            <div className="mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3 mb-2 relative">
                <Avatar className="h-10 w-10">
                  <SafeImage src={post?.author?.profileImageUrl || null} fill alt="Profile" className="object-cover rounded-full" />
                  <AvatarFallback>{post?.author?.firstName[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">{post?.author?.firstName} {post?.author?.lastName}</span>
              </div>
              <p className="text-sm text-text1 mb-3">{post?.caption}</p>
              {post?.media && (
                <div className="w-full bg-bg-gray1 flex justify-center">
                  <div className="w-full aspect-4/5 relative border-t">
                    <SafeImage src={post?.media} fill alt="Post Media" className="object-contain" />
                  </div>
                </div>
              )}
            </div>

            {/* 2. COMMENTS & REPLIES REALM */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text2">Comments</h4>
              {loadedComments?.length > 0 ? (
                loadedComments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    loggedInUserId={loggedInUser?._id}
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
                <p className="text-sm text-center text-text2 py-4">No comments yet.</p>
              )}
            </div>
            <div ref={scrollRef} />
          </ScrollArea>
        </div>

        {/* 3. FOOTER MAIN COMMENT BOX */}
        <div className="p-4 border-t border-border bg-bg-gray1 z-30">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-10 max-h-30 rounded-xl resize-none border-border bg-white"
            />
            <Button size="icon" onClick={handlePostComment} disabled={!newComment.trim() || loading} className='h-10 bg-primary hover:bg-primary/90 cursor-pointer text-white'>
              <Send className="w-5 h-5 stroke-[2px]" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 🟢 FIX SYSTEM: BALANCED DOM TREE HOOK FOR CLEAN RENDERING
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

    // 🌟 LEVEL-2 CASCADE TRICK:
    // If inside sub-thread thread list trigger the high-order state bubble function
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
        <Avatar className={`mt-1 ${isReplyThread ? "h-6 w-6" : "h-8 w-8"}`}>
          <AvatarImage src={comment.author.profileImageUrl} className="object-cover" />
          <AvatarFallback className="text-xs">{comment.author.firstName?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 flex flex-col items-start">
          {/* Bubble wrapper splits dropdown action out cleanly */}
          <div className="flex items-center gap-1.5 max-w-full group/bubble">
            <div className="bg-bg-gray1 p-2 px-3 rounded-2xl inline-block">
              <p className="text-xs font-bold text-text2">
                {comment.author.firstName} {comment.author.lastName}
              </p>
              {renderCommentContent(comment.content)}
            </div>

            {/* Three dots menu now aligned out of the text bubble */}
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

          {/* Action Row Links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-text2 mt-0.5 pl-1">
            <button onClick={handleLike} className={`hover:underline cursor-pointer transition ${isLikedByMe ? "text-primary font-bold" : ""}`}>
              {isLikedByMe ? "Liked" : "Like"} {likes.length > 0 && `(${likes.length})`}
            </button>
            <button onClick={() => setIsReplying(!isReplying)} className="hover:underline cursor-pointer">
              Reply
            </button>
          </div>

          {/* Inline Reply Input Box */}
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

          {/* View Thread Trigger Button (Main Layer Only) */}
          {!isReplyThread && repliesCount > 0 && (
            <button onClick={handleLoadReplies} className="text-xs font-bold text-primary flex items-center gap-1 mt-1 hover:underline cursor-pointer">
              <CornerDownRight className="w-3.5 h-3.5" />
              {showReplies ? "Hide replies" : `View ${repliesCount} replies`}
            </button>
          )}

          {/* THE SUB-CHANNELS CONTAINER LOOP RENDERING */}
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
                  // Dynamic nested handler to pass level-2 feedback to level-1 tracker list array
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