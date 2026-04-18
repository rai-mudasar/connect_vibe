"use client"

import Image from "next/image"
import { useState } from "react"
import { deletePostById } from "@/actions/postActions"

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
          <tr className="bg-gray-50 dark:bg-gray-700/50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Author</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Content</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Likes</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Comments</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden lg:table-cell">Date</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {posts.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">No posts found</td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    {post.author?.avatar ? (
                      <Image src={post.author.avatar} alt={post.author.name} width={30} height={30} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                        {post.author?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {post.author?.name || "Deleted user"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 max-w-xs">
                  <p className="text-gray-600 dark:text-gray-400 truncate">{post.text || "(No text)"}</p>
                  {post.image && (
                    <span className="text-xs text-blue-500 dark:text-blue-400">+ image</span>
                  )}
                </td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300 hidden md:table-cell">
                  {post.likes?.length || 0}
                </td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300 hidden md:table-cell">
                  {post.comments?.length || 0}
                </td>
                <td className="px-6 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                  {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={loading === post._id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 transition"
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
