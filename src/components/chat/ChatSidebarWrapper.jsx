import ChatSidebar from "./ChatSidebar";
import { getLoggedInUserWithFriends, getLoggedInUserAllConversations } from "@/actions/chatActions";

export default async function ChatSidebarWrapper() {
  const [conversationsData, friendRes] = await Promise.all([
    getLoggedInUserAllConversations(),
    getLoggedInUserWithFriends()
  ]);

  const initialConversations = Array.isArray(conversationsData) ? conversationsData : [];
  const friends = friendRes?.success ? friendRes?.data?.friends : [];
  const loggedInUserId = friendRes?.success ? friendRes?.data?.loggedInUser?._id : null;

  return (
    <ChatSidebar
      friends={friends}
      loggedInUserId={loggedInUserId}
      initialConversations={initialConversations}
    />
  );
}