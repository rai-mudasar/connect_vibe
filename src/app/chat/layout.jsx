import { getLoggedInUserAllConversations, getFriends } from "@/actions/chatActions";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function ChatLayout({ children }) {
  const session = await getServerSession(authOptions);
  const loggedInUserId = session.user.id;

  const loggedInUserTotalChats = await getLoggedInUserAllConversations(loggedInUserId);
  const friends = await getFriends(loggedInUserId);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      <ChatSidebar
        loggedInUserTotalChats={loggedInUserTotalChats}
        friends={friends}
        loggedInUserId={loggedInUserId}
      />

      <main>{children}</main>
    </div>
  );
}
