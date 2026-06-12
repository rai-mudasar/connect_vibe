import ChatHeader from "@/components/chat/ChatHeader";
import { Suspense } from "react";
import ChatInterfaceWrapper from "@/components/chat/ChatInterfaceWrapper";
import ChatFooter from "@/components/chat/ChatFooter";
import Loading from "@/components/Loading";

export default async function ConversationPage({ params }) {
  const { conversationId } = await params;

  return (
    <div className="w-screen sm:w-[calc(100vw-320px)] h-dvh flex flex-col overflow-hidden">

      <ChatHeader conversationId={conversationId} />

      <div className="flex-1 overflow-y-auto bg-bg hide-scrollbar">
        <Suspense fallback={<Loading className={'bg-bg'} />}>
          <ChatInterfaceWrapper conversationId={conversationId} />
        </Suspense>
      </div>

      <ChatFooter conversationId={conversationId} />
    </div>
  );
}
