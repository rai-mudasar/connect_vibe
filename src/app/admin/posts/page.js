import { getPosts } from "@/actions/adminAction"
import PostsTable from "@/components/admin/PostsTable"



export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Post Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Browse and delete posts from your platform.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <PostsTable initialPosts={posts} />
      </div>
    </div>
  )
}
