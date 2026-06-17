"use client";

import { pusherClient } from "@/lib/pusher";
import { useState, useEffect, useRef } from "react";
import { sendMessage, markMessagesAsRead } from '@/actions/chatActions'; // 👈 Import read action
import { useSession } from 'next-auth/react';

export default function ChatInterface({
  conversationId,
  currentLoggedInUserId,
  initialChatMessages,
}) {
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputMessage, setInputMessage] = useState('');
  const { data: session } = useSession();
  const scrollRef = useRef(null);

  // 1. Optimistic "Mark as Read" trigger on screen load
  useEffect(() => {
    if (!conversationId || !currentLoggedInUserId) return;

    // OPTIMISTIC UPDATE: Instantly mark all received messages as read in local state
    setMessages((prev) =>
      prev.map((msg) =>
        msg.senderId !== currentLoggedInUserId ? { ...msg, isRead: true } : msg
      )
    );

    // Run the background server action to persist changes in DB & update Pusher Sidebar badges
    markMessagesAsRead(conversationId, currentLoggedInUserId);
  }, [conversationId, currentLoggedInUserId]);

  // Auto scroll down
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen to real-time incoming messages via Pusher
  useEffect(() => {
    if (!conversationId) return;
    const channel = pusherClient.subscribe(conversationId);

    channel.bind("newMessage", (payload) => {
      setMessages((prev) => {
        if (prev.find((mes) => mes._id === payload.newMessage._id)) return prev;

        const filtered = prev.filter(
          (mes) => !(mes.isOptimistic && mes.text === payload.newMessage.text && mes.senderId === payload.newMessage.senderId)
        );

        return [...filtered, payload.newMessage];
      });

      // 👈 If the user is ACTIVELY looking at this screen, instantly auto-read incoming texts
      if (payload.newMessage.senderId !== currentLoggedInUserId) {
        markMessagesAsRead(conversationId, currentLoggedInUserId);
      }
    });

    return () => {
      channel.unbind_all();
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
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? response.data : msg))
      );
    } else {
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((msg) => {
            const isMe = msg.senderId === currentLoggedInUserId;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] transition-opacity duration-200 ${
                    isMe
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