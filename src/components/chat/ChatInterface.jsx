"use client";
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "@/actions/chatActions";
import { pusherClient } from "@/lib/pusher";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatInterface({
  conversationId,
  currentUser,
  initialMessages,
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;
    // 1. Subscribe to the specific conversation channel
    const channel = pusherClient.subscribe(conversationId);

    // 2. Bind to the event we defined in the backend
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const tempInput = input;
    setInput("");
    await sendMessage(conversationId, currentUser.id, tempInput);
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] fixed inset-0 z-50 md:relative md:z-0 flex flex-col rounded-lg bg-white shadow-sm">
      <button
        onClick={() => router.push("/chat")}
        className="w-full h-13 border-b md:hidden pl-3 bg-neutral-100"
      >
        <ChevronLeft />
      </button>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                  msg.senderId === currentUser.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t flex gap-2 bg-neutral-100">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
