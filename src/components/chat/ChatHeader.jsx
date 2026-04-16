'use client'

import Link from 'next/link'
import SafeImage from '../SafeImage'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getConversationsById } from '@/actions/chatActions'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'

export default function ChatHeader({ conversationId }) {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const { data: conversation } = useQuery({
        queryKey: ['conversation', conversationId],
        queryFn: () => getConversationsById(conversationId),
        initialData: () => {
            const conversations = queryClient.getQueryData(['conversations']);
            return conversations?.find((c) => c._id === conversationId);
        },
        staleTime: 1000 * 60,
    });

    const chattingUser = useMemo(() => {
        if (!conversation || !session?.user?.id) return null;
        return conversation?.participants?.find(p => p._id !== session.user.id);
    }, [conversation, session?.user?.id]);

    return (
        <div className="w-full h-18 flex flex-row items-center px-3 bg-gray-100 shadow-sm/30">
            <div className="w-full h-full flex flex-row items-center gap-2">
                <Link
                    href={'/chat'}
                    className="font-semibold text-lg text-gray-600 cursor-pointer">
                    <div className="flex justify-center items-center md:mt-1">
                        <ArrowLeft className="w-5 md:w-6 h-5 md:h-6 ml-1 md:ml-0" />
                    </div>
                </Link>

                <Avatar className="w-10 h-10 bg-neutral-300 ml-1 md:ml-4">
                    <SafeImage
                        src={chattingUser?.profileImageUrl || null}
                        fill
                        alt="User Profile Image"
                        className="object-contain"
                    />
                    <AvatarFallback className={'text-md font-bold'}>
                        {chattingUser?.firstName?.[0] || "?"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xl md:text-2xl font-semibold">
                        {chattingUser ? `${chattingUser.firstName} ${chattingUser.lastName}` : "Loading..."}
                    </p>
                    <p className="text-[12px] ml-2 -mt-1 text-neutral-600">
                        {chattingUser?.bio || "No bio available"}
                    </p>
                </div>
            </div>

            <div className="cursor-pointer">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="h-8.5 flex justify-center items-center md:pt-2 text-gray-600 cursor-pointer border-0">
                            <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={'bg-white'}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                            Delete Conversation
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}