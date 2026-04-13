
import Post from "./Post";
import { getPostAllcomments, getPostById } from "@/actions/postActions";

export default async function PostPageWrapper({ params }) {
    
    const { postId } = await params;
    const [postRes, commentRes] = await Promise.all([
        getPostById(postId),
        getPostAllcomments(postId),
    ])

    const fetchedPost = postRes.success ? postRes.data.fetchedPost : null
    const loggedInUser = postRes.success ? postRes.data.loggedInUser : null

    const likes = fetchedPost !== null ? fetchedPost.likes.map(id => id.toString()) : []
    const isLiked = likes.includes(loggedInUser?.id) ? true : false

    const loadedComments = commentRes.success ? commentRes.data : null

    return (
        <Post
            fetchedPost={fetchedPost}
            currentUser={loggedInUser}
            comments={loadedComments}
            likes={likes}
            isLike={isLiked}
        />
    )
}