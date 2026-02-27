import { getMessages } from "@/actions/chatActions";
import ChatInterface from "@/components/chat/ChatInterface";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function ConversationPage({ params }) {
  const { conversationId } = await params;
  const session = await getServerSession(authOptions);

  const initialMessages = await getMessages(conversationId);

  return (
    <ChatInterface
      conversationId={conversationId}
      currentUser={session.user}
      initialMessages={initialMessages}
    />
  );
}
