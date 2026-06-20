import ChatInterface from './ChatInterface'

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatInterfaceWrapper({ conversationId, preFetchedData }) {
    // Consume already fetched data directly handed down via parent structure
    const response = preFetchedData;

    const currentLoggedInUserId = response.success ? response?.data?.currentLoggedInUserId : null;
    const messages = response.success ? response?.data?.messages.reverse() : [];
    const initialHasMore = response.success ? response?.data?.hasMore : false;

    return (
        <ChatInterface
            key={conversationId} 
            conversationId={conversationId}
            currentLoggedInUserId={currentLoggedInUserId}
            initialChatMessages={messages}
            initialHasMore={initialHasMore}
        />
    )
}