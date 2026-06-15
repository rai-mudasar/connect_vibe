"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export default function Topbar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="h-14 bg-card dark:bg-gray-800 border-b border-border flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Spacer for mobile hamburger */}
      <div className="w-10 md:hidden" />

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-label rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-label2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-secondary placeholder-label2 outline-none w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Notification bell */}
        <button className="relative p-2 text-label hover:text-label2 rounded-lg hover:bg-label">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 rounded-lg hover:bg-label  p-1.5 transition cursor-pointer group">
                <Avatar className="w-10 h-10 border md:border-0 border-border bg-label">
                  <SafeImage
                    src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                    fill
                    alt="User Profile Image"
                    className="object-contain"
                  />
                  <AvatarFallback className={'text-md font-bold'}>{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-label group-hover:text-label2 hidden sm:block">
                  {user?.firstName + " " + user.lastName}
                </span>
                <svg className="w-4 h-4 text-label group-hover:text-label2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={"w-50 bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl shadow-lg z-50 py-1 mr-5"}>
              <DropdownMenuItem>
                <Link href={'/home'} className="px-2 py-2 border-b border-border dark:border-gray-700 hover:bg-label rounded-md cursor-pointer">
                  <p className="text-xs font-semibold text-secondary truncate">{user?.firstName + " " + user?.lastName}</p>
                  <p className="text-xs text-label2 dark:text-gray-400 truncate">{user?.email}</p>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-secondary hover:bg-label rounded-md cursor-pointer"
                >
                  <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                  <p>Log out</p>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
