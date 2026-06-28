"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRef } from "react";
import { toast } from "sonner";
import SafeImage from "../SafeImage";
import EditProfileDialog from "./EditProfileDialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Camera, ImageUp, Trash2 } from "lucide-react";
import { deleteCoverImage, updateCoverImage, updateProfileImage } from "@/actions/userActions";

export default function ProfileHeader({ currentProfileUser, isOwnProfile }) {
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleCoverInputRef = () => coverInputRef.current?.click();
  const handleProfileInputRef = () => profileInputRef.current?.click();

  const handleUpdateCoverImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return toast.error("Please select a file");
    const response = await updateCoverImage(file, currentProfileUser.username);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleUpdateProfileImage = async (e) => {
    const file = e.target.files?.[0];

    const response = await updateProfileImage(file, currentProfileUser?.username);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleRemoveCoverImage = async (imageUrl) => {
    if (imageUrl) {
      const response = await deleteCoverImage(imageUrl, currentProfileUser._id)
      if (response.success) {
        currentProfileUser.coverImageUrl = "";
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }

    }
  };

  return (
    <div className="w-[95%] md:w-[70%]">
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
      <section className="w-full h-50 md:h-90 relative rounded-b-3xl object-cover overflow-hidden bg-bg-gray2 border border-border flex justify-center items-center">
        {(!currentProfileUser?.coverImageUrl || currentProfileUser?.coverImageUrl === "") && <p className="font-semibold lg:text-5xl text-text1">{isOwnProfile ? 'Upload a cover Image' : 'No Cover Image!'}</p>}
        {currentProfileUser?.coverImageUrl !== "" &&
          <SafeImage
            src={currentProfileUser?.coverImageUrl !== "" ? currentProfileUser?.coverImageUrl : null}
            fill
            alt="User cover Image"
            className="object-contain"
          />
        }
        {isOwnProfile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="absolute bottom-5 right-5 bg-bg-gray1 border border-border text-text1 font-semibold bg-bg px-4 py-2 rounded-[10px] flex justify-center items-center gap-2 cursor-pointer">
                <Camera
                  className="w-8 h-8 text-bg-gray1"
                  fill=""
                />
                <p className="hidden md:block">Edit cover photo</p>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={"bg-bg-white1 text-text1 border-border mr-8 md:mr-0"}>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleCoverInputRef}
                  className={"cursor-pointer"}
                >
                  <ImageUp size={18} />
                  <span>Upload Photo</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRemoveCoverImage(currentProfileUser?.coverImageUrl)}
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
      <section className="flex flex-col md:flex-row items-center md:items-start pl-3 md:px-17 -mt-5 md:my-6 relative">
        <div className="w-full flex items-center">
          <div className="relative">
            <Avatar className="w-26 md:w-40 h-26 md:h-40 bg-bg-gray1 border-2 border-bg-white1">
              <SafeImage
                src={currentProfileUser?.profileImageUrl !== "" ? currentProfileUser?.profileImageUrl : null}
                fill
                alt="User Profile Image"
                className="object-contain"
              />
              <AvatarFallback className={'text-3xl lg:text-7xl text-text1 font-bold'}>{currentProfileUser?.firstName?.[0] + currentProfileUser?.lastName?.[0]}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div
                className="w-7 md:w-9 h-7 md:h-9 bg-bg-gray1 rounded-full absolute bottom-4 right-0 flex justify-center items-center cursor-pointer"
                onClick={handleProfileInputRef}
              >
                <Camera
                  className="text-bg-gray1 w-6 md:w-7 h-6 md:h-7"
                  fill=''
                />
              </div>
            )}
          </div>

          <div className="flex flex-col ml-3 md:ml-5 mt-9 md:mt-0 md:gap-1">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                {currentProfileUser?.firstName} {currentProfileUser?.lastName}
              </h2>
            </div>
            <div className="text-[12px] md:text-lg font-semibold italic ml-1 md:ml-0 text-label">
              <p>"{currentProfileUser?.bio}"</p>
            </div>
          </div>
        </div>

        <div className="">
          {isOwnProfile && <EditProfileDialog currentProfileUser={currentProfileUser} />}
        </div>
      </section>
    </div>
  );
}