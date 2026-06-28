"use client";

import { usePathname } from "next/navigation";
import { House, Users2, User2Icon } from "lucide-react";
import { FacebookSearchDialog } from "../FacebookSearchDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import AccountMenuSheet from "./AccountMenuSheet";
import ChatNavbarBadge from "../chat/ChatNavbarBadge";
import NotificationDrawer from "../notification/NotificationDrawer";

export default function Navbar({ loggedInUser, notifications, isAdmin, initialUnreadMessageCount }) {
  const pathname = usePathname();

  const navLinks = [
    { icon: <House />, name: "Home", href: "/home" },
    { icon: <Users2 />, name: "Friends", href: "/friends" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="w-full md:h-14 pt-1 md:pt-0 px-3 bg-bg-white1 flex flex-col md:flex-row items-center justify-around shadow-sm sm:fixed z-50">

        <section className="w-full md:w-[25%] flex flex-row gap-2 items-center cursor-pointer mt-2 md:mt-0">
          <p className="text-[22px] text-text1 font-semibold">Connect<span className="text-primary">Vibe.</span></p>
          <div className="hidden lg:flex">
            <FacebookSearchDialog />
          </div>
        </section>

        <section className="w-full md:[60%] mt-1 md:mt-0 flex justify-around md:justify-evenly">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={`${isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-text2"
                      } hover:text-primary hover:border-b-2 border-primary py-2 font-medium transition-colors px-1 text-sm ${link.className}`}
                  >
                    {link.icon}
                  </Link>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="bg-black text-white text-xs font-medium px-2 py-1 rounded-md shadow-md border-none">
                  <p>{link?.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
          <div className="flex">
            <ChatNavbarBadge initialCount={initialUnreadMessageCount} loggedInUserId={loggedInUser?._id} />
          </div>
        </section>

        <section className="w-[45%] md:w-[25%] pt-1 md:pt-0 absolute md:relative top-1 right-2 flex items-center justify-end gap-2 md:gap-4 mr-1">

          <div className="lg:hidden">
            <FacebookSearchDialog />
          </div>

          {/* <div className="w-9 md:w-10 h-9 md:h-10 bg-bg-gray2 rounded-full cursor-pointer hidden lg:inline-flex justify-center items-center">
            <ChatNavbarBadge initialCount={initialUnreadMessageCount} loggedInUserId={loggedInUser?._id} />
          </div> */}

          <NotificationDrawer initialNotifications={notifications} loggedInUserId={loggedInUser?._id} />

          <AccountMenuSheet loggedInUser={loggedInUser} isAdmin={isAdmin} />

        </section>
      </nav>
    </TooltipProvider>
  );
}
