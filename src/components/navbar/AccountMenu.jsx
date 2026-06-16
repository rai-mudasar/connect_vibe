
import Link from "next/link";
import SafeImage from "../SafeImage";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

export default function AccountMenu({ loggedInUser, isAdmin }) {
    const [open, setOpen] = useState(false)
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild >
                <div className="w-17.5 md:w-20 p-[0.5px] border border-border md:p-px bg-bg rounded-[19px] flex flex-row cursor-pointer items-center justify-between"
                >
                    <Avatar className="w-9 md:w-10 h-9 md:h-10 border border-border bg-bg">
                        <SafeImage
                            src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
                            fill
                            alt="User Profile Image"
                            className="object-contain"
                        />
                        <AvatarFallback className={'text-[22px] text-primary font-bold'}>{loggedInUser?.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <ChevronDown className={`w-5 md:w-7 text-white duration-300 mr-1 ${open === true ? "rotate-180" : "text-red-500"}`} />
                    </div>
                </div>
            </DropdownMenuTrigger>

            {open && <div className="fixed inset-0 bg-black/40 z-20"></div>}

            <DropdownMenuContent className={'z-50 bg-bg backdrop-blur-xl shadow-2xl border-border rounded-xl text-secondary mr-5 md:mr-17 flex flex-col'}>
                <DropdownMenuItem className={'w-60 md:w-70'}>
                    <div className="bg-bg border-2 border-primary rounded-full">
                        <Avatar className="w-15 h-15 border-2 border-bg bg-bg">
                            <SafeImage
                                src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
                                fill
                                alt="User Profile Image"
                                className="object-contain"
                            />
                            <AvatarFallback className={'text-[22px] text-primary font-bold'}>{loggedInUser?.firstName?.[0] + loggedInUser?.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <p className="font-bold">{loggedInUser?.firstName + " " + loggedInUser.lastName}</p>
                        <p className="text-[9px] text-label">{"@" + loggedInUser?.username}</p>
                        <p className="text-[9px] text-label">{loggedInUser?.email}</p>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className={''}>
                    <p className="text-[10px] text-label tracking-widest uppercase">Account</p>
                    <div className="w-full h-px bg-card"></div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(!open)}>
                    <Link href={'/admin'} className={`${isAdmin ? 'flex' : 'hidden'} w-full h-10 pl-2 rounded-lg cursor-pointer flex-row items-center gap-2 hover:bg-card/30 hover:text-primary hover:border border-border/30 font-semibold`}>
                        <div className="rounded-md bg-card-active p-1.5">
                            <LayoutDashboard className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                        <p>Dashboard</p>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(!open)} className={'-mt-2'}>
                    <Link href={`/user/${loggedInUser.username}`} className={`w-full h-10 pl-2 rounded-lg cursor-pointer flex flex-row items-center justify-between gap-2 hover:bg-card/30 hover:text-primary hover:border border-border/30 font-semibold`}>
                        <div className="flex flex-row items-center gap-2">
                            <div className="rounded-md bg-card-active p-1.5">
                                <User className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <p>Profile</p>
                        </div>
                        <p className="text-xs text-label mr-2">View Public Side</p>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className={'mt-3'}>
                    <p className="text-[10px] text-label tracking-widest uppercase">Others</p>
                    <div className="w-full h-px bg-card"></div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(!open)}>
                    <button onClick={() => signOut()} className="w-full h-10 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 hover:bg-card/30 hover:text-primary hover:border border-border/30 font-semibold">
                        <div className="rounded-md bg-card-active p-1.5">
                            <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                        <p>Log Out</p>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
