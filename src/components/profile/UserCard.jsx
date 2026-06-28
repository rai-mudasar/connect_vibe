import { UserCheck, UserMinus, UserPlus, X } from "lucide-react";
import SafeImage from "../SafeImage";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";

export default function UserCard({ user, type, onAction, className }) {
  const currentButton = [
    { id: "friends", label: "Remove Friend", icon: <UserMinus className="w-4 md:w-5" /> },
    { id: "nearby", label: "Add Friend", icon: <UserPlus className="w-4 md:w-5" /> },
    { id: "pending", label: "Accept Request", icon: <UserCheck className="w-4 md:w-5" /> },
    { id: "sent", label: "Cancel Request", icon: <X className="w-4 md:w-5" /> },
  ].find((btn) => btn.id === type);

  if (!currentButton) return null;

  return (
    <div className={`aspect-4/6 shrink-0 ${className}`}>
      <div className="w-full h-full shadow-xl rounded-lg overflow-hidden border border-border">
        <div className="w-full h-[65%] relative border-b border-border text-text1">
          <Avatar className="w-full h-full bg-bg rounded-none">
            <SafeImage
              src={user.profileImageUrl !== "" ? user.profileImageUrl : null}
              fill={true}
              alt={`${user.firstName}'s profile`}
              className="object-cover rounded-full"
            />
            <div className="w-full h-full rounded-full bg-bg-gray2">
              <AvatarFallback className={'text-6xl md:text-8xl font-semibold text-primary'}>{user?.firstName?.[0] + user?.lastName?.[0]}</AvatarFallback>
            </div>
          </Avatar>
        </div>

        <div className="w-full h-[35%] bg-bg-white1 p-2 flex flex-col justify-between">
          <Link href={`/user/${user.username}`}>
            <h1 className="text-[17px] md:text-[20px] text-text1 font-bold truncate hover:underline">
              {`${user.firstName} ${user.lastName}`}
            </h1>
          </Link>

          <button
            onClick={() => onAction(user._id, type)}
            className="w-full h-8 md:h-10 bg-primary/80 hover:bg-primary text-white transition-colors rounded-lg flex justify-center items-center gap-1 md:gap-2 group"
          >
            {/* <span className="">{currentButton.icon}</span> */}
            <p className="text-[15px] md:text-sm font-semibold cursor-pointer uppercase">
              {currentButton.label}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
