"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  House,
  Users2,
  Menu,
  MessageCircle,
  X,
  User2Icon,
  LogOut,
  Search,
} from "lucide-react";
import { ActionButton } from "./ui/ActionButton";
import { signOut } from "next-auth/react";

export default function NavBar({ loggedInUser }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const navLinks = [
    { icon: <House />, name: "Home", href: "/home" },
    { icon: <Users2 />, name: "Friends", href: "/friends" },
    {
      icon: <User2Icon />,
      name: "Profile",
      href: `/profile/${loggedInUser.username}`,
    },
  ];

  return (
    <nav className="w-full md:h-14 px-3 bg-[#FFFFFF] dark:bg-[#252728] flex flex-col md:flex-row items-center justify-around shadow-sm fixed z-50">

      {/* For mobiles */}
      <section className="md:hidden w-full flex items-center justify-between px-5 py-2">
        <h1 className="md:hidden text-blue-600 dark:text-white text-2xl font-extrabold">facebook</h1>
        <Link href={"/search"}>
          <Search size={20} className="text-neutral-400 stroke-[2px]"  />
        </Link>
      </section>

      <section className="hidden md:flex w-[25%] gap-2 items-center">
        <Image
          src="/svg/fb_icon.svg"
          alt="Facebook Icon"
          width={40}
          height={40}
        />

        <div className="w-60 h-10 text-[#333334] dark:text-white bg-[#F0F2F5] dark:bg-neutral-700 md:rounded-2xl flex items-center justify-center pl-6 gap-2">
          <Search size={30} className="text-neutral-400 stroke-[2px]" />
          <input
            type="text"
            placeholder="Search Facebook"
            className="bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 w-full h-full text-sm"
          />
        </div>
      </section>

      <section className="w-full md:w-[60%] flex justify-around md:justify-evenly">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              } px-1 py-2 text-sm font-medium transition-colors`}
            >
              {link.icon}
            </Link>
          );
        })}
      </section>

      <section className="w-[15%] hidden md:flex items-center justify-end gap-2 mr-3 sm:space-x-2">
        <Link
          href={"/chat"}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer hidden md:inline-flex"
        >
          <MessageCircle size={20} className="text-black" />
        </Link>
        <ActionButton Icon={Bell} />
        <button onClick={() => signOut()}>
          <LogOut />
        </button>
      </section>
    </nav>
  );
}
