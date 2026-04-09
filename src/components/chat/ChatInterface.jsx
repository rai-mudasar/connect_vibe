"use client";
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "@/actions/chatActions";
import { pusherClient } from "@/lib/pusher";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function ChatInterface({
  conversationId,
  currentLoggedInUser,
  initialChatData,
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialChatData.messages);
  const [inputMessage, setInputMessage] = useState("");
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const tempInputMessage = inputMessage;
    setInputMessage("");
    await sendMessage(conversationId, currentLoggedInUser.id, tempInputMessage);
  };

  return (
    <div className="w-full h-full fixed inset-0 z-50 sm:z-0 flex flex-col rounded-lg bg-white shadow-sm sm:relative">
      <div className="w-full h-18 flex flex-row items-center border-b px-3 bg-neutral-100">
        <div className="w-full h-full flex flex-row items-center gap-2">
          <button
            className="font-semibold text-lg text-gray-600 cursor-pointer"
            onClick={() => router.push("/chat")}>
            <div className="h-8.5 flex justify-center items-center md:pt-1">
              <ChevronLeft className="w-5 md:w-6 h-5 md:h-6" strokeWidth={2.5} />
            </div>
          </button>
          <p className="text-xl md:text-2xl font-semibold">{`${initialChatData.chattingUser.firstName} ${initialChatData.chattingUser.lastName}`}</p>
        </div>

        <div className="cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger >
              <div className="h-8.5 flex justify-center items-center md:pt-2 text-gray-600 cursor-pointer border-0">
                <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={'bg-white absolute -top-1 right-1'}>
              <DropdownMenuItem>
                <div className="w-full cursor-pointer hover:underline">
                  More
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.senderId === currentLoggedInUser.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] ${msg.senderId === currentLoggedInUser.id
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
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
