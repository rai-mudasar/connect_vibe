'use client'

import { sendMessage } from '@/actions/chatActions';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

function ChatFooter({ conversationId }) {
    const [inputMessage, setInputMessage] = useState('');
    const { data: session } = useSession()


    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        const tempInputMessage = inputMessage;
        setInputMessage("");
        await sendMessage(conversationId, session?.user?.id, tempInputMessage);
    };

    return (
        <div className="w-full p-4 flex gap-2 bg-card shadow-sm/30">
            <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 bg-bg-gray2 text-text1 rounded-full outline-none focus:border-blue-500 shadow-sm/10 shadow-white"
            />
            <button
                onClick={handleSendMessage}
                className="bg-primary text-white px-4 py-2 rounded-full font-medium uppercase"
            >
                Send
            </button>
        </div>
    )
}

export default ChatFooter