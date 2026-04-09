import { getInitialChatData } from "@/actions/chatActions";
import ChatInterface from "@/components/chat/ChatInterface";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function ConversationPage({ params }) {
  const { conversationId } = await params;
  const session = await getServerSession(authOptions);
  let initialChatData;

  try {
    const response = await getInitialChatData(conversationId);
    if (!response.success) {
      throw new Error(response.message)
    }

    initialChatData = response.data;

  } catch (error) {
    console.error(`Error : ${error.message || error}`)
  }

  return (
    <div className="w-screen sm:w-[calc(100vw-320px)] h-screen">
      <ChatInterface
        key={conversationId}
        conversationId={conversationId}
        currentLoggedInUser={session.user}
        initialChatData={initialChatData}
      />
    </div>
  );
}
