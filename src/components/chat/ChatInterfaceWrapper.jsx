
import ChatInterface from './ChatInterface'
import { getInitialChatData } from '@/actions/chatActions';

export default async function ChatInterfaceWrapper({ conversationId }) {
    const response = await getInitialChatData(conversationId);

    const currentLoggedInUserId = response.success ? response?.data?.currentLoggedInUserId : null;
    const messages = response.success ? response?.data?.messages : [];

    return (
        <ChatInterface
            conversationId={conversationId}
            currentLoggedInUserId={currentLoggedInUserId}
            initialChatMessages={messages}
        />
    )
}