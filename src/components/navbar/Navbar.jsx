"use client";

import {
  House,
  Users2,
  MessageCircle,
  User2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FacebookSearchDialog } from "../FacebookSearchDialog";
import Link from "next/link";
import AccountMenu from "./AccountMenu";
import NotificationDrawer from "../notification/NotificationDrawer";
import ChatNavbarBadge from "../chat/ChatNavbarBadge";

export default function Navbar({ loggedInUser, notifications, isAdmin, initialUnreadMessageCount }) {
  const pathname = usePathname();

  const navLinks = [
    { icon: <House />, name: "Home", href: "/home" },
    { icon: <Users2 />, name: "Friends", href: "/friends" },
    {
      icon: <User2Icon />,
      name: "Profile",
      href: loggedInUser?.username ? `/profile/${loggedInUser.username}` : '#',
    },
  ];

  return (
    <nav className="w-full md:h-14 pt-1 md:pt-0 px-3 bg-card dark:bg-[#252728] flex flex-col md:flex-row items-center justify-around shadow-sm fixed z-50">

      <section className="w-full md:w-[25%] flex flex-row gap-2 items-center cursor-pointer mt-2 md:mt-0">
        <p className="text-[22px] text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
        <div className="hidden lg:flex">
          <FacebookSearchDialog />
        </div>
      </section>

      <section className="w-full md:[60%] mt-1 md:mt-0 flex justify-around md:justify-evenly">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${isActive
                ? "text-primary border-b-2 border-primary"
                : "text-label hover:primary"
                } hover:text-primary hover:border-b-2 border-primary py-2 font-medium transition-colors px-1 text-sm ${link.className}`}
            >
              {link.icon}
            </Link>
          );
        })}
        <div className="flex lg:hidden">
          <ChatNavbarBadge initialCount={initialUnreadMessageCount} loggedInUserId={loggedInUser?._id} />
        </div>
      </section>

      <section className="w-[45%] md:w-[25%] pt-1 md:pt-0 absolute md:relative top-1 right-2 flex items-center justify-end gap-2 md:gap-4 mr-1">
        <div className="lg:hidden">
          <FacebookSearchDialog />
        </div>
        <div className="w-9 md:w-10 h-9 md:h-10  bg-bg hover:bg-primary text-primary hover:text-secondary border border-border rounded-full cursor-pointer hidden lg:inline-flex justify-center items-center"
        >
          <ChatNavbarBadge initialCount={initialUnreadMessageCount} loggedInUserId={loggedInUser?._id} />
        </div>

        <NotificationDrawer
          initialNotifications={notifications}
          loggedInUserId={loggedInUser?._id}
        />
        <AccountMenu loggedInUser={loggedInUser} isAdmin={isAdmin} />
      </section>
    </nav>
  );
}
