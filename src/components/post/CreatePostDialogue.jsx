"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SafeImage from "../SafeImage";

export default function CreatePostDialog({ loggedInUser }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePost = async () => {
    if (!image && !text) return alert("Please add some content or an image");

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("text", text);

    setLoading(true);

    try {
      const response = await axios.post("/api/post/create", formData);
      if (response.data.success) {
        setIsDialogOpen(false);
        setText("");
        setImage(null);
        toast.success("Post Created Successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Axios Error : ", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50">
        <Avatar className="w-8 h-8 bg-neutral-300 z-50 border font-semibold">
          <SafeImage
            src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
            fill
            alt="LoggedIn User Image"
            className="object-contain"
          />
          <AvatarFallback className=" bg-neutral-300">{loggedInUser?.firstName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="bg-gray-100 rounded-full py-2 px-4 flex-1 text-gray-500 text-sm">
          What's on your mind, {loggedInUser?.firstName}{" "}
          {loggedInUser?.lastName} ?
        </div>
      </div>
    );
  } else if (isMounted) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50">
            <Avatar className="w-8 h-8 bg-neutral-300 z-50 border font-semibold">
              <SafeImage
                src={loggedInUser?.profileImageUrl}
                fill
                alt="LoggedIn User Image"
                className="object-contain"
              />
              <AvatarFallback>{loggedInUser?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-full py-2 px-4 flex-1 text-gray-500 text-sm">
              What's on your mind, {loggedInUser?.firstName}{" "}
              {loggedInUser?.lastName}?
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-125 max-h-full bg-white p-0 gap-0 overflow-y-scroll hide-scrollbar">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-center">Create post</DialogTitle>
          </DialogHeader>

          <div className="p-4 flex flex-col gap-4">
            {/* User Info Header */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={loggedInUser?.profileImageUrl} />
                <AvatarFallback>{loggedInUser?.firstName?.[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">
                {loggedInUser?.firstName} {loggedInUser?.lastName}
              </span>
            </div>

            {/* Post Text Area */}
            <Textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border-none focus-visible:ring-0 text-lg resize-none min-h-30 p-0"
            />

            {/* Image Preview Area */}
            {image && (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={URL.createObjectURL(image)}
                  className="w-full max-h-75 object-contain bg-black/5"
                  alt="preview"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-md"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Add to Post Toolbar */}
            <div className="flex items-center justify-between border rounded-lg p-3">
              <span className="text-sm font-semibold">Add to your post</span>
              <div className="flex gap-1">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-500 hover:bg-green-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handlePost}
              disabled={loading || (!text && !image)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10"
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
