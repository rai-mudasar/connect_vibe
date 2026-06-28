"use client";

import { toast } from "sonner";
import { pusherClient } from "@/lib/pusher";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getMessagesByFriendId, sendMessage, markMessagesAsRead } from "@/actions/chatActions";
import { X, Minus, Send } from "lucide-react";
import SafeImage from "../SafeImage";

export default function ChatBoxWindow({ friend, loggedInUser, onClose }) {
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadChat() {
      const res = await getMessagesByFriendId(friend._id);
      if (res?.success) {
        setMessages(res?.data?.messages.reverse());
        setConversationId(res?.data?.conversationId);
      } else {
        toast.error(`Getting messages error: ${res?.message}`);
      }
    }
    if (!isMinimized) loadChat();
  }, [friend._id, isMinimized]);

  // Mark all messages as READ on chat open
  useEffect(() => {
    if (!conversationId || !loggedInUser?._id) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.senderId !== loggedInUser._id ? { ...msg, isRead: true } : msg
      )
    );

    markMessagesAsRead(conversationId, loggedInUser._id);
  }, [conversationId, loggedInUser?._id]);

  // Pusher Real-time Synchronization
  useEffect(() => {
    if (!conversationId) return;
    const channel = pusherClient.subscribe(conversationId);

    const handleNewMessage = (payload) => {
      if (payload.newMessage.conversationId !== conversationId) return;

      setMessages((prev) => {
        // Check if message already exists
        if (prev.find((mes) => mes._id === payload.newMessage._id)) return prev;

        // Remove optimistic message with same text from same sender
        const filtered = prev.filter(
          (mes) =>
            !(
              mes.isOptimistic &&
              mes.text === payload.newMessage.text &&
              mes.senderId === payload.newMessage.senderId
            )
        );

        return [...filtered, payload.newMessage];
      });

      // Mark message as read if from other user
      if (payload.newMessage.senderId !== loggedInUser._id) {
        markMessagesAsRead(conversationId, loggedInUser._id);
      }

      // Auto scroll to bottom
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };

    channel.bind("newMessage", handleNewMessage);

    return () => {
      channel.unbind("newMessage", handleNewMessage);
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId, loggedInUser?._id]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message Function
  const handleSendMessage = async () => {
    if (!message.trim() || !loggedInUser?._id) return;
    
    const messageText = message;
    setMessage("");

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      conversationId,
      senderId: loggedInUser._id,
      text: messageText,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    const response = await sendMessage(conversationId, loggedInUser._id, messageText);

    if (response?.success) {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? response.data : msg))
      );
    } else {
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      toast.error(`Message failed with error: ${response?.message}`);
    }
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="w-48 bg-white border border-border shadow-xl rounded-t-xl p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 relative rounded-full overflow-hidden">
            <SafeImage
              src={friend?.profileImageUrl || null}
              fill
              alt=""
              className="object-cover"
            />
          </div>
          <p className="text-xs font-bold text-text1 truncate">
            {friend?.firstName}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-text2 hover:text-red-500"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 h-96 bg-white border border-border shadow-2xl rounded-t-2xl flex flex-col z-90">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-bg-white1 rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="w-7 h-7">
            <SafeImage
              src={friend?.profileImageUrl || null}
              fill
              alt=""
              className="object-cover"
            />
            <AvatarFallback className="text-[10px] font-bold">
              {friend?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs font-bold text-text1 truncate">
            {`${friend?.firstName} ${friend?.lastName}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-text2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:text-text1 p-1"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="hover:text-red-500 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body Area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === loggedInUser._id;
          return (
            <div
              key={msg._id}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs transition-opacity duration-200 ${isMe
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-bg-gray2 text-text1 rounded-tl-none"
                  } ${msg.isOptimistic ? "opacity-50 italic" : "opacity-100"}`}
              >
                <p className="wrap-break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Footer Controls Layout */}
      <div className="p-2 border-t border-border bg-bg-white1 z-50">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Aa"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="w-full bg-bg-gray2 border-none rounded-full pl-3 pr-8 py-1.5 text-xs focus:outline-none text-text1"
          />
          <Send
            onClick={handleSendMessage}
            className="absolute right-2.5 w-4 h-4 text-primary cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>
  );
}