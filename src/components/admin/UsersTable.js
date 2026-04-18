"use client"

import Image from "next/image"
import { useState } from "react"
import { deleteUserById, updateUserStatus } from "@/actions/adminAction"
import { Avatar, AvatarFallback } from "../ui/avatar"
import SafeImage from "../SafeImage"

export default function UsersTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(null)

  const filtered = users.filter((u) => {
    const matchSearch =
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter ? u.status === statusFilter : true
    return matchSearch && matchStatus
  })

  const handleBanToggle = async (user) => {
    const newStatus = user.status === "active" ? "banned" : "active"
    setLoading(user._id + "-ban")
    try {
      await updateUserStatus(user._id, newStatus)
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
      )
    } catch (e) {
      alert("Failed to update user status")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return
    setLoading(userId + "-del")
    try {
      await deleteUserById(userId)
      setUsers((prev) => prev.filter((u) => u._id !== userId))
    } catch (e) {
      alert("Failed to delete user")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 flex-1 max-w-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 outline-none border-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
        <span className="text-sm text-gray-400 dark:text-gray-500 self-center">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">User</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Posts</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden lg:table-cell">Joined</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 md:w-8 h-8 md:h-8 border-3 md:border-0 border-white bg-neutral-300">
                        <SafeImage
                          src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                          fill
                          alt="User Profile Image"
                          className="object-contain"
                        />
                        <AvatarFallback className={'text-md font-bold'}>{user?.firstName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.firstName + " " + user.lastName}</p>
                        {(user.role === 'admin') && (
                          <span className="text-xs text-[#1877f2] dark:text-blue-400 font-medium">Admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{user.email}</td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300 hidden md:table-cell">{user.postCount || 0}</td>
                  <td className="px-6 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${!user.isBanned
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBanToggle(user)}
                        disabled={loading === user._id + "-ban" || user.isAdmin}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        {loading === user._id + "-ban" ? "..." : user.isBanned ? "Unban" : "Ban"}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={loading === user._id + "-del" || (user.role === 'admin')}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        {loading === user._id + "-del" ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
