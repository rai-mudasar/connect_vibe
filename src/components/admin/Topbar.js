"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import SafeImage from "../SafeImage"

export default function Topbar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Spacer for mobile hamburger */}
      <div className="w-10 md:hidden" />

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Notification bell */}
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 transition"
          >
            <Avatar className="w-8 md:w-8 h-8 md:h-8 border-3 md:border-0 border-white bg-neutral-300">
              <SafeImage
                src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                fill
                alt="User Profile Image"
                className="object-contain"
              />
              <AvatarFallback className={'text-md font-bold'}>{user?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {user?.firstName + " " + user.lastName}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-1">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
