import { Suspense } from "react";
import PostPageWrapper from "@/components/post/PostPageWrapper";
import Loading from "@/components/Loading";

export default function PostPage({params}) {
    
    return (
        <Suspense fallback={<p></p>} >
            <PostPageWrapper params={params} />
        </Suspense>
    )
}