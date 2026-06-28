import { Suspense } from "react";
import Loading from "@/components/Loading";
import PostPageWrapper from "@/components/post/PostPageWrapper";

export default function PostPage({params}) {
    
    return (
        <Suspense fallback={<Loading className={'w-screen h-screen'} />} >
            <PostPageWrapper params={params} />
        </Suspense>
    )
}