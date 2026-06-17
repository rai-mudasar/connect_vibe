import ChatSidebar from "./ChatSidebar";
import getQueryClient from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getFriends, getLoggedInUserAllConversations } from "@/actions/chatActions";

export default async function ChatSidebarWrapper() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['conversations'], 
    queryFn: async () => await getLoggedInUserAllConversations(),
  });

  const friendRes = await getFriends();

  const friends = friendRes.success ? friendRes.data.friends : [];
  const loggedInUserId = friendRes.success ? friendRes.data.loggedInUserId : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatSidebar
        friends={friends}
        loggedInUserId={loggedInUserId}
      />
    </HydrationBoundary>
  );
}