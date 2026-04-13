import { getAllPostByAuthorId } from "@/actions/postActions"
import PostFeed from "./PostFeed";


export default async function ProfilePostFeed({ currentProfileUser, isOwnProfile }) {

    const response = await getAllPostByAuthorId(currentProfileUser._id)
    const allPosts = response.success ? response.data : [];

    return (
        <PostFeed
            loggedInUser={currentProfileUser}
            allPosts={allPosts}
            isOwnProfile={isOwnProfile}
        />
    )
}