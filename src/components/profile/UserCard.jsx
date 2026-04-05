import { UserCheck, UserMinus, UserPlus, X } from "lucide-react";
import SafeImage from "../SafeImage";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";

export default function UserCard({ user, type, onAction }) {
  const currentButton = [
    { id: "friends", label: "Remove Friend", icon: <UserMinus size={20} /> },
    { id: "nearby", label: "Add Friend", icon: <UserPlus size={20} /> },
    { id: "pending", label: "Accept Request", icon: <UserCheck size={20} /> },
    { id: "sent", label: "Cancel Request", icon: <X size={20} /> },
  ].find((btn) => btn.id === type);

  if (!currentButton) return null;

  return (
    <div className="w-30 md:w-40 h-49 md:h-65 rounded-lg shadow-xl border border-neutral-300 overflow-hidden">
      <div className="w-full h-[60%] relative">
        <Avatar className="w-full h-full bg-neutral-300 rounded-none">
          <SafeImage
            src={user.profileImageUrl !== "" ? user.profileImageUrl : null}
            fill={true}
            alt={`${user.firstName}'s profile`}
            className="object-cover"
          />
          <AvatarFallback className={'text-6xl md:text-8xl font-semibold'}>{user?.firstName?.[0]}</AvatarFallback>
        </Avatar>
      </div>

      <div className="w-full h-[40%] bg-white p-2 flex flex-col justify-between">
        <Link href={`/user/${user.username}`}>
          <h1 className="text-[15px] md:text-[17px] text-black font-bold truncate hover:underline">
            {`${user.firstName} ${user.lastName}`}
          </h1>
        </Link>

        <button
          onClick={() => onAction(user._id, type)}
          className="w-full h-8 md:h-10 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg flex justify-center items-center gap-1 md:gap-2"
        >
          <span className="text-[#2296D5]">{currentButton.icon}</span>
          <p className="text-[12px] md:text-sm text-[#2296D5] font-semibold cursor-pointer">
            {currentButton.label}
          </p>
        </button>
      </div>
    </div>
  );
}
