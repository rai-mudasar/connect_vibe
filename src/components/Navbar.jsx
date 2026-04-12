"use client";

import {
  House,
  Users2,
  MessageCircle,
  User2Icon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FacebookSearchDialog } from "./FacebookSearchDialog";
import NotificationDrawer from "./notification/NotificationDrawer";

export default function NavBar({ loggedInUser, notifications }) {
  const pathname = usePathname();

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

      <section className="w-full md:w-[25%] flex flex-row gap-2 items-center cursor-pointer mt-2 md:mt-0">
        <div className="w-8 md:w-10 h-8 md:h-10 relative">
          <SafeImage
          src="/svg/fb_icon.svg"
          alt="Facebook Icon"
          fill
          className={'w-8 md:w-10 h-8 md:h-10 object-cover'}
        />
        </div>
        <FacebookSearchDialog />
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
                  : "text-gray-600 hover:text-blue-600"
              } px-1 py-2 text-sm font-medium transition-colors`}
            >
              {link.icon}
            </Link>
          );
        })}
      </section>

      <section className="w-[15%] absolute md:relative top-1 right-2 flex items-center justify-end gap-2 mr-3 sm:space-x-2">
        <Link
          href={"/chat"}
          className="p-2 bg-[#F0F2F5] hover:bg-[#1877F2] hover:text-white rounded-full cursor-pointer inline-flex"
        >
          <MessageCircle className="w-5 md:w-6 h-5 md:h-6" />
        </Link>

        <NotificationDrawer
          initialNotifications={notifications}
          loggedInUserId={loggedInUser.id}
        />
        <button onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="w-5 md:w-6 h-5 md:h-6" />
        </button>
      </section>
    </nav>
  );
}
