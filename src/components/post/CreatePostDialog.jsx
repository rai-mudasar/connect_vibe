"use client";

import axios from "axios";
import SafeImage from "../SafeImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageCropper from "@/components/ImageCropper";

export default function CreatePostDialog({ loggedInUser }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (rawImageSrc) URL.revokeObjectURL(rawImageSrc);
    setRawImageSrc(URL.createObjectURL(file));
    setShowCropper(true);
    e.target.value = "";
  };

  const handleCropDone = (blob) => {
    setImage(blob);
    setShowCropper(false);
    if (rawImageSrc) URL.revokeObjectURL(rawImageSrc);
    setRawImageSrc(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    if (rawImageSrc) URL.revokeObjectURL(rawImageSrc);
    setRawImageSrc(null);
  };

  const handlePost = async () => {
    if (!image && !text) return alert("Please add some content or an image");

    const formData = new FormData();
    if (image) formData.append("image", image, "post.jpg"); // blob uploads fine
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

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setText("");
      setImage(null);
      setShowCropper(false);
      if (rawImageSrc) URL.revokeObjectURL(rawImageSrc);
      setRawImageSrc(null);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow-sm cursor-pointer z-20">
        <Avatar className="w-10 h-10 bg-neutral-300 z-50 border font-semibold">
          <SafeImage
            src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
            fill
            alt="LoggedIn User Image"
            className="object-contain"
          />
          <AvatarFallback className="bg-neutral-300">
            {loggedInUser?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="bg-gray-100 rounded-full py-2 px-4 flex-1 text-gray-500 text-sm">
          What's on your mind, {loggedInUser?.firstName} {loggedInUser?.lastName}?
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 p-4 bg-card border border-border rounded-lg shadow-sm cursor-pointer mt-2 md:mt-0 z-30">
          <Avatar className="w-10 h-10 border border-border bg-bg z-50 font-semibold">
            <SafeImage
              src={loggedInUser?.profileImageUrl}
              fill
              alt="LoggedIn User Image"
              className="object-contain"
            />
            <AvatarFallback className="text-[22px] text-primary">
              {loggedInUser?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="bg-gray-100 rounded-full py-2 px-4 flex-1 text-gray-500 text-sm">
            What's on your mind, {loggedInUser?.firstName} {loggedInUser?.lastName}?
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 max-h-full bg-bg border-border text-secondary p-0 gap-0 overflow-y-scroll hide-scrollbar">
        <DialogHeader className="p-4 bg-card border-b border-border">
          <DialogTitle className="text-center">
            {showCropper ? "Crop image" : "Create post"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-4">

          {/* ── Cropper view ── */}
          {showCropper ? (
            <ImageCropper
              aspect={4 / 5}
              aspectLabel="4:5"
              onCrop={handleCropDone}
              onCancel={handleCropCancel}
            />
          ) : (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 text-secondary">
                <Avatar className="h-10 w-10 border border-border bg-card ">
                  <AvatarImage src={loggedInUser?.profileImageUrl} />
                  <AvatarFallback className={'text-primary'}>{loggedInUser?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">
                  {loggedInUser?.firstName} {loggedInUser?.lastName}
                </span>
              </div>

              {/* Post text */}
              <Textarea
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border-none focus-visible:ring-0 placeholder:text-label text-lg resize-none min-h-30 p-0"
              />

              {/* Cropped image preview */}
              {image && (
                <div className="relative rounded-lg overflow-hidden border border-boder">
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

              {/* Add to post toolbar */}
              <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
                <span className="text-sm font-semibold">Add photo to your post</span>
                <div className="flex gap-1">
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-primary cursor-pointer border"
                    onClick={() => setShowCropper(true)}
                  >
                    <ImagePlus className="h-9 cursor-pointer" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handlePost}
                disabled={loading || (!text && !image)}
                className="w-full bg-primary hover:bg-bg text-secondary hover:text-primary font-bold h-10"
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
