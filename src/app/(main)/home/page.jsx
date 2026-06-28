import { Suspense } from "react";
import Loading from "@/components/Loading";
import HomePostFeedWrapper from "@/components/post/HomePostFeedWrapper";

export default function HomePage() {
  return (
    <div className="w-[calc(100vw-14px) min-h-screen bg-bg-gray1 -mt-12 sm:pt-10 md:pt-2 flex relative">
      <div className="w-screen md:w-150 h-full sm:pt-12 z-20">
        <Suspense fallback={<Loading className={"h-screen md:pl-70"} />}>
          <HomePostFeedWrapper />
        </Suspense>
      </div>
    </div>
  );
}