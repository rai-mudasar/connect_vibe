import { Suspense } from "react";
import ChatSidebarSkeleton from "@/components/chat/ChatSidebarSkeleton";
import ChatSidebarWrapper from "@/components/chat/ChatSidebarWrapper";

export default function ChatLayout({ children }) {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      <Suspense fallback={<ChatSidebarSkeleton />}>
        <ChatSidebarWrapper />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  );
}