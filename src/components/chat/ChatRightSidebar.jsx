"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { usePresence } from "@/context/PresenceContext";
import SafeImage from "../SafeImage";

export default function ChatRightSidebar({ friendsList, onFriendClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { onlineUsers } = usePresence();

  const filteredFriends = friendsList.filter((friend) =>
    `${friend.firstName} ${friend.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="hidden lg:flex flex-col w-70 xl:w-72 h-[calc(100vh-56px)] sticky top-14 right-0 bg-bg-gray1 p-4 overflow-y-auto select-none dynamic-scrollbar">

      <div className="w-full h-full bg-bg-gray1/80 absolute"></div>
      <div className="flex justify-between items-center text-text2 mb-4">
        <h2 className="text-md font-bold text-text1">Quick Contacts</h2>
      </div>

      <div className="relative flex items-center mb-4">
        <Search className="absolute left-3 w-3.5 h-3.5 text-text2" />
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-9 bg-bg-gray2 border-none rounded-full text-xs placeholder:text-text2 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="flex-1 space-y-1">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => {
            const isOnline = onlineUsers?.includes(friend._id.toString());
            return (
              < div
                key={friend._id}
                onClick={() => onFriendClick(friend)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-gray-hover cursor-pointer transition-colors w-full group"
              >
                <div className="relative">
                  <Avatar className="w-9 h-9 border border-border bg-bg-gray2">
                    <div className="h-full w-full bg-bg-gray1 absolute"></div>
                    <SafeImage src={friend?.profileImageUrl || null} fill alt="" className="object-cover rounded-full" />
                    <AvatarFallback className="text-xs font-bold">{friend?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-bg-white1 rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text1 truncate transition-colors">
                    {`${friend?.firstName} ${friend?.lastName}`}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-xs text-text2">No contacts found</div>
        )}
      </div>
    </aside >
  );
}  