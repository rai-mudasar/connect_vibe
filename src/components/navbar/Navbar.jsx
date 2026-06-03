"use client";

import {
  House,
  Users2,
  MessageCircle,
  User2Icon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FacebookSearchDialog } from "../FacebookSearchDialog";
import NotificationDrawer from "../notification/NotificationDrawer";
import AccountMenu from "./AccountMenu";

export default function Navbar({ loggedInUser, notifications }) {
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
    <nav className="w-full md:h-14 px-3 bg-card dark:bg-[#252728] flex flex-col md:flex-row items-center justify-around shadow-sm fixed z-50">

      <section className="w-full md:w-[25%] flex flex-row gap-2 items-center cursor-pointer mt-2 md:mt-0">
        <p className="text-[22px] text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
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
                  ? "text-primary border-b-2 border-primary"
                  : "text-label hover:primary"
              } px-1 py-2 text-sm font-medium transition-colors`}
            >
              {link.icon}
            </Link>
          );
        })}
      </section>

      <section className="w-[35%] md:w-[25%] absolute md:relative top-1 right-2 flex items-center justify-end gap-2 md:gap-4 mr-1">
        <Link
          href={"/chat"}
          className="w-9 md:w-10 h-9 md:h-10  bg-bg  hover:bg-primary text-primary hover:text-secondary border border-border rounded-full cursor-pointer hidden md:inline-flex justify-center items-center"
        >
          <MessageCircle className="w-5 md:w-6 h-5 md:h-6" />
        </Link>

        <NotificationDrawer
          initialNotifications={notifications}
          loggedInUserId={loggedInUser?._id}
        />
        <AccountMenu loggedInUser={loggedInUser} />
      </section>
    </nav>
  );
}
