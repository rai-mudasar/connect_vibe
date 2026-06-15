import { getPosts } from "@/actions/adminActions"
import PostsTable from "@/components/admin/post/PostsTable"



export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Post Management</h1>
        <p className="text-sm text-label mt-1">
          Browse and delete posts from your platform.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <PostsTable initialPosts={posts} />
      </div>
    </div>
  )
}
