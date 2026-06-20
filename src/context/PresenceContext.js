"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";

const PresenceContext = createContext({ onlineUsers: [] });

export function PresenceProvider({ children }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const loggedInUserId = session.user.id;
    const presenceChannel = pusherClient.subscribe("presence-global-users");

    presenceChannel.bind("pusher:subscription_succeeded", (members) => {
      const activeIds = [];
      members.each((member) => activeIds.push(member.id));
      setOnlineUsers(activeIds);
    });

    presenceChannel.bind("pusher:member_added", (member) => {
      setOnlineUsers((prev) => [...new Set([...prev, member.id])]);
    });

    presenceChannel.bind("pusher:member_removed", (member) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== member.id));
    });

    // THE BEACON TRANSMITTER
    const handleVisibilityOrClose = () => {
      // Browser safety layout payload wrapper
      const payload = JSON.stringify({ userId: loggedInUserId });
      
      // Target our specialized lightweight API endpoint
      navigator.sendBeacon("/api/user/last-seen", payload);
    };

    // 1. Tab/Window absolute exit handler
    window.addEventListener("beforeunload", handleVisibilityOrClose);
    
    // 2. Tab switch/Minimize handler (Facebook & WhatsApp also track this for premium idle accuracy)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleVisibilityOrClose();
      }
    });

    return () => {
      handleVisibilityOrClose();
      window.removeEventListener("beforeunload", handleVisibilityOrClose);
      document.removeEventListener("visibilitychange", handleVisibilityOrClose);
      pusherClient.unsubscribe("presence-global-users");
    };
  }, [session, status]);

  return (
    <PresenceContext.Provider value={{ onlineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
}

export const usePresence = () => useContext(PresenceContext);