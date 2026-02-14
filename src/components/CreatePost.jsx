"use client";

import { Smile, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const CreatePost = ({className}) => {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    setUsername(session.user?.username);
    setProfileImage(session.user?.profileImageUrl);
  }, [status]);

  return (
    <div className= {`bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-5 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
          {profileImage && (
            <Image
              src={profileImage}
              width={33}
              height={33}
              alt="User Profile Image"
            />
          )}
        </div>

        {/* Use Link here to trigger the intercepting route */}
        <Link
          href="/post/create"
          className="w-[90%] h-10 rounded-full bg-neutral-100 flex items-center pl-5 text-neutral-600 cursor-pointer hover:bg-neutral-200 transition-colors"
        >
          <p>
            What's on your mind,{" "}
            <span className="font-semibold">{username}</span> ?
          </p>
        </Link>
      </div>

      <div className="flex border-t border-gray-100 pt-3">
        <button className="flex-1 flex items-center justify-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-green-500 font-medium">
          <Video size={24} /> <span>Photo/video</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-yellow-500 font-medium">
          <Smile size={24} /> <span>Feeling/activity</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
