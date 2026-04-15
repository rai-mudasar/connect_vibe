import { Suspense } from "react";
import ChatSdebarWrapper from "@/components/chat/ChatSdebarWrapper";
import ChatSidebarSkeleton from "@/components/chat/ChatSidebarSkeleton";

export default function ChatLayout({ children }) {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      <Suspense fallback={<ChatSidebarSkeleton />}>
        <ChatSdebarWrapper />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}
