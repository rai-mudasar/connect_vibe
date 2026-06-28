"use client"

import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { ChevronDown, House, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Topbar({ user }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-14 bg-bg-white1 dark:bg-gray-800 border-b border-border flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Spacer for mobile hamburger */}
      <div className="w-10 md:hidden" />

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-bg-gray2 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-text2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-text1 placeholder:text-text2 outline-none w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="relative">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild >
              <div className="w-17.5 md:w-20 p-[0.5px] border border-border md:p-px bg-bg-gray2 rounded-[19px] flex flex-row cursor-pointer items-center justify-between"
              >
                <Avatar className="w-9 md:w-10 h-9 md:h-10 border border-border bg-bg-gray2">
                  <SafeImage
                    src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                    fill
                    alt="User Profile Image"
                    className="object-contain"
                  />
                  <AvatarFallback className={'text-[22px] text-text2 font-bold'}>{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <ChevronDown className={`w-5 md:w-7 text-text2 duration-300 mr-1 ${open === true ? "rotate-180" : "text-red-500"}`} />
                </div>
              </div>
            </DropdownMenuTrigger>

            {open && <div className="fixed inset-0 bg-black/40 z-20"></div>}

            <DropdownMenuContent className={'z-50 bg-bg-white1 backdrop-blur-xl shadow-2xl border-border rounded-xl text-text2 mr-5 md:mr-17 flex flex-col'}>
              <DropdownMenuItem className={'w-60 md:w-70'}>
                <div className="bg-bg-gray2 border-2 border-primary rounded-full">
                  <Avatar className="w-15 h-15 border-2 border-bg-white1 bg-bg-gray2">
                    <SafeImage
                      src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                      fill
                      alt="User Profile Image"
                      className="object-contain"
                    />
                    <AvatarFallback className={'text-[22px] text-text1 font-bold'}>{user?.firstName?.[0] + user?.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-bold">{user?.firstName + " " + user.lastName}</p>
                  <p className="text-[9px] text-text2">{"@" + user?.username}</p>
                  <p className="text-[9px] text-text2">{user?.email}</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className={''}>
                <p className="text-[10px] text-text2 tracking-widest uppercase">Account</p>
                <div className="w-full h-px bg-card"></div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpen(!open)}>
                <Link href={'/home'} className={`flex w-full h-10 pl-2 rounded-lg cursor-pointer flex-row items-center gap-2 hover:bg-bg-gray-hover hover:text-text1 font-semibold`}>
                  <div className="rounded-md bg-bg-gray2 p-1.5">
                    <House className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <p>Home</p>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className={'mt-3'}>
                <p className="text-[10px] text-text2 tracking-widest uppercase">Others</p>
                <div className="w-full h-px bg-card"></div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpen(!open)}>
                <button onClick={() => signOut()} className="w-full h-10 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 hover:bg-bg-gray-hover hover:text-text1 font-semibold">
                  <div className="rounded-md bg-bg-gray2 p-1.5">
                    <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <p>Log Out</p>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
