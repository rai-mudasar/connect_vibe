"use client";

import Link from "next/link";
import SafeImage from "../SafeImage";
import NewChatDrawer from "./NewChatDrawer";
import { Input } from "../ui/input";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";
import { Search, X, ChevronLeft, MessageSquarePlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { usePresence } from "@/context/PresenceContext";

export default function ChatSidebar() {
    const pathname = usePathname();
    const isChatting = pathname.split("/").length > 2;

    return (
        <div className={`${isChatting ? "hidden sm:flex" : "flex"} w-screen sm:w-80 h-screen bg-bg-gray1 dark:bg-dark-card flex-col border-r border-border dark:border-border-dark relative`}>
            <div className="w-full h-18 text-text1 dark:text-text-dark flex flex-row items-center justify-between pl-4 pr-7 shrink-0">
                <div className="flex items-center justify-center gap-2">
                    <div className="cursor-pointer">
                        <ChevronLeft className="w-7 h-7 text-text2 dark:hover:text-text-dark" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">Messages</h2>
                </div>
                <Link href={'/home'} className="relative cursor-pointer sm:hidden">
                    <p className="text-[22px] font-semibold">Connect<span className="text-primary">Vibe.</span></p>
                </Link>
                <div className="hidden sm:flex justify-center items-center w-10 h-10 bg-primary rounded-xl shadow-md cursor-pointer z-50">
                    <button className={"w-full h-full flex justify-center items-center z-40 cursor-pointer"}>
                        <MessageSquarePlus className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            <div className="relative px-4 mb-4 shrink-0">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-text2" />
                <Input
                    placeholder="Search friends..."
                    className="pl-10 pr-10 bg-bg-white1 dark:bg-dark-card2 border border-border dark:border-border-dark text-text1 dark:text-text-dark placeholder:text-text2 focus:ring-white w-full"
                />
            </div>

            <div className="overflow-y-auto flex-1 px-2">
                <div>
                    <p className="text-xs font-semibold text-label uppercase px-2 mb-2">Recent</p>

                    <div className={`flex items-center gap-3 px-3 py-2 text-text1 dark:text-text-dark rounded-lg cursor-pointer transition mb-2 bg-bg-gray1 dark:bg-dark-card2/70 border border-bg-gray1 dark:border-border-dark `}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-bg-gray2 dark:bg-dark-card border border-border dark:border-border-dark bg-bg flex items-center justify-center relative shrink-0 overflow-hidden">
                                <p className={'text-[22px] text-primary font-bold'}>NU</p>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-medium truncate text-text1 dark:text-text-dark">
                                    Naughty User
                                </p>
                            </div>
                            <p className={`w-50 text-sm truncate text-text2`}>
                                Started a conversation
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 px-3 py-2 text-text1 dark:text-text-dark rounded-lg cursor-pointer transition mb-2 bg-bg-gray1 dark:bg-dark-card2/70 border border-bg-gray1 dark:border-border-dark `}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-bg-gray2 dark:bg-dark-card border border-border dark:border-border-dark bg-bg flex items-center justify-center relative shrink-0 overflow-hidden">
                                <p className={'text-[22px] text-primary font-bold'}>NU</p>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-medium truncate text-text1 dark:text-text-dark">
                                    New User
                                </p>
                            </div>
                            <p className={`w-50 text-sm truncate text-text2`}>
                                Started a conversation
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 px-3 py-2 text-text1 dark:text-text-dark rounded-lg cursor-pointer transition mb-2 bg-bg-gray1 dark:bg-dark-card2/70 border border-bg-gray1 dark:border-border-dark `}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-bg-gray2 dark:bg-dark-card border border-border dark:border-border-dark bg-bg flex items-center justify-center relative shrink-0 overflow-hidden">
                                <p className={'text-[22px] text-primary font-bold'}>AA</p>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-medium truncate text-text1 dark:text-text-dark">
                                    Ali Ahmed
                                </p>
                            </div>
                            <p className={`w-50 text-sm truncate text-text2`}>
                                Started a conversation
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-13 h-13 bg-primary transition-colors rounded-full fixed bottom-10 right-10 flex sm:hidden justify-center items-center shadow-lg cursor-pointer z-50">
                <button className={"w-full h-full flex justify-center items-center z-40 cursor-pointer"}>
                    <MessageSquarePlus className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
}