"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import SafeImage from "../SafeImage";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addNewComment, getPostAllcomments } from "@/actions/postActions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ViewPostDialog({ post }) {
  const [newComment, setNewComment] = useState("");
  const [loadedComments, setLoadedComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadedComments]);

  const handleDialogState = (open) => {
    if (open) handleLoadComments()
  }

  const handleLoadComments = async () => {
    try {
      const response = await getPostAllcomments(post._id);

      if (response.success) {
        console.log("Response comnts area : ", response.data);
        setLoadedComments(response.data);
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
        setLoadedComments((prev) => prev ? [...prev, response.data] : null)
        toast.success(response.message);
      } else {
        toast.error(response.message);
        // console.log("Error : ", response.message);
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
        <Button
          className="w-full flex items-center justify-center mt-0.5 p-2 bg-card hover:bg-primary border border-border rounded-lg text-[16px] text-label font-medium cursor-pointer"
        >
          <MessageCircle size={22} strokeWidth="2.5px" />
          <span>Comment</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-70px)] flex flex-col p-0 gap-0 bg-bg border-border text-secondary overflow-hidden">
        <DialogHeader className="p-4 bg-card border-b border-border">
          <DialogTitle>Post by <span className="text-primary">{`${post.author.firstName} ${post.author.lastName}`}</span> </DialogTitle>
          <DialogDescription className="sr-only">
            This dialog shows the full content of the post and its comments.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4 overflow-y-scroll hide-scrollbar">
            {/* 1. THE ORIGINAL POST */}
            <div className="mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3 mb-2 relative">
                <Avatar className="h-10 w-10">
                  <SafeImage
                    src={post.author.profileImageUrl !== "" ? post.author.profileImageUrl : null}
                    fill
                    alt="User Profile Image"
                    className="object-contain"
                  />
                  <AvatarFallback>{post.author.firstName[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">
                  {post.author.firstName} {post.author.lastName}
                </span>
              </div>
              <p className="text-sm text-secondary mb-3">{post.caption}</p>
              <div className="w-full bg-label flex justify-center">
                <div className="w-full h-120 relative border-t">
                  {post.media && (
                    <SafeImage
                      src={post.media}
                      fill
                      alt="Post"
                      className="object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 2. THE COMMENTS LIST */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-label">Comments</h4>
              {loadedComments?.length > 0 ? (
                loadedComments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={comment.author.profileImageUrl} />
                      <AvatarFallback>
                        {comment.author.firstName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-label p-2 px-3 rounded-tr-xl rounded-bl-xl max-w-[85%]">
                      <p className="text-sm font-bold text-card">
                        {comment.author.firstName} {comment.author.lastName}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-label py-4">
                  No comments yet. Be the first!
                </p>
              )}
            </div>
            <div ref={scrollRef} />
          </ScrollArea>
        </div>

        {/* 3. INPUT AREA AT BOTTOM */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-10 max-h-30 rounded-xl resize-none focus-visible:ring-[1px] md:focus-visible:ring-[2px] border-border"
            />
            <Button
              size="icon"
              onClick={handlePostComment}
              disabled={!newComment.trim() || loading}
              className={'h-10 bg-card hover:bg-card cursor-pointer'}
            >
              <Send className="w-10 text-primary" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
