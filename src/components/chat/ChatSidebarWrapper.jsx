import ChatSidebar from "./ChatSidebar";
import { getFriends, getLoggedInUserAllConversations } from "@/actions/chatActions";

export default async function ChatSidebarWrapper() {
  const [conversationsData, friendRes] = await Promise.all([
    getLoggedInUserAllConversations(),
    getFriends()
  ]);

  const initialConversations = Array.isArray(conversationsData) ? conversationsData : [];
  const friends = friendRes.success ? friendRes.data.friends : [];
  const loggedInUserId = friendRes.success ? friendRes.data.loggedInUserId : null;

  return (
    <ChatSidebar
      friends={friends}
      loggedInUserId={loggedInUserId}
      initialConversations={initialConversations}
    />
  );
}