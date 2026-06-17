"use client";

import Link from "next/link";
import SafeImage from "../SafeImage";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getLoggedInUserAllConversations } from "@/actions/chatActions";
import NewChatDrawer from "./NewChatDrawer";
import { Input } from "../ui/input";
import { pusherClient } from "@/lib/pusher";

export default function ChatSidebar({ friends, loggedInUserId }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isChatting = pathname.split("/").length > 2;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState('');

  // 1. Fetch conversations with TanStack Query (Key matches the server prefetch exactly now)
  const { data: loggedInUserTotalChats } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => await getLoggedInUserAllConversations(),
  });

  // 2. OPTIMISTIC INTERACTION: Clear badges instantly when changing routes
  useEffect(() => {
    const idArray = pathname.split('/');
    const currentChatId = idArray[2] || '';
    setActiveId(currentChatId);

    if (currentChatId) {
      // Instantly wipe out the unread count in your client cache state
      queryClient.setQueryData(['conversations'], (oldChats) => {
        if (!oldChats) return [];
        return oldChats.map((oldChat) => {
          if (oldChat._id === currentChatId) {
            return {
              ...oldChat,
              unreadCount: 0, // Dropped to 0 instantly on the client side
            };
          }
          return oldChat;
        });
      });
    }
  }, [pathname, queryClient]);

  // 3. Real-time sync fallback loops via Pusher
  useEffect(() => {
    if (!loggedInUserTotalChats || loggedInUserTotalChats.length === 0) return;

    const subscribedChannels = [];

    loggedInUserTotalChats.forEach((chat) => {
      const channel = pusherClient.subscribe(chat._id);
      subscribedChannels.push({ name: chat._id, instance: channel });

      // Match backend event string name exactly: "newMessage"
      channel.bind("newMessage", (payload) => {
        // If the user is currently inside this active chat screen, don't tick the badge up
        const targetUrlId = window.location.pathname.split('/')[2];
        const updatedCount = targetUrlId === payload.conversationId ? 0 : payload.unreadCount;

        queryClient.setQueryData(['conversations'], (oldChats) => {
          if (!oldChats) return [];
          return oldChats.map((oldChat) => {
            if (oldChat._id === payload.conversationId) {
              return {
                ...oldChat,
                unreadCount: updatedCount,
                lastMessage: payload.lastMessage || oldChat.lastMessage,
              };
            }
            return oldChat;
          });
        });
      });

      // Backup fallback listener if the read event triggers from another device terminal tab
      channel.bind("messagesRead", (payload) => {
        queryClient.setQueryData(['conversations'], (oldChats) => {
          if (!oldChats) return [];
          return oldChats.map((oldChat) => {
            if (oldChat._id === payload.conversationId) {
              return {
                ...oldChat,
                unreadCount: 0,
              };
            }
            return oldChat;
          });
        });
      });
    });

    return () => {
      subscribedChannels.forEach((ch) => {
        ch.instance.unbind_all();
        pusherClient.unsubscribe(ch.name);
      });
    };
  }, [loggedInUserTotalChats, queryClient]);

  // Safe fallback to an empty array to prevent filtering runtime errors on early mount
  const chatsToFilter = Array.isArray(loggedInUserTotalChats) ? loggedInUserTotalChats : [];

  const filteredChats = chatsToFilter.filter((chat) => {
    const otherUser = chat?.participants?.find(
      (participant) => participant?._id !== loggedInUserId
    );
    const fullName = `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.toLowerCase();
    const username = (otherUser?.username || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || username.includes(query);
  });

  return (
    <div className={`${isChatting ? "hidden sm:flex" : "flex"} w-screen sm:w-80 h-screen bg-bg flex-col border-r border-border relative`}>
      <div className="w-full h-18 flex flex-row items-center justify-between pl-4 pr-7 shrink-0">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary">Messages</h2>
        <Link href={'/home'} className="relative cursor-pointer sm:hidden">
          <p className="text-[22px] text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
        </Link>

        <div className="hidden sm:flex justify-center items-center w-10 h-10 bg-primary rounded-xl shadow-md cursor-pointer z-50">
          <NewChatDrawer friends={friends} loggedInUserId={loggedInUserId} />
        </div>
      </div>

      <div className="relative px-4 mb-4 shrink-0">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-label" />
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-card border border-border text-secondary placeholder-label w-full"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-7 top-1/2 -translate-y-1/2 text-label hover:text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 px-2">
        {/* --- RECENT CHATS --- */}
        <div>
          <p className="text-xs font-semibold text-label uppercase px-2 mb-2">
            Recent
          </p>
          {filteredChats && filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const otherUser = chat?.participants?.find(
                (participant) => participant?._id !== loggedInUserId,
              );

              const isCurrentlyActive = activeId === chat?._id;
              const hasUnread = chat?.unreadCount > 0;

              return (
                <div
                  key={chat?._id}
                  onClick={() => router.replace(`/chat/${chat?._id}`)}
                  className={`flex items-center gap-3 px-3 py-2 text-label rounded-lg cursor-pointer transition mb-2 bg-card border ${isCurrentlyActive
                      ? 'border-primary bg-card/20 shadow-sm'
                      : 'border-border hover:bg-card-hover hover:border-border'
                    }`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative shrink-0">
                    {otherUser?.profileImageUrl ? (
                      <SafeImage
                        src={otherUser?.profileImageUrl}
                        alt="Friend Profile Image"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate text-secondary">
                        {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "User"}
                      </p>

                      {hasUnread && (
                        <span className="bg-primary text-black text-xs font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1 animate-pulse">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>

                    <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-secondary' : 'text-label'}`}>
                      {chat?.lastMessage?.text || "Started a conversation"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-label px-2 italic mt-4">No recent chats found</p>
          )}
        </div>
      </div>

      <div className="w-13 h-13 bg-primary hover:bg-primary/90 transition-colors rounded-full fixed bottom-10 right-10 flex sm:hidden justify-center items-center shadow-lg cursor-pointer z-50">
        <NewChatDrawer friends={friends} loggedInUserId={loggedInUserId} />
      </div>
    </div>
  );
}