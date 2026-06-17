"use client";

import { useEffect, useState } from "react";
import { Search, X, MessageSquarePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import SafeImage from "../SafeImage";
import Loading from "../Loading";
import { getOrCreateConversation } from "@/actions/chatActions";


export default function NewChatDrawer({ loggedInUserId, friends, triggerClassName }) {

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const filteredFriends = friends.filter((friend) =>
        friend.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect( ()=> {
        setOpen(false)
    }, [])

    const handleOpenOrStartChat = async (targetUserId) => {
        setOpen(false);
        setSearchQuery("");
        setLoading(true);
        try {
            const chat = await getOrCreateConversation(loggedInUserId, targetUserId);
            router.push(`/chat/${chat._id}`);
        } catch (error) {
            console.error("Failed to start chat:", error);
        } finally {
            setLoading(false);
        }
    };

    if(loading) return (
        <div className="fixed inset-0 bg-black/30">
            <Loading />
        </div>
    )

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className={
                        triggerClassName ||
                        "w-full h-full flex justify-center items-center z-40 cursor-pointer"
                    }
                >
                    <MessageSquarePlus className="w-6 h-6 text-black" />
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-full max-w-sm sm:max-w-md h-screen sm:h-auto bg-bg text-xl text-secondary">
                <SheetHeader className="border-b border-border">
                    <SheetTitle className="text-xl font-bold text-secondary">
                        New Chat
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col flex-1 px-4 py-4 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label" />
                        <Input
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 bg-card border border-border text-secondary placeholder-label focus-visible:ring-[1px]"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-label hover:text-secondary transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>   

                    {/* Friends List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredFriends.length > 0 ? (
                            <div className="space-y-2">
                                {filteredFriends.map((friend) => (
                                    <button
                                        key={friend._id}
                                        onClick={() => handleOpenOrStartChat(friend._id)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-card border border-border hover:bg-card/80 hover:border-border transition-colors text-left"
                                    >
                                        <div className="relative shrink-0">
                                            <Avatar className="w-10 h-10 border border-border bg-bg">
                                                <SafeImage
                                                    src={friend?.profileImageUrl !== "" ? friend?.profileImageUrl : null}
                                                    fill
                                                    alt="User Profile Image"
                                                    className="object-contain"
                                                />
                                                <AvatarFallback className={'text-[22px] text-primary font-bold'}>{friend?.firstName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            {friend.status === "online" && (
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card dark:border-gray-900" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-secondary truncate">
                                                {friend.firstName + " " + friend.lastName}
                                            </p>
                                            {friend.status && (
                                                <p
                                                    className={`text-xs truncate ${friend.status === "online"
                                                        ? "text-green-500"
                                                        : "text-label"
                                                        }`}
                                                >
                                                    {friend.status === "online" ? "Online" : "Offline"}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-3">
                                    <Search className="w-6 h-6 text-label" />
                                </div>
                                <p className="text-sm font-medium text-secondary mb-1">
                                    {searchQuery ? "No friends found" : "No friends available"}
                                </p>
                                {searchQuery && (
                                    <p className="text-xs text-label">
                                        Try searching with a different name
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}