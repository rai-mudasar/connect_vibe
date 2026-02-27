"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { addComment, getPostAllcomments } from "@/actions/postActions";
import { toast } from "sonner";
import SafeImage from "../SafeImage";

export function ViewPost({ post }) {
  const [newComment, setNewComment] = useState("");
  const [loadedComments, setLoadedComments] = useState(null);

  const [loading, setLoading] = useState(false);

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
      const response = await addComment(post._id, newComment);
      if (response.success) {
        setNewComment("");
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
    <Dialog onOpenChange={handleLoadComments}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex-1 flex items-center justify-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium cursor-pointer"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Comment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-70px)] flex flex-col p-0 gap-0 bg-white overflow-y-scroll">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Post by {post.author.firstName}</DialogTitle>
          <DialogDescription className="sr-only">
            This dialog shows the full content of the post and its comments.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4 overflow-y-scroll hide-scrollbar">
            {/* 1. THE ORIGINAL POST */}
            <div className="mb-6 pb-4 border-b">
              <div className="flex items-center gap-3 mb-2 relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.profileImageUrl} />
                  <AvatarFallback>{post.author.firstName[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">
                  {post.author.firstName} {post.author.lastName}
                </span>
              </div>
              <p className="text-sm text-gray-800 mb-3">{post.caption}</p>
              <div className="w-full bg-gray-100 flex justify-center">
                <div className="w-full h-120 relative">
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
              <h4 className="text-sm font-semibold text-gray-500">Comments</h4>
              {loadedComments?.length > 0 ? (
                loadedComments.map((comment, id) => (
                  <div key={id} className="flex gap-3">
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
          </ScrollArea>
        </div>

        {/* 3. INPUT AREA AT BOTTOM */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-10 max-h-30 rounded-xl resize-none"
            />
            <Button
              size="icon"
              onClick={handlePostComment}
              disabled={!newComment.trim() || loading}
              // className="rounded-full shrink-0"
            >
              <Send size={28} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
