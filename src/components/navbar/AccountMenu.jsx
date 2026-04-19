import { signOut } from "next-auth/react";
import SafeImage from "../SafeImage";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BellDot, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountMenu({ loggedInUser }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-9 md:w-10 h-9 md:h-10 border-white bg-neutral-300 cursor-pointer">
                    <SafeImage
                        src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
                        fill
                        alt="User Profile Image"
                        className="object-contain"
                    />
                    <AvatarFallback className={'text-md font-bold'}>{loggedInUser?.firstName?.[0]}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={'bg-white mr-17'}>
                <DropdownMenuItem>
                    <Link href={'/admin'} className="w-30 h-10 rounded-lg pl-2 -mb-3 cursor-pointer flex flex-row items-center gap-2 hover:bg-blue-50 font-semibold">
                        <LayoutDashboard className="w-5 md:w-6 h-5 md:h-6" />
                        <p>Dashboard</p>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                    <button onClick={() => signOut()} className="w-30 h-10 rounded-lg pl-2 cursor-pointer flex flex-row items-center gap-2 hover:bg-blue-50 font-semibold">
                        <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                        <p>Log Out</p>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
