"use client";

import CreatePost from "@/components/CreatePost";
import UserCard from "@/components/UserCard";
import { Camera, Pen, Pencil, Plus, UserPlus2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const suggestedUsers = [
    {
      id: 1,
      name: "Alex Johnson",
      profileImageUrl: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Sarah Williams",
      profileImageUrl: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Michael Chen",
      profileImageUrl: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Emma Davis",
      profileImageUrl: "https://i.pravatar.cc/150?u=4",
    },
    {
      id: 5,
      name: "Marcus Rodriguez",
      profileImageUrl: "https://i.pravatar.cc/150?u=5",
    },
    {
      id: 6,
      name: "Chloe Smith",
      profileImageUrl: "https://i.pravatar.cc/150?u=6",
    },
    {
      id: 7,
      name: "Jordan Lee",
      profileImageUrl: "https://i.pravatar.cc/150?u=7",
    },
    {
      id: 8,
      name: "Sophia Taylor",
      profileImageUrl: "https://i.pravatar.cc/150?u=8",
    },
    {
      id: 9,
      name: "Daniel Kim",
      profileImageUrl: "https://i.pravatar.cc/150?u=9",
    },
    {
      id: 10,
      name: "Olivia Brown",
      profileImageUrl: "https://i.pravatar.cc/150?u=10",
    },
  ];

  useEffect(() => {
    if (status === "loading") return;
    setProfileImageUrl(session.user.profileImageUrl);
  }, [status]);
  return (
    <div>
      <div className="w-full flex flex-col items-center pt-13 bg-white">
        <section className="w-[70%] h-90 relative rounded-b-3xl object-cover overflow-hidden">
          <Image
            fill={true}
            src={"/images/cover-image.png"}
            alt="User Cover Photo"
          />
          <div className="absolute bottom-5 right-5 border-2 text-black font-semibold bg-[#F2F2F2] px-4 py-2 rounded-[10px] flex gap-2 cursor-pointer">
            <Camera
              className="text-[#F2F2F2]"
              fill="blck"
              size={28}
              strokeWidth="1px"
            />
            <Link href={"/editProfile"}>Edit cover photo</Link>
          </div>
        </section>

        {/* Profile Section */}
        <section className="w-[70%] h-51 flex flex-row items-center px-17 relative">
          <div className="w-40 h-40 rounded-full relative ">
            {profileImageUrl && (
              <Image
                src={profileImageUrl}
                fill={true}
                alt="User Profile Image"
              />
            )}
            <div className="w-9 h-9 bg-[#D6D9DD] rounded-full absolute bottom-4 right-0 flex justify-center items-center cursor-pointer">
              <Camera
                className="text-[#D6D9DD]"
                fill="blck"
                size={28}
                strokeWidth="1px"
              />
            </div>
          </div>

          <div className="flex flex-col ml-5 gap-4">
            <div>
              <h2 className="text-2xl font-bold">User Name</h2>
            </div>
            <div className="text-xl font-semibold">
              <p>Users bio should be present here</p>
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
            <Link
              href={""}
              className="flex gap-1 bg-[#F2F2F2] text-[15px] font-semibold text-black py-2 px-3 rounded-[10px] "
            >
              <Pencil
                className="text-white"
                fill="black"
                size={24}
                strokeWidth={"1px"}
              />
              <p>Edit Profile</p>
            </Link>
          </div>
        </section>

        <section className="w-[70%] h-80 border border-gray-300 rounded-md">
          <div className="flex justify-between mx-5 font-semibold text-lg">
            <p>People You May Know</p>
            <Link href={""} className="text-[#0f81ec]">
              See more
            </Link>
          </div>

          <div className="flex flex-row grow mt-3 overflow-x-scroll hide-scrollbar">
            {suggestedUsers.map((user) => (
              <div key={user.id}>
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="w-full bg-[#F2F4F7] flex justify-center">
        <section className="w-[70%] h-80 flex flex-row gap-3 bg-[#F2F4F7] mt-4">
          <div className="w-[35%] h-80">
            {/* TODO:Personal Record here</div> */}
          </div>
          <div className=" w-[65%] flex flex-col">
            <CreatePost />
            <div></div>
          </div>
        </section>
      </div>
    </div>
  );
}
