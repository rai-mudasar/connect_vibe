"use client";

import { pusherClient } from "@/lib/pusher";
import { useState, useEffect, useRef } from "react";

export default function ChatInterface({
  conversationId,
  currentLoggedInUserId,
  initialChatMessages,
}) {
  const [messages, setMessages] = useState(initialChatMessages);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = pusherClient.subscribe(conversationId);

    channel.bind("new-message", (newMessage) => {
      // Avoid duplicating the message if I am the sender
      setMessages((prev) => {
        if (prev.find((mes) => mes._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId]);



  return (
    <div className="p-4 space-y-4">
      {messages &&
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === currentLoggedInUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] ${msg.senderId === currentLoggedInUserId
                ? "bg-blue-600 text-white"
                : "bg-white/80 text-black"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      <div ref={scrollRef} />
    </div>
  );
}
