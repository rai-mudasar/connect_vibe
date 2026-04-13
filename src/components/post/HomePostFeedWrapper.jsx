import PostFeed from "./PostFeed";
import { getAllPosts } from "@/actions/postActions";
import { getLoggedInUser } from "@/actions/userActions";

export default async function HomePostFeedWrapper() {
    const [loggedInUserResponse, allPostsResponse] = await Promise.all([
        getLoggedInUser(),
        getAllPosts(),
    ])

    const loggedInUser = loggedInUserResponse.success ? loggedInUserResponse.data : [];
    const allPosts = allPostsResponse.success ? allPostsResponse.data : [];

    return (
        <PostFeed
            loggedInUser={loggedInUser}
            allPosts={allPosts}
            isOwnProfile={true}
        />
    )
}