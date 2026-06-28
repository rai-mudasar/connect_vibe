import ChatHeader from "@/components/chat/ChatHeader";
import { Suspense } from "react";
import ChatInterfaceWrapper from "@/components/chat/ChatInterfaceWrapper";
import Loading from "@/components/Loading";
import { getInitialChatData } from "@/actions/chatActions";
import { redirect } from "next/navigation";

export default async function ConversationPage({ params }) {
  const { conversationId } = await params;

  if (!conversationId) redirect('/chat')
  const response = await getInitialChatData(conversationId);

  if (!response || !response.success || !response.data?.conversationMetadata) {
    redirect('/chat');
  }

  const chatMetadata = response.success ? response?.data?.conversationMetadata : null;
  const currentLoggedInUserId = response.success ? response?.data?.currentLoggedInUserId : null;

  return (
    <div className="w-screen sm:w-[calc(100vw-320px)] h-dvh flex flex-col overflow-hidden">
      <div className="shrink-0">
        <ChatHeader
          conversationId={conversationId}
          initialChatMetadata={chatMetadata}
          currentLoggedInUserId={currentLoggedInUserId}
        />
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <Suspense fallback={<Loading />}>
          <ChatInterfaceWrapper
            conversationId={conversationId}
            preFetchedData={response}
          />
        </Suspense>
      </div>
    </div>
  );
}