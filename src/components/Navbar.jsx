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

export default function NavBar({loggedInUser}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { icon: <House />, href: "/home" },
    { icon: <Users2 />, href: "/friends" },
    { icon: <User2Icon />, href: `/profile/${loggedInUser.username}` },
  ];

  return (
    <nav className="w-full h-14 px-3 bg-[#FFFFFF] dark:bg-[#252728] flex flex-row shrink items-center justify-around shadow-sm fixed z-50">
      <section className="w-[25%] flex gap-2 items-center">
        <Image
          src="/svg/fb_icon.svg"
          alt="Facebook Icon"
          width={40}
          height={40}
        />

        <div className="w-60 h-10 text-[#333334] dark:text-white bg-[#F0F2F5] dark:bg-neutral-700 rounded-2xl flex items-center pl-6 gap-2">
          <Search size={30} className="text-neutral-400 stroke-[2px]" />
          <input
            type="text"
            placeholder="Search Facebook"
            className="outline-0"
          />
        </div>
      </section>

      {/* Desktop Links */}
      <div className="w-[60%] hidden md:flex justify-evenly">
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
      </div>

      {/* Mobile Menu Button */}
      <section className="w-[15%">
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden md:flex items-center justify-end gap-2 mr-3 sm:space-x-2">
          <ActionButton Icon={MessageCircle} />
          <ActionButton Icon={Bell} />
          <button onClick={() => signOut()}>
            <LogOut />
          </button>
        </div>
      </section>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t z-40">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)} // Close menu on click
                className={`block px-3 py-2 rounded-md text-base font-medium z-50 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
