"use client";

import { pusherClient } from "@/lib/pusher";
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from "react";
import { sendMessage, markMessagesAsRead, fetchMoreMessages } from '@/actions/chatActions';

export default function ChatInterface({
  conversationId,
  currentLoggedInUserId,
  initialChatMessages,
  initialHasMore,
}) {
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputMessage, setInputMessage] = useState('');
  
  // INFINITE SCROLL FIX: Local structural control flags
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: session } = useSession();
  const scrollRef = useRef(null);
  
  // INFINITE SCROLL FIX: Native scroll positioning anchor pointers
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const isInitialMount = useRef(true);

  // Synchronize state props across route updates
  useEffect(() => {
    setMessages(initialChatMessages);
    setHasMore(initialHasMore); 
    setInputMessage('');
    isInitialMount.current = true;
  }, [initialChatMessages, initialHasMore, conversationId]);

  // Mark all messages as READ on chat open
  useEffect(() => {
    if (!conversationId || !currentLoggedInUserId) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.senderId !== currentLoggedInUserId ? { ...msg, isRead: true } : msg
      )
    );

    markMessagesAsRead(conversationId, currentLoggedInUserId);
  }, [conversationId, currentLoggedInUserId]);

  // INFINITE SCROLL FIX: Auto scroll down exclusively on baseline mounts or message outlays
  useEffect(() => {
    if (messages.length > 0 && isInitialMount.current) {
      scrollRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialMount.current = false;
    }
  }, [messages]);

  // INFINITE SCROLL FIX: Execution loop capturing sentinel visibility intersections
  useEffect(() => {
    if (!conversationId || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          const container = containerRef.current;
          if (!container) return;

          // 1. Capture spatial context height prior to expansion
          const scrollHeightBefore = container.scrollHeight;
          setIsLoadingMore(true);

          // 2. Derive cursor target parameter using the oldest standard non-optimistic item index
          const oldestMessage = messages.find(m => !m.isOptimistic);
          if (!oldestMessage) {
            setIsLoadingMore(false);
            return;
          }

          const response = await fetchMoreMessages(conversationId, oldestMessage._id);

          if (response.success && response.data) {
            const fetchedMessages = response.data.messages.reverse();
            
            // 3. Prevent structural race drops or payload interleaving updates 
            setMessages((prev) => {
              const uniqueNew = fetchedMessages.filter(
                (newMsg) => !prev.some((oldMsg) => oldMsg._id === newMsg._id)
              );
              return [...uniqueNew, ...prev];
            });
            
            setHasMore(response.data.hasMore);

            // 4. Recalculate layout constraints during render ticks to re-anchor positioning height
            requestAnimationFrame(() => {
              const scrollHeightAfter = container.scrollHeight;
              container.scrollTop = scrollHeightAfter - scrollHeightBefore;
            });
          }
          setIsLoadingMore(false);
        }
      },
      { root: containerRef.current, threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [conversationId, messages, hasMore, isLoadingMore]);

  // Handle Real-Time WebSockets
  useEffect(() => {
    if (!conversationId) return;
    const channel = pusherClient.subscribe(conversationId);

    const handleNewMessage = (payload) => {
      if (payload.newMessage.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (prev.find((mes) => mes._id === payload.newMessage._id)) return prev;

        const filtered = prev.filter(
          (mes) => !(mes.isOptimistic && mes.text === payload.newMessage.text && mes.senderId === payload.newMessage.senderId)
        );

        return [...filtered, payload.newMessage];
      });

      if (payload.newMessage.senderId !== currentLoggedInUserId) {
        markMessagesAsRead(conversationId, currentLoggedInUserId);
      }
      
      requestAnimationFrame(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };

    channel.bind("newMessage", handleNewMessage);

    return () => {
      channel.unbind("newMessage", handleNewMessage);
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId, currentLoggedInUserId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !session?.user?.id) return;

    const messageText = inputMessage;
    setInputMessage("");

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      conversationId,
      senderId: session.user.id,
      text: messageText,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    const response = await sendMessage(conversationId, session.user.id, messageText);

    if (response?.success && response?.data) {
      if (response.data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempId ? response.data : msg))
        );
      }
    } else {
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <div ref={sentinelRef} className="h-2 w-full text-secondary flex items-center justify-center text-xs text-muted-foreground">
          {isLoadingMore && "Loading previous messages..."}
        </div>

        {messages &&
          messages.map((msg) => {
            const isMe = msg.senderId === currentLoggedInUserId;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`wrap-break-word py-2 px-4 rounded-2xl max-w-[70%] transition-opacity duration-200 ${isMe
                    ? "bg-card text-white border border-border rounded-tr-none"
                    : "bg-secondary text-black border border-border rounded-tl-none"
                    } ${msg.isOptimistic ? "opacity-50 italic" : "opacity-100"}`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        <div ref={scrollRef} />
      </div>

      <div className="shrink-0 p-4 flex gap-2 bg-card border-t border-border shadow-sm">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 px-4 bg-gray-200 text-black rounded-full outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
        <button
          onClick={handleSendMessage}
          className="bg-primary text-secondary px-6 py-2 rounded-full font-medium uppercase hover:bg-primary/90 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}