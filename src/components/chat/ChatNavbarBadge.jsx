"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ChatNavbarBadge({ initialCount, loggedInUserId }) {
  const [globalUnreadCount, setGlobalUnreadCount] = useState(initialCount);
  const pathname = usePathname();

  // Sync state with server side props initialization
  useEffect(() => {
    setGlobalUnreadCount(initialCount);
  }, [initialCount]);

  // 1. Pusher Server Real-Time Subscription Pipeline
  useEffect(() => {
    if (!loggedInUserId) return;

    const globalChannel = pusherClient.subscribe(`user-${loggedInUserId}`);

    // Listen for incremental counters incoming (New message alerts)
    globalChannel.bind("unreadCounter", (payload) => {
      if (payload.lastMessage?.senderId === loggedInUserId) return;

      const currentActiveRoomId = window.location.pathname.split('/')[2];
      if (currentActiveRoomId === payload.conversationId) return;

      setGlobalUnreadCount((prev) => prev + 1);
    });

    // Listen for direct absolute database state updates (e.g., mark as read trigger resets)
    globalChannel.bind("globalCountUpdate", (payload) => {
      if (typeof payload?.totalUnread === "number") {
        setGlobalUnreadCount(payload.totalUnread);
      }
    });

    return () => {
      globalChannel.unbind_all();
      pusherClient.unsubscribe(`user-${loggedInUserId}`);
    };
  }, [loggedInUserId]);

  // 2. Custom Local Browser Event Hook (For instant UI-driven resets)
  useEffect(() => {
    const handleGlobalCountSync = (event) => {
      if (typeof event.detail?.totalUnread === "number") {
        // Direct absolute count override state pulse
        setGlobalUnreadCount(event.detail.totalUnread);
      } else if (event?.detail?.reduceBy) {
        // console.log("Received unread count by event : ", event?.detail?.reduceBy)
        setGlobalUnreadCount((prevCount) => {
          const reductionAmount = parseInt(event.detail.reduceBy, 10) || 0;
          const finalCount = prevCount - reductionAmount;
          return finalCount > 0 ? finalCount : 0;
        });
      } else if (event.detail?.decrement) {
        // Safe relative reduction mutation
        setGlobalUnreadCount((prev) => Math.max(0, prev - 1));
      } else if (event.detail?.reset) {
        // Absolute immediate zero-state wipeout
        setGlobalUnreadCount(0);
      }
    };

    window.addEventListener("syncGlobalUnread", handleGlobalCountSync);
    return () => {
      window.removeEventListener("syncGlobalUnread", handleGlobalCountSync);
    };
  }, []);

  return (
    <Link href="/chat" className="relative p-2 text-label hover:text-primary border-b-2 lg:border-0 border-card hover:border-primary lg:text-primary lg:hover:text-secondary transition-colors flex items-center justify-center">
      <MessageCircle className="w-6 h-6" />

      {globalUnreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 rounded-full flex items-center justify-center px-1 animate-pulse border-2 border-bg">
          {globalUnreadCount > 99 ? "99+" : globalUnreadCount}
        </span>
      )}
    </Link>
  );
}