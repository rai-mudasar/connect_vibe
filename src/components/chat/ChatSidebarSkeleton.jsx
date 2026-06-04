import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

export default function ChatSidebarSkeleton({ isChatting }) {
    return (
        <div className={`${isChatting ? "hidden sm:flex" : "flex"} w-screen sm:w-80 h-screen bg-bg flex-col`}>
            <div className="w-full h-18 flex flex-row items-center justify-between pl-4 pr-7">
                <h2 className="text-xl md:text-2xl font-bold text-primary">Messages</h2>
                <Link href={'/home'} className="relative cursor-pointer">
                    <p className="text-[22px] text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
                </Link>
            </div>

            <div className="overflow-y-auto mt-5">
                {/* --- RECENT CHATS --- */}
                <div className="px-2">
                    <p className="text-xs font-semibold text-label uppercase px-2 mb-2"> Recent </p>
                    <div className="flex items-center gap-3 px-3 py-1 bg-bg text-gray-500 rounded-lg cursor-pointer transition mb-1.5">
                        <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center overflow-hidden relative">
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-primary">
                                New User
                            </p>
                            <p className="text-sm text-label truncate">
                                Started a conversation
                            </p>
                        </div>
                    </div>
                </div>

                <div className="my-4 border-t relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-label px-2 text-xs font-bold text-label2 flex items-center gap-1">
                        <MessageSquarePlus size={14} /> NEW CHAT
                    </span>
                </div>

                <div className="p-2">
                    <p className="text-xs font-semibold text-secondary uppercase px-2 mb-2">
                        Friends
                    </p>
                    <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition group">
                        <div className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center relative overflow-hidden">
                        </div>
                        <p className="font-medium text-lbel">New User</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
