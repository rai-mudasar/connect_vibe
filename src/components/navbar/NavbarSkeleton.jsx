"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, House, MessageCircle, Users2 } from "lucide-react";
import { FacebookSearchDialog } from "../FacebookSearchDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import AccountMenuSheet from "./AccountMenuSheet";
import ChatNavbarBadge from "../chat/ChatNavbarBadge";
import NotificationDrawer from "../notification/NotificationDrawer";

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { icon: <House />, name: "Home", href: "/home" },
        { icon: <Users2 />, name: "Friends", href: "/friends" },
    ];

    return (
        <TooltipProvider delayDuration={300}>
            <nav className="w-full md:h-14 pt-1 md:pt-0 px-3 bg-bg-white1 dark:bg-dark-card flex flex-col md:flex-row items-center justify-around shadow-sm sm:fixed z-50">

                <section className="w-full md:w-[25%] flex flex-row gap-2 items-center cursor-pointer mt-2 md:mt-0">
                    <p className="text-[22px] text-text1 dark:text-text3 font-semibold">Connect<span className="text-primary">Vibe.</span></p>
                    <div className="hidden lg:flex">
                        <FacebookSearchDialog />
                    </div>
                </section>

                <section className="w-full md:[60%] mt-1 md:mt-0 flex justify-around md:justify-evenly">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Tooltip key={link.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={link.href}
                                        className={`text-text2 hover:text-primary hover:border-b-2 border-primary py-2 font-medium transition-colors px-1 text-sm ${link.className}`}
                                    >
                                        {link.icon}
                                    </Link>
                                </TooltipTrigger>

                                <TooltipContent side="bottom" className="bg-black text-white text-xs font-medium px-2 py-1 rounded-md shadow-md border-none">
                                    <p>{link?.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                    <div className="flex">
                        <div className="relative p-2 transition-colors flex items-center justify-center border-b-2 border-bg-white1 dark:border-dark-card hover:border-primary group">
                            <MessageCircle className="w-6 h-6 text-text2 group-hover:text-primary" />
                        </div>
                    </div>
                </section>

                <section className="w-[45%] md:w-[25%] pt-1 md:pt-0 absolute md:relative top-1 right-2 flex items-center justify-end gap-2 md:gap-4 mr-1">

                    <div className="lg:hidden">
                        <FacebookSearchDialog />
                    </div>

                    <div className="w-9 md:w-10 h-9 md:h-10 relative flex justify-center items-center rounded-full bg-bg-gray2 dark:bg-dark-card2 text-text1 dark:text-text-dark transition cursor-pointer">
                        <Bell className="w-5 md:w-6 h-5 md:h-6 stroke-[2.7px]" />
                    </div>

                    <div>
                        <div className="w-9 md:w-10 h-9 md:h-10 rounded-full flex flex-row cursor-pointer relative overflow-hidden">
                            <div className="w-9 md:w-10 h-9 md:h-10 border border-border dark:border-dark-card2 bg-bg-gray2 dark:bg-dark-card2">
                                <p className={'text-[22px] text-primary font-bold'}>NU</p>
                            </div>
                            <div className="w-4 h-4 bg-bg-gray1 absolute bottom-0 right-0 rounded-full justify-center items-center">
                                <ChevronDown className={`w-4 h-4 text-text1 duration-300 mr-1`} />
                            </div>
                        </div>
                    </div>

                </section>
            </nav>
        </TooltipProvider>
    );
}
