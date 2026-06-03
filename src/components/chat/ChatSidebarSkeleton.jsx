import SafeImage from "../SafeImage";
import { MessageSquarePlus } from "lucide-react";

export default function ChatSidebarSkeleton({isChatting}) {
    return (
        <div className={`${isChatting ? "hidden sm:flex" : "flex"} w-screen sm:w-80 h-screen bg-gray-100 flex-col`}>
            <div className="w-full h-18 flex flex-row items-center justify-between pl-4 pr-7">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Messages</h2>
                <div className="w-8 md:w-10 h-8 md:h-10 relative cursor-pointer">
                    <SafeImage
                        src="/svg/fb_icon.svg"
                        alt="ConnectVibe Icon"
                        fill
                        className={'w-8 md:w-8.5 h-8 md:h-8.5 object-cover'}
                    />
                </div>
            </div>

            <div className="overflow-y-auto mt-5">
                {/* --- RECENT CHATS --- */}
                <div className="px-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2"> Recent </p>
                    <div className="flex items-center gap-3 px-3 py-1 bg-gray-100 hover:bg-gray-300 text-gray-500 rounded-lg cursor-pointer transition mb-1.5">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                                New User
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                Started a conversation
                            </p>
                        </div>
                    </div>
                </div>

                <div className="my-4 border-t relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                        <MessageSquarePlus size={14} /> NEW CHAT
                    </span>
                </div>

                <div className="p-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">
                        Friends
                    </p>
                    <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition group">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center relative overflow-hidden">
                        </div>
                        <p className="font-medium text-gray-700 group-hover:text-blue-600">New User</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
