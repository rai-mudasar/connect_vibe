"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/actions/chatActions";
import { User, MessageSquarePlus } from "lucide-react";
import SafeImage from "../SafeImage";

export default function ChatSidebar({
  loggedInUserTotalChats,
  friends,
  loggedInUserId,
}) {
  const pathname = usePathname();
  const isChatting = pathname.split("/").length > 2;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOpenOrStartChat = async (targetUserId) => {
    setLoading(true);
    try {
      const chat = await getOrCreateConversation(loggedInUserId, targetUserId);
      router.push(`/chat/${chat._id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${isChatting ? "hidden md:flex" : "flex"} w-screen md:w-80 md:h-[calc(100vh-56px)] bg-white flex-col`}
    >
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* --- RECENT CHATS --- */}
        <div className="p-2">
          <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">
            Recent
          </p>
          {loggedInUserTotalChats.length > 0 ? (
            loggedInUserTotalChats.map((chat) => {
              const otherUser = chat.participants.find(
                (participant) => participant._id !== loggedInUserId,
              );
              return (
                <div
                  key={chat._id}
                  onClick={() => router.push(`/chat/${chat._id}`)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {otherUser?.profileImageUrl ? (
                      <img src={otherUser.profileImageUrl} alt="profile" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {`${otherUser?.firstName} ${otherUser?.lastName}` ||
                        "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage?.text || "Started a conversation"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400 px-2">No recent chats</p>
          )}
        </div>

        {/* --- SEPARATOR --- */}
        <div className="my-4 border-t relative">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-blue-600 flex items-center gap-1">
            <MessageSquarePlus size={14} /> NEW CHAT
          </span>
        </div>

        {/* --- FRIENDS LIST --- */}
        <div className="p-2">
          <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">
            Friends
          </p>
          {friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => handleOpenOrStartChat(friend._id)}
              className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* <User size={20} className="text-gray-400 group-hover:text-blue-500" /> */}
                <SafeImage
                  src={friend.profileImageUrl}
                  alt={"Friend Profile Image"}
                  fill

                />
              </div>
              <p className="font-medium text-gray-700 group-hover:text-blue-600">{`${friend.firstName} ${friend.lastName}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
