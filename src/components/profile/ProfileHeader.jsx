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
import { useSession } from "next-auth/react";
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
      <section className="h-50 md:h-90 relative rounded-b-3xl object-cover overflow-hidden bg-neutral-200 border border-neutral-300 flex justify-center items-center">
        {(!currentProfileUser?.coverImageUrl || currentProfileUser?.coverImageUrl === "") && <p className="font-semibold lg:text-5xl">Upload a cover Image</p>}
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
              <div className="absolute bottom-5 right-5 border-2 text-black font-semibold bg-[#F2F2F2] px-4 py-2 rounded-[10px] flex gap-2 cursor-pointer">
                <Camera
                  className="text-[#F2F2F2]"
                  fill="black"
                  size={28}
                  strokeWidth="1px"
                />
                <p className="hidden md:block">Edit cover photo</p>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={"bg-white mr-8 md:mr-0"}>
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
      <section className="h-51 md:h-51 flex flex-row items-start md:items-center pl-3 md:px-17 -mt-5 md:mt-0 relative">
        <div className=" relative">
          <Avatar className="w-26 md:w-40 h-26 md:h-40 border-3 md:border-0 border-white bg-neutral-300">
            <SafeImage
              src={currentProfileUser?.profileImageUrl !== "" ? currentProfileUser?.profileImageUrl : null}
              fill
              alt="User Profile Image"
              className="object-contain"
            />
            <AvatarFallback className={'text-4xl font-bold'}>{currentProfileUser?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          {isOwnProfile && (
            <div
              className="w-7 md:w-9 h-7 md:h-9 bg-[#D6D9DD] rounded-full absolute bottom-4 right-0 flex justify-center items-center cursor-pointer"
              onClick={handleProfileInputRef}
            >
              <Camera
                className="text-[#D6D9DD] w-6 md:w-7 h-6 md:h-7"
                fill="black"
                strokeWidth="1px"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col ml-3 md:ml-5 mt-9 md:mt-0 md:gap-1">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              {currentProfileUser?.firstName} {currentProfileUser?.lastName}
            </h2>
          </div>
          <div className="text-[12px] md:text-lg font-semibold ml-1 md:ml-0 text-gray-500">
            <p>{currentProfileUser?.bio}</p>
          </div>
        </div>

        <div className="absolute top-30 md:top-7 right-32 md:right-12 flex gap-4 md:gap-6">
          {/* <Link
            href={""}
            className="w-39 flex gap-2 md:gap-1 bg-[#0861F2] text-[15px] font-semibold text-white px-5 py-2.5 rounded-[10px] "
          >
            <Plus className="w-6 h-6" />
            <p>Add to post</p>
          </Link> */}
          {isOwnProfile && <EditProfileDialog currentProfileUser={currentProfileUser} />}
        </div>
      </section>
    </div>
  );
}