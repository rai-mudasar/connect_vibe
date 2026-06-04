import Link from "next/link";
import SafeImage from "../SafeImage";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LayoutDashboard, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function AccountMenu({ loggedInUser, isAdmin }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-9 md:w-10 h-9 md:h-10 border border-border bg-bg cursor-pointer">
                    <SafeImage
                        src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
                        fill
                        alt="User Profile Image"
                        className="object-contain"
                    />
                    <AvatarFallback className={'text-[22px] text-primary font-bold'}>{loggedInUser?.firstName?.[0]}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={'bg-label2 text-secondary mr-3 md:mr-17 flex flex-col m-0 p-0'}>
                <DropdownMenuItem>
                    <Link href={'/admin'} className={`${isAdmin ? 'flex' : 'hidden'} w-30 h-10 pl-2 rounded-lg cursor-pointer flex-row items-center gap-2 hover:bg-card hover:text-primary hover:border border-border font-semibold`}>
                        <LayoutDashboard className="w-5 md:w-6 h-5 md:h-6" />
                        <p>Dashboard</p>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                    <button onClick={() => signOut()} className="w-30 h-10 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 hover:bg-card hover:text-primary hover:border border-border font-semibold">
                        <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                        <p>Log Out</p>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
