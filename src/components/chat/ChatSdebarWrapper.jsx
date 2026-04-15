import ChatSidebar from "./ChatSidebar";
import { getFriends, getLoggedInUserAllConversations } from "@/actions/chatActions";

export default async function ChatSdebarWrapper() {
    const [chatRes, friendRes] = await Promise.all([
        getLoggedInUserAllConversations(),
        getFriends(),
    ]);

    const loggedInUserTotalChats = chatRes.success ? chatRes.data : [];
    const friends = friendRes.success ? friendRes.data.friends : [];
    const loggedInUserId = friendRes.success ? friendRes.data.loggedInUserId : null;

    return (
        <ChatSidebar
            loggedInUserTotalChats={loggedInUserTotalChats}
            friends={friends}
            loggedInUserId={loggedInUserId}
        />
    )
}
