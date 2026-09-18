
import Link from "next/link";
import SafeImage from "../SafeImage";
import SettingSheet from "../settings/SettingSheet";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useConfirm } from "@/context/ConfirmContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ChevronDown, LayoutDashboard, LogOut, Trash2, UserCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function AccountMenuSheet({ loggedInUser, isAdmin }) {
    const [open, setOpen] = useState(false)

    const { confirm } = useConfirm();

    const handleSignOut = () => {
        confirm({
            title: "Want to Logout?",
            description: "Are you sure to logout from ConnectVibe?",
            confirmText: "Logout",
            variant: "destructive",
            icon: Trash2,
            onConfirm: async () => {
                signOut()
            },
        });
    }
    return (
        <TooltipProvider delayDuration={300}>
            <Sheet open={open} onOpenChange={setOpen}>
                <Tooltip>
                    <SheetTrigger asChild >
                        <TooltipTrigger asChild>
                            <div className="w-9 md:w-10 h-9 md:h-10 rounded-full flex flex-row cursor-pointer relative"
                            >
                                <Avatar className="w-9 md:w-10 h-9 md:h-10 border border-border dark:border-dark-card2 bg-bg-gray2 dark:bg-dark-card2">
                                    <SafeImage
                                        src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
                                        fill
                                        alt="User Profile Image"
                                        className="object-contain"
                                    />
                                    <AvatarFallback className={'text-[22px] text-primary font-bold'}>{loggedInUser?.firstName?.[0] + loggedInUser?.lastName?.[0]}</AvatarFallback>
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

                <SheetContent showCloseButton={false} className={'w-70 md:w-80 max-h-90 md:max-h-110 pb-4 z-50 bg-bg-white1 dark:bg-dark-card border-l border-border backdrop-blur-xl shadow-2xl rounded-l-xl text-text1 flex flex-col px-2 top-23 md:top-14 right-3.5 overflow-y-scroll hide-scrollbar'}>
                    <div className={'w-full p-2 shadow-lg mt-3 rounded-xl flex flex-col dark:text-text-dark'}>
                        <div className="flex justify-Start items-center gap-3 border-b border-border dark:border-border-dark py-3">
                            <Avatar className="w-10 h-10 bg-bg-gray2 dark:bg-dark-card2">
                                <SafeImage
                                    src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
                                    fill
                                    alt="User Profile Image"
                                    className="object-contain"
                                />
                                <AvatarFallback className={'text-[22px] font-bold'}>{loggedInUser?.firstName?.[0] + loggedInUser?.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <p className="font-bold">{loggedInUser?.firstName + " " + loggedInUser?.lastName}</p>
                        </div>
                        <div onClick={() => setOpen(!open)} className="py-3">
                            <Link href={`/profile/${loggedInUser.username}`} className="w-full flex justify-center gap-2 py-2 rounded-lg cursor-pointer">
                                <UserCircle/>
                                <p className="font-semibold">See profile</p>
                            </Link>
                        </div>
                    </div>

                    <div onClick={() => setOpen(!open)} className={`${isAdmin ? 'flex' : 'hidden'}`}>
                        <Link href={'/admin'} className={`w-full text-text1 dark:text-text-dark hover:bg-bg-gray-hover dark:hover:bg-dark-card2 py-2 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold`}>
                            <div className="rounded-full bg-bg-gray2 dark:bg-dark-card2 p-2.5">
                                <LayoutDashboard className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <p className="">Dashboard</p>
                        </Link>
                    </div>

                    <div>
                        <SettingSheet loggedInUser={loggedInUser} />
                    </div>

                    <div className={'mt-3 flex items-center'}>
                        <p className="text-[10px] tracking-widest uppercase dark:text-border-dark">Others</p>
                        <div className="w-full ml-2 h-px bg-border-dark"></div>
                    </div>

                    <div onClick={() => setOpen(!open)}>
                        <button onClick={() => handleSignOut()} className="w-full text-text1 dark:text-text-dark hover:bg-bg-gray-hover dark:hover:bg-dark-card2 outline-0 py-2 pl-2.5 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold">
                            <div className="rounded-full bg-bg-gray2 dark:bg-dark-card2 p-2.5">
                                <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <p className="">Log Out</p>
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </TooltipProvider>
    )
}
