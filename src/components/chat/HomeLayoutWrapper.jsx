"use client";

import { useState } from "react";
import ChatBoxWindow from "@/components/chat/ChatBoxWindow";
import ChatRightSidebar from "@/components/chat/ChatRightSidebar";
import LeftSidebar from "../leftSidebar/LeftSidebar";
import { useMediaQuery } from 'react-responsive'

export default function HomeLayoutWrapper({ children, loggedInUser, friends }) {
    const [activeChats, setActiveChats] = useState([]);
    const [activeChatsLength, setActiveChatsLength] = useState(3);

    const isMd = useMediaQuery({ minWidth: 768 });
    const isLg = useMediaQuery({ minWidth: 880 });
    const isXl = useMediaQuery({ minWidth: 1200 });

    const handleOpenChat = (friend) => {
        if (activeChats.some((chat) => chat._id === friend._id)) return;

        if(isMd) setActiveChatsLength(1);
        if(isLg) setActiveChatsLength(2);
        if(isXl) setActiveChatsLength(3);

        setActiveChats((prev) => {
            const updated = [...prev, friend];
            if (updated.length > activeChatsLength) updated.shift();
            return updated;
        });
    };

    const handleCloseChat = (friendId) => {
        setActiveChats((prev) => prev.filter((chat) => chat._id !== friendId));
    };

    return (
        <div className={`min-h-screen bg-bg-gray1 flex flex-col relative md:${() => setActiveChatsLength(1)}`}>
            <div className="flex flex-row pt-14 justify-between w-full max-w-480">

                <div className="hidden lg:block md:min-w-70 md:w-[23%]">
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