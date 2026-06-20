
import Link from "next/link";
import { Input } from "../ui/input";
import { Avatar } from "../ui/avatar";
import { MessageSquarePlus, Search } from "lucide-react";

export default function ChatSidebarSkeleton() {
    return (
        <div className={`flex w-screen sm:w-80 h-screen bg-bg flex-col border-r border-border relative`}>
            <div className="w-full h-18 flex flex-row items-center justify-between pl-4 pr-7 shrink-0">
                <h2 className="text-2xl md:text-3xl font-bold text-secondary">Messages</h2>
                <Link href={'/home'} className="relative cursor-pointer sm:hidden">
                    <p className="text-[22px] text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
                </Link>
                <div className="hidden sm:flex justify-center items-center w-10 h-10 bg-primary rounded-xl shadow-md cursor-pointer z-50">
                    <button className={"w-full h-full flex justify-center items-center z-40 cursor-pointer"}>
                        <MessageSquarePlus className="w-6 h-6 text-black" />
                    </button>
                </div>
            </div>

            <div className="relative px-4 mb-4 shrink-0">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-label" />
                <Input
                    placeholder="Search friends..."
                    className="pl-10 pr-10 bg-card border border-border text-secondary placeholder-label w-full"
                />
            </div>

            <div className="overflow-y-auto flex-1 px-2">
                <div>
                    <p className="text-xs font-semibold text-label uppercase px-2 mb-2">Recent</p>
                    <div className={`flex items-center gap-3 px-3 py-2 text-label rounded-lg cursor-pointer transition mb-2 bg-card border border-border hover:bg-card-hover hover:border-border`}>
                        <div className="relative">
                            <Avatar className="w-12 h-12 border border-border bg-bg flex items-center justify-center overflow-hidden relative shrink-0">
                            </Avatar>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-medium truncate text-secondary">
                                    New User
                                </p>
                            </div>
                            <p className={`w-50 text-sm truncate text-label`}>
                                Started a conversation
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-3 px-3 py-2 text-label rounded-lg cursor-pointer transition mb-2 bg-card border border-border hover:bg-card-hover hover:border-border`}>
                        <div className="relative">
                            <Avatar className="w-12 h-12 border border-border bg-bg flex items-center justify-center overflow-hidden relative shrink-0">
                            </Avatar>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-medium truncate text-secondary">
                                    New User
                                </p>
                            </div>
                            <p className={`w-50 text-sm truncate text-label`}>
                                Started a conversation
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-3 px-3 py-2 text-label rounded-lg cursor-pointer transition mb-2 bg-card border border-border hover:bg-card-hover hover:border-border`}>
                        <div className="relative">
                            <Avatar className="w-12 h-12 border border-border bg-bg flex items-center justify-center overflow-hidden relative shrink-0">
                            </Avatar>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-medium truncate text-secondary">
                                    New User
                                </p>
                            </div>
                            <p className={`w-50 text-sm truncate text-label`}>
                                Started a conversation
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-13 h-13 bg-primary hover:bg-primary/90 transition-colors rounded-full fixed bottom-10 right-10 flex sm:hidden justify-center items-center shadow-lg cursor-pointer z-50">
                <button className={"w-full h-full flex justify-center items-center z-40 cursor-pointer"}>
                    <MessageSquarePlus className="w-6 h-6 text-black" />
                </button>
            </div>
        </div>
    );
}