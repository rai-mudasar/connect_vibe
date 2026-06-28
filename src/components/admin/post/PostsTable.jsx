"use client"

import SafeImage from "@/components/SafeImage"
import { useState } from "react"
import { deletePostById } from "@/actions/postActions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function PostsTable({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(null)

  const handleDelete = async (postId) => {
    if (!confirm("Delete this post permanently?")) return
    setLoading(postId)
    try {
      await deletePostById(postId)
      setPosts((prev) => prev.filter((p) => p._id !== postId))
    } catch (e) {
      alert("Failed to delete post")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-gray2">
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide">Author</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide">Content</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide hidden md:table-cell">Likes</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide hidden md:table-cell">Comments</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide hidden lg:table-cell">Date</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-text2 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border dark:divide-gray-700">
          {posts.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-text2">No posts found</td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id} className="bg-bg-white1 hover:bg-bg-gray-hover transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-border bg-bg-gray2">
                      <SafeImage
                        src={post.author?.profileImageUrl !== "" ? post.author?.profileImageUrl : null}
                        fill
                        alt="User Profile Image"
                        className="object-contain"
                      />
                      <AvatarFallback className={'text-md font-bold'}>{post.author?.firstName?.[0] + post.author?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-text1 whitespace-nowrap">
                      {post.author?.firstName + " " + post.author?.lastName || "Deleted user"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 max-w-xs">
                  <p className="text-text2 truncate">{post.caption || "(No text)"}</p>
                  {post?.media && (
                    <span className="text-xs text-primary">+ image</span>
                  )}
                </td>
                <td className="px-6 py-3 text-text1 hidden md:table-cell">
                  {post.likes?.length || 0}
                </td>
                <td className="px-6 py-3 text-text1 hidden md:table-cell">
                  {post.comments?.length || 0}
                </td>
                <td className="px-6 py-3 text-text2 hidden lg:table-cell whitespace-nowrap">
                  {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={loading === post._id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border text-white bg-primary/80 hover:bg-primary disabled:opacity-40 transition cursor-pointer"
                  >
                    {loading === post._id ? "..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
