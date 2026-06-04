"use client";

import Link from "next/link";
import SafeImage from "../SafeImage";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, MessageSquarePlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getLoggedInUserAllConversations, getOrCreateConversation } from "@/actions/chatActions";

export default function ChatSidebar({
  friends,
  loggedInUserId,
}) {
  const pathname = usePathname();
  const isChatting = pathname.split("/").length > 2;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState('')

  const { data: loggedInUserTotalChats } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => await getLoggedInUserAllConversations(),
  });

  useEffect(() => {
    const id = pathname.split('/')
    setActiveId(id[2])
  }, [pathname])

  const handleOpenOrStartChat = async (targetUserId) => {
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

  return (
    <div
      className={`${isChatting ? "hidden sm:flex" : "flex"} w-screen sm:w-80 h-screen bg-bg flex-col border-r border-border`}
    >
      <div className="w-full h-18 flex flex-row items-center justify-between pl-4 pr-7">
        <h2 className="text-xl md:text-2xl font-bold text-secondary">Messages</h2>
        <Link href={'/home'} className="relative cursor-pointer">
          <p className="text-[22px] text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
        </Link>
      </div>

      <div className="overflow-y-auto mt-5">
        {/* --- RECENT CHATS --- */}
        <div className="px-2">
          <p className="text-xs font-semibold text-label uppercase px-2 mb-2">
            Recent
          </p>
          {loggedInUserTotalChats?.length > 0 ? (
            loggedInUserTotalChats.map((chat) => {
              const otherUser = chat.participants.find(
                (participant) => participant._id !== loggedInUserId,
              );
              return (
                <div
                  key={chat._id}
                  onClick={() => router.push(`/chat/${chat._id}`)}
                  className={`flex items-center gap-3 px-3 py-1 hover:shadow-sm/30 text-label rounded-lg cursor-pointer transition mb-1.5 border-bg  ${activeId === chat._id ? 'bg-card border border-border shadow-sm/30 shadow-card' : 'hover:bg-card hover:border border-border'}`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                    {otherUser?.profileImageUrl ? (
                      <SafeImage
                        src={otherUser.profileImageUrl}
                        alt={"Friend Profile Image"}
                        fill
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-primary">
                      {`${otherUser?.firstName} ${otherUser?.lastName}` ||
                        "User"}
                    </p>
                    <p className="text-sm truncate">
                      {chat.lastMessage?.text || "Started a conversation"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400 px-2">No recent chats</p>
          )}
        </div>

        <div className="my-4 border-t border-border relative">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-label px-2 text-xs font-bold text-label2 flex items-center gap-1">
            <MessageSquarePlus size={14} /> NEW CHAT
          </span>
        </div>

        <div className="p-2">
          <p className="text-xs font-semibold text-secondary uppercase px-2 mb-2">
            Friends
          </p>
          <div className="flex flex-col gap-1">
            {friends.map((friend) => (
              <div
                key={friend._id}
                onClick={() => handleOpenOrStartChat(friend._id)}
                className="flex items-center gap-3 p-3 hover:bg-card hover:border border-border rounded-lg cursor-pointer transition group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center relative overflow-hidden">
                  <SafeImage
                    src={friend.profileImageUrl}
                    alt={"Friend Profile Image"}
                    fill
                  />
                </div>
                <p className="font-medium text-label group-hover:text-primary">{`${friend.firstName} ${friend.lastName}`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
