'use client'

import Link from 'next/link'
import SafeImage from '../SafeImage'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import { deleteChatForUser } from '@/actions/chatActions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export default function ChatHeader({ conversationId, initialChatMetadata, currentLoggedInUserId }) {
    const router = useRouter();
    const [conversation, setConversation] = useState(initialChatMetadata);

    const chattingUser = useMemo(() => {
        if (!conversation || !currentLoggedInUserId) return null;
        return conversation?.participants?.find(p => p._id !== currentLoggedInUserId);
    }, [conversation, currentLoggedInUserId]);

    const handleChatDelete = async (chatId) => {
        try {
            // OPTIMISTIC UPDATE: Dispatch custom event to notify Sidebar instantly
            const deleteEvent = new CustomEvent('chatDeleted', { detail: { chatId } });
            window.dispatchEvent(deleteEvent);
            
            const response = await deleteChatForUser(chatId);
            if (response.success) {
                router.refresh();
                toast.success('Chat deleted');
                router.replace('/chat');
            } else {
                toast.error(`Error: ${response.message || 'Failed to delete'}`);
                router.refresh();
            }
        } catch (error) {
            toast.error(`Error: ${error.message || error}`);
        }
    }

    return (
        <div className="w-full h-18 flex flex-row items-center px-3 bg-card border-b border-border shadow-sm/30">
            <div className="w-full h-full flex flex-row items-center gap-2">
                <Link href={'/chat'} className="font-semibold text-lg text-label cursor-pointer">
                    <div className="flex justify-center items-center md:mt-1">
                        <ArrowLeft className="w-5 md:w-6 h-5 md:h-6 ml-1 md:ml-0" />
                    </div>
                </Link>

                <Avatar className="w-10 h-10 bg-bg-gray2 border-border ml-1 md:ml-4">
                    <SafeImage
                        src={chattingUser?.profileImageUrl || null}
                        fill
                        alt="User Profile Image"
                        className="object-contain"
                    />
                    <AvatarFallback className={'text-md font-bold text-primary'}>
                        {chattingUser?.firstName?.[0] + chattingUser?.lastName?.[0] || "?"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xl text-primary md:text-2xl font-semibold ">
                        {chattingUser ? `${chattingUser.firstName} ${chattingUser.lastName}` : "Loading..."}
                    </p>
                    <p className="text-[12px] ml-2 -mt-1 text-text2 italic">
                        "{chattingUser?.bio || "No bio available"}"
                    </p>
                </div>
            </div>

            <div className="cursor-pointer">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="h-8.5 flex justify-center items-center md:pt-2 text-text2 cursor-pointer border-0">
                            <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={'bg-bg-white1 border-border'}>
                        <DropdownMenuItem className="cursor-pointer text-text2 hover:text-text1">
                            <button onClick={() => handleChatDelete(conversationId)}>
                                Delete Conversation
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}