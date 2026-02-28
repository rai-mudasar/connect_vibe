import { UserPlus2 } from "lucide-react";
import Image from "next/image";
import SafeImage from "../SafeImage";

export default function UserCard({user}) {
  return (
    <div className="w-30 md:w-40 h-49 md:h-65 ml-3 mt-3 md:mt-0 rounded-lg shadow-xl border border-neutral-300 overflow-hidden">
      <div className="w-full h-[60%] relative">
        <SafeImage
          src={user.profileImageUrl}
          fill={true}
          alt="Suggested Users Profile Images"
        />
      </div>
      <div className="w-full h-[40%] bg-white relative">
        <h1 className="h-6 text-[15px] md:text-[17px] text-black font-bold mt-2 ml-2 truncate overflow-y-hidden">{user.name}</h1>
        <button className="w-24 md:w-30 h-8 md:h-10 bg-blue-200 rounded-lg absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 md:gap-2">
          <UserPlus2
            className="text-[#2296D5]"
            fill="#2296D5"
            size={24}
          />
          <p className="text-[12px] md:text-sm text-[#2296D5] font-semibold">Add friend</p>
        </button>
      </div>
    </div>
  );
}
