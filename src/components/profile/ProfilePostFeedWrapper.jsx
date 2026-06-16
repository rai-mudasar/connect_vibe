import PostFeed from "../post/PostFeed";
import { getAllPostByAuthorId } from "@/actions/postActions"
import { getLoggedInUserProfile } from "@/actions/userActions";


export default async function ProfilePostFeedWrapper({ params, isPublicView }) {
    const { username } = await params;

    const response = await getLoggedInUserProfile(username)
    const currentProfileUser = response.success ? response.data.loggedInUser : [];
    const isOwnProfile = response.success ? response.data.isOwnProfile : null;


    const postRes = await getAllPostByAuthorId(currentProfileUser._id)
    const allPosts = postRes.success ? postRes.data : [];

    return (
        <PostFeed
            loggedInUser={currentProfileUser}
            allPosts={allPosts}
            isOwnProfile={isPublicView ? false : isOwnProfile}
        />
    )
}