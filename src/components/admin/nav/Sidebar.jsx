"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/admin/posts",
    label: "Posts",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/friend-requests",
    label: "Friend Requests",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  // {
  //   href: "/admin/reports",
  //   label: "Reports",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
  //       <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  //       <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  //     </svg>
  //   ),
  // },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-bg-gray2 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        className={`fixed top-2.5 left-4 z-30 md:hidden bg-bg-white1 border border-border text-text2 rounded-lg p-2 shadow ${mobileOpen ? "hidden" : ""}`}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg className="w-5 h-5 text-text2 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <aside
        className={`
          fixed md:relative z-20 h-full
          ${mobileOpen ? "left-0" : "-left-full md:left-0"}
          ${collapsed ? "md:w-14" : "md:w-56"}
          w-56 bg-bg-white1 dark:bg-gray-800
          border-r border-border dark:border-gray-700
          flex flex-col transition-all duration-200
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-[13.5px] border-b border-border dark:border-gray-700">
          {!collapsed && (
            <span className="text-xl font-bold text-primary dark:text-primary whitespace-nowrap">
              Admin Panel
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 mx-2 my-2 rounded-lg mb-0.5
                  text-sm transition-colors
                  ${isActive
                    ? "bg-bg-gray-hover text-text1 font-medium"
                    : "text-text2 hover:text-text1 hover:bg-bg-gray-hover"
                  }
                `}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center p-3 border-t border-border dark:border-gray-700 text-text2 hover:text-text1 dark:hover:text-gray-300"
        >
          <svg
            className={`w-5 h-5 transition-transform text-label ${collapsed ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </aside>
    </>
  )
}
