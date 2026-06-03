import { Suspense } from "react";
import HomePostFeedWrapper from "@/components/post/HomePostFeedWrapper";
import LeftSidebarWrapper from "@/components/leftSidebar/LeftSidebarWrapper";
import LeftSidebarSkeleton from "@/components/leftSidebar/LeftSidebarSkeleton";
import Loading from "@/components/Loading";

export default function HomePage() {
  return (
    <div className="w-[calc(100vw-14px)  bg-bg dark:bg-[#333334] pt-23.5 md:pt-17 flex flex-row gap-2 lg:gap-22 relative">
      <div className="hidden md:block md:min-w-70 md:w-[23%]">
        <Suspense fallback={<LeftSidebarSkeleton />}>
          <LeftSidebarWrapper />
        </Suspense>
      </div>
      <div className="w-screen md:w-150 h-full mx-4 z-20">
        <Suspense fallback={<Loading className={"h-screen md:pl-70"} />}>
          <HomePostFeedWrapper />
        </Suspense>
        <div className="flex md:hidden w-full h-3"></div>
      </div>
    </div>
  );
}
