"use client";

import { Camera, ImageUp, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { updateCoverImage, updateProfileImage } from "@/actions/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import EditProfileDialog from "./EditProfileDialog";
import SafeImage from "../SafeImage";

export default function ProfileHeader({ user, isOwnProfile }) {
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const { update } = useSession();

  const handleCoverInputRef = () => coverInputRef.current?.click();
  const handleProfileInputRef = () => profileInputRef.current?.click();

  const handleUpdateCoverImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return toast.error("Please select a file");
    const response = await updateCoverImage(file, user.username);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleUpdateProfileImage = async (e) => {
    const file = e.target.files?.[0];

    const response = await updateProfileImage(file, user.username);

    if (response.success) {
      await update({ profileImageUrl: response.newProfileImageUrl });
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleRemoveCoverImage = () => {};
  return (
    <div className="w-[70%]">
      <input
        type="file"
        hidden
        accept="image/*"
        ref={coverInputRef}
        onChange={handleUpdateCoverImage}
      />
      <input
        type="file"
        hidden
        accept="image/*"
        ref={profileInputRef}
        onChange={handleUpdateProfileImage}
      />
      <section className="h-90 relative rounded-b-3xl object-cover overflow-hidden">
        <Image fill={true} src={user.coverImageUrl} alt="User Cover Photo" />
        {isOwnProfile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="absolute bottom-5 right-5 border-2 text-black font-semibold bg-[#F2F2F2] px-4 py-2 rounded-[10px] flex gap-2 cursor-pointer">
                <Camera
                  className="text-[#F2F2F2]"
                  fill="blck"
                  size={28}
                  strokeWidth="1px"
                />
                <p>Edit cover photo</p>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={"bg-white"}>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleCoverInputRef}
                  className={"cursor-pointer"}
                >
                  <ImageUp size={18} />
                  <span>Upload Photo</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleRemoveCoverImage}
                  className={"cursor-pointer"}
                >
                  <Trash2 size={18} />
                  <span>Remove Photo</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </section>

      {/* Profile Section */}
      <section className="h-51 flex flex-row items-center px-17 relative">
        <div className=" relative">
          {user.profileImageUrl && (
            <Avatar className="h-40 w-40">
              <SafeImage
                src={user?.profileImageUrl}
                fill
                alt="Post Image"
                className="object-contain"
              />
              <AvatarFallback>{user?.userame?.[0]}</AvatarFallback>
            </Avatar>
          )}
          {isOwnProfile && (
            <div
              className="w-9 h-9 bg-[#D6D9DD] rounded-full absolute bottom-4 right-0 flex justify-center items-center cursor-pointer"
              onClick={handleProfileInputRef}
            >
              <Camera
                className="text-[#D6D9DD]"
                fill="blck"
                size={28}
                strokeWidth="1px"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col ml-5 gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
          </div>
          <div className="text-xl font-semibold">
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="absolute right-7 top-10 flex gap-3 ">
          <Link
            href={""}
            className="flex gap-1 bg-[#0861F2] text-[15px] font-semibold text-white py-2 px-3 rounded-[10px] "
          >
            <Plus />
            <p>Add to post</p>
          </Link>
          {isOwnProfile && <EditProfileDialog user={user} />}
        </div>
      </section>
    </div>
  );
}
