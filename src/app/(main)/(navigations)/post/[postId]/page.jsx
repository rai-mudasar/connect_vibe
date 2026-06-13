import { Suspense } from "react";
import PostPageWrapper from "@/components/post/PostPageWrapper";
import Loading from "@/components/Loading";

export default function PostPage({params}) {
    
    return (
        <Suspense fallback={<Loading className={'w-screen h-screen'} />} >
            <PostPageWrapper params={params} />
        </Suspense>
    )
}