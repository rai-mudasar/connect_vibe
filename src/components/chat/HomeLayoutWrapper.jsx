"use client";

import { useState } from "react";
import ChatBoxWindow from "@/components/chat/ChatBoxWindow";
import ChatRightSidebar from "@/components/chat/ChatRightSidebar";
import LeftSidebar from "../leftSidebar/LeftSidebar";

export default function HomeLayoutWrapper({ children, loggedInUser, friends }) {
    const [activeChats, setActiveChats] = useState([]);

    const handleOpenChat = (friend) => {
        if (activeChats.some((chat) => chat._id === friend._id)) return;

        setActiveChats((prev) => {
            const updated = [...prev, friend];
            if (updated.length > 3) updated.shift();
            return updated;
        });
    };

    const handleCloseChat = (friendId) => {
        setActiveChats((prev) => prev.filter((chat) => chat._id !== friendId));
    };

    return (
        <div className="min-h-screen bg-bg-gray1 flex flex-col relative">
            <div className="flex flex-row pt-14 justify-between w-full max-w-480">

                <div className="hidden md:block md:min-w-70 md:w-[23%]">
                    <LeftSidebar loggedInUser={loggedInUser} />
                </div>


                <main className="flex-1 min-w-0 max-w-2xl xl:max-w-170 px-4">
                    {children}
                </main>

                <ChatRightSidebar
                    friendsList={friends}
                    onFriendClick={handleOpenChat}
                />

            </div>

            <div className="fixed bottom-0 right-70 xl:right-77.5 flex flex-row-reverse items-end gap-3 z-50 pointer-events-auto">
                {activeChats.map((friend) => (
                    <ChatBoxWindow
                        key={friend._id}
                        friend={friend}
                        loggedInUser={loggedInUser}
                        onClose={() => handleCloseChat(friend._id)}
                    />
                ))}
            </div>
        </div>
    );
}