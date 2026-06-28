
import Link from "next/link";
import SafeImage from "../SafeImage";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ChevronDown, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import SettingSheet from "../settings/SettingSheet";

export default function AccountMenuSheet({ loggedInUser, isAdmin }) {
    const [open, setOpen] = useState(false)
    return (
        <TooltipProvider delayDuration={300}>
            <Sheet open={open} onOpenChange={setOpen}>
                <Tooltip>
                    <SheetTrigger asChild >
                        <TooltipTrigger asChild>
                            <div className="w-9 md:w-10 h-9 md:h-10 rounded-full flex flex-row cursor-pointer relative"
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
                                <div className="w-4 h-4 bg-bg-gray1 absolute bottom-0 right-0 rounded-full justify-center items-center">
                                    <ChevronDown className={`w-4 h-4 text-text1 duration-300 mr-1 ${open === true ? "rotate-180" : ""}`} />
                                </div>
                            </div>
                        </TooltipTrigger>
                    </SheetTrigger>

                    <TooltipContent side="bottom" className="bg-black text-white text-xs font-medium px-2 py-1 rounded-md shadow-md border-none">
                        <p>Account Menu</p>
                    </TooltipContent>
                </Tooltip>

                <SheetContent showCloseButton={false} className={'w-70 md:w-80 h-110 max-h-130 z-50 bg-bg-white1 border-border backdrop-blur-xl shadow-2xl rounded-xl text-text1 flex flex-col px-2 top-23 md:top-14 overflow-y-scroll hide-scrollbar'}>
                    <div className={'w-full p-2 bg-bg-white1 shadow-lg mt-3 rounded-xl flex flex-col'}>
                        <div className="flex justify-Start items-center gap-3 border-b border-border py-3">
                            <Avatar className="w-10 h-10 bg-bg-gray2">
                                <SafeImage
                                    src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
                                    fill
                                    alt="User Profile Image"
                                    className="object-contain"
                                />
                                <AvatarFallback className={'text-[22px] text-text1 font-bold'}>{loggedInUser?.firstName?.[0] + loggedInUser?.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <p className="font-bold">{loggedInUser?.firstName + " " + loggedInUser?.lastName}</p>
                        </div>
                        <div onClick={() => setOpen(!open)} className="py-3">
                            <Link href={`/profile/${loggedInUser.username}`} className="w-full flex justify-center gap-2 bg-bg-gray-hover py-2 rounded-lg cursor-pointer">
                                <UserCircle />
                                <p className="font-semibold">See profile</p>
                            </Link>
                        </div>
                    </div>

                    <div onClick={() => setOpen(!open)} className={`${isAdmin ? 'flex' : 'hidden'}`}>
                        <Link href={'/admin'} className={`w-full hover:bg-bg-gray-hover py-2 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold`}>
                            <div className="rounded-full bg-bg-gray2 p-2.5">
                                <LayoutDashboard className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <p>Dashboard</p>
                        </Link>
                    </div>

                    <div>
                        <SettingSheet loggedInUser={loggedInUser} />
                    </div>

                    <div className={'mt-3'}>
                        <p className="text-[10px] tracking-widest uppercase">Others</p>
                        <div className="w-full h-px bg-card"></div>
                    </div>

                    <div onClick={() => setOpen(!open)}>
                        <button onClick={() => signOut()} className="w-full hover:bg-bg-gray-hover border-0 py-2 pl-2.5 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold">
                            <div className="rounded-full bg-bg-gray2 p-2.5">
                                <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <p>Log Out</p>
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </TooltipProvider>
    )
}
