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
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild >
              <div className="w-17.5 md:w-20 p-[0.5px] border border-border md:p-px bg-bg rounded-[19px] flex flex-row cursor-pointer items-center justify-between"
              >
                <Avatar className="w-9 md:w-10 h-9 md:h-10 border border-border bg-bg">
                  <SafeImage
                    src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                    fill
                    alt="User Profile Image"
                    className="object-contain"
                  />
                  <AvatarFallback className={'text-[22px] text-primary font-bold'}>{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <ChevronDown className={`w-5 md:w-7 text-white duration-300 mr-1 ${open === true ? "rotate-180" : "text-red-500"}`} />
                </div>
              </div>
            </DropdownMenuTrigger>

            {open && <div className="fixed inset-0 bg-black/40 z-20"></div>}

            <DropdownMenuContent className={'z-50 bg-bg backdrop-blur-xl shadow-2xl border-border rounded-xl text-secondary mr-5 md:mr-17 flex flex-col'}>
              <DropdownMenuItem className={'w-60 md:w-70'}>
                <div className="bg-bg border-2 border-primary rounded-full">
                  <Avatar className="w-15 h-15 border-2 border-bg bg-bg">
                    <SafeImage
                      src={user?.profileImageUrl !== "" ? user?.profileImageUrl : null}
                      fill
                      alt="User Profile Image"
                      className="object-contain"
                    />
                    <AvatarFallback className={'text-[22px] text-primary font-bold'}>{user?.firstName?.[0] + user?.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-bold">{user?.firstName + " " + user.lastName}</p>
                  <p className="text-[9px] text-label">{"@" + user?.username}</p>
                  <p className="text-[9px] text-label">{user?.email}</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className={''}>
                <p className="text-[10px] text-label tracking-widest uppercase">Account</p>
                <div className="w-full h-px bg-card"></div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpen(!open)}>
                <Link href={'/home'} className={`flex w-full h-10 pl-2 rounded-lg cursor-pointer flex-row items-center gap-2 hover:bg-card/30 hover:text-primary hover:border border-border/30 font-semibold`}>
                  <div className="rounded-md bg-card-active p-1.5">
                    <House className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <p>Home</p>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className={'mt-3'}>
                <p className="text-[10px] text-label tracking-widest uppercase">Others</p>
                <div className="w-full h-px bg-card"></div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpen(!open)}>
                <button onClick={() => signOut()} className="w-full h-10 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 hover:bg-card/30 hover:text-primary hover:border border-border/30 font-semibold">
                  <div className="rounded-md bg-card-active p-1.5">
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
