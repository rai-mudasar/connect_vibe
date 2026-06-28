"use client";

import Link from "next/link";
import SafeImage from "../SafeImage";
import NewChatDrawer from "./NewChatDrawer";
import { Input } from "../ui/input";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";
import { Search, X, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { usePresence } from "@/context/PresenceContext";

export default function ChatSidebar({ friends, loggedInUserId, initialConversations }) {
  const router = useRouter();
  const pathname = usePathname();
  const { onlineUsers } = usePresence();

  const isChatting = pathname.split("/").length > 2;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState('');
  const [conversations, setConversations] = useState(initialConversations);
  const chatsToFilter = Array.isArray(conversations) ? conversations : [];

  // Listen for optimistically created chat update event
  useEffect(() => {
    const handleOptimisticChatCreation = (event) => {
      const newChatRoom = event.detail.chatRoom;

      setConversations((oldChats) => {
        if (!oldChats) return [];

        // Check if it already exists to prevent duplication
        const exists = oldChats.some(c => c._id === newChatRoom._id);
        if (exists) return oldChats;

        // Put the new conversation right at the top instantly
        return [newChatRoom, ...oldChats];
      });
    };

    window.addEventListener('chatCreated', handleOptimisticChatCreation);
    return () => {
      window.removeEventListener('chatCreated', handleOptimisticChatCreation);
    };
  }, []);

  //  Listen for optimistically deleted chat update event
  useEffect(() => {
    const handleOptimisticDelete = (event) => {
      const deletedChatId = event.detail.chatId;

      // Instantly wipe it out from client sidebar state
      setConversations((oldChats) => {
        if (!oldChats) return [];
        return oldChats.filter((chat) => chat._id !== deletedChatId);
      });
    };

    window.addEventListener('chatDeleted', handleOptimisticDelete);
    return () => {
      window.removeEventListener('chatDeleted', handleOptimisticDelete);
    };
  }, []);

  //  Used for optimistic unread badge removal on chat opening
  useEffect(() => {
    const idArray = pathname.split('/');
    const currentChatId = idArray[2] || '';
    setActiveId(currentChatId);

    if (currentChatId) {
      setConversations((oldChats) => {
        if (!oldChats) return [];

        // 1. Pata karein ke is khulne wali chat me kitne unread messages the
        // const targetedChat = oldChats.find(c => c._id === currentChatId);
        // const unreadCountToReduce = targetedChat?.unreadCount || 0;

        // // 2. Agar waqai koi unread message tha, to global navbar ko notification bhejein
        // if (unreadCountToReduce > 0) {
        //   const syncEvent = new CustomEvent("syncGlobalUnread", {
        //     detail: { reduceBy: unreadCountToReduce } // 👈 Pass the exact count to subtract
        //   });
        //   window.dispatchEvent(syncEvent);
        // }

        return oldChats.map((oldChat) => {
          if (oldChat._id === currentChatId) {
            return {
              ...oldChat,
              unreadCount: 0,
            };
          }
          return oldChat;
        });
      });
    }
  }, [pathname]);

  // Sync props data when navigating or on initial payload updates
  useEffect(() => {
    if (initialConversations) setConversations(initialConversations);
  }, [initialConversations]);

  // Real-time unread counter management via Pusher
  useEffect(() => {
    if (!loggedInUserId) return;

    const globalChannel = pusherClient.subscribe(`user-${loggedInUserId}`);

    globalChannel.bind("unreadCounter", (payload) => {
      const targetUrlId = window.location.pathname.split('/')[2];
      const isMessageFromMe = payload.lastMessage?.senderId === loggedInUserId;

      const updatedCount = (targetUrlId === payload.conversationId || isMessageFromMe) ? 0 : payload.unreadCount;

      setConversations((oldChats) => {
        if (!oldChats) return [];

        const exists = oldChats.some(c => c._id === payload.conversationId);

        if (!exists) {

          const newChatPlaceholder = {
            _id: payload.conversationId,
            participants: payload.participants || [],
            unreadCount: updatedCount,
            lastMessage: payload.lastMessage,
            updatedAt: new Date().toISOString(),
          };

          return [newChatPlaceholder, ...oldChats];
        }

        const updatedChats = oldChats.map((oldChat) => {
          if (oldChat._id === payload.conversationId) {
            return {
              ...oldChat,
              unreadCount: updatedCount,
              lastMessage: payload.lastMessage,
            };
          }
          return oldChat;
        });

        // Sort again taaki latest message wali chat hamesha top par rahe
        return updatedChats.sort((a, b) => new Date(b.lastMessage?.createdAt || b.updatedAt) - new Date(a.lastMessage?.createdAt || a.updatedAt));
      });
    });

    return () => {
      globalChannel.unbind_all();
      pusherClient.unsubscribe(`user-${loggedInUserId}`);
    };
  }, [loggedInUserId]);

  const filteredChats = chatsToFilter.filter((chat) => {
    const otherUser = chat?.participants?.find(
      (participant) => participant?._id !== loggedInUserId
    );
    const fullName = `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.toLowerCase();
    const username = (otherUser?.username || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || username.includes(query);
  });

  const handleChatClick = (chat) => {
    if (chat?.unreadCount > 0) {
      const syncEvent = new CustomEvent("syncGlobalUnread", {
        detail: { reduceBy: chat.unreadCount }
      });
      window.dispatchEvent(syncEvent);
    }
    router.replace(`/chat/${chat?._id}`);
  };

  return (
    <div className={`${isChatting ? "hidden sm:flex" : "flex"} w-screen sm:w-80 h-screen bg-bg-gray1 flex-col border-r border-border relative`}>
      <div className="w-full h-18 flex flex-row items-center justify-between pl-4 pr-7 shrink-0">
        <div className="flex items-center justify-center">
          <div onClick={() => {router.back()}} className="text-text1 cursor-pointer">
            <ChevronLeft className="h-9" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-text1">Messages</h2>
        </div>
        <Link href={'/home'} className="relative cursor-pointer sm:hidden">
          <p className="text-[22px] text-text1 font-semibold">Connect<span className="text-primary">Vibe.</span></p>
        </Link>
        <div className="hidden sm:flex justify-center items-center w-10 h-10 bg-primary rounded-xl shadow-md cursor-pointer z-50">
          <NewChatDrawer friends={friends} loggedInUserId={loggedInUserId} />
        </div>
      </div>

      <div className="relative px-4 mb-4 shrink-0">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-text2" />
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-bg-white1 border border-border text-text1 placeholder:text-text2 w-full"
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
        <div>
          <p className="text-xs font-semibold text-label uppercase px-2 mb-2">Recent</p>
          {filteredChats && filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const otherUser = chat?.participants?.find(
                (participant) => participant?._id !== loggedInUserId,
              );

              const isCurrentlyActive = activeId === chat?._id;
              const hasUnread = chat?.unreadCount > 0;
              const isOnline = onlineUsers?.includes(otherUser._id.toString())

              return (
                <div
                  key={chat?._id}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center gap-3 px-3 py-2 text-text1 rounded-lg cursor-pointer transition mb-2 bg-bg-gray1 border border-bg-gray1 ${isCurrentlyActive ? ' border-border bg-bg-white1 shadow-sm' : 'hover:border-border hover:bg-bg-white1'
                    }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12 bg-bg-gray2 border border-border bg-bg flex items-center justify-center overflow-hidden relative shrink-0">
                      <SafeImage
                        src={otherUser?.profileImageUrl !== "" ? otherUser?.profileImageUrl : null}
                        fill
                        alt="User Profile Image"
                        className="object-contain"
                      />
                      <AvatarFallback className={'text-[22px] text-primary font-bold'}>{otherUser?.firstName?.[0] + otherUser?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    {
                      isOnline && <div className="w-3 h-3 rounded-full bg-green-500 absolute bottom-0 right-0"></div>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate text-text1">
                        {otherUser ? `${otherUser?.firstName} ${otherUser?.lastName}` : "User"}
                      </p>
                      {hasUnread && (
                        <span className="bg-primary text-white text-xs font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1 animate-pulse">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className={`w-50 text-sm truncate ${hasUnread ? 'font-semibold text-text1' : 'text-text2'}`}>
                      {(chat?.lastMessage?.deletedFor?.includes(loggedInUserId) ? "Started a conversation" : chat?.lastMessage?.text) || "Started a conversation"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-text2 px-2 italic mt-4">No recent chats found</p>
          )}
        </div>
      </div>

      <div className="w-13 h-13 bg-primary transition-colors rounded-full fixed bottom-10 right-10 flex sm:hidden justify-center items-center shadow-lg cursor-pointer z-50">
        <NewChatDrawer friends={friends} loggedInUserId={loggedInUserId} />
      </div>
    </div>
  );
}