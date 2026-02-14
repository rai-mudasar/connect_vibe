import { UserPlus2 } from "lucide-react";
import Image from "next/image";

export default function UserCard({user}) {
  return (
    <div className="w-40 h-65 ml-3 rounded-lg shadow-xl border border-neutral-300 overflow-hidden">
      <div className="w-full h-[60%] relative">
        <Image
          src={user.profileImageUrl}
          fill={true}
          alt="Suggested Users Profile Images"
        />
      </div>
      <div className="w-full h-[40%] bg-white relative">
        <h1 className="text-black font-bold mt-2 ml-2">{user.name}</h1>
        <button className=" w-30 h-10 bg-blue-200 rounded-lg absolute bottom-3 left-3 flex justify-center items-center gap-2">
          <UserPlus2
            className="text-blue-300"
            fill="#2296D5"
            size={24}
            strokeWidth="2px"
          />
          <p className="text-[#2296D5] font-semibold">Add friend</p>
        </button>
      </div>
    </div>
  );
}
