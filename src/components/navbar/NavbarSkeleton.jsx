"use client";

import {
    House,
    Users2,
    MessageCircle,
    User2Icon,
    LogOut,
    Bell,
} from "lucide-react";
import SafeImage from "../SafeImage";
import { FacebookSearchDialog } from "../FacebookSearchDialog";

export default function NavbarSkeleton() {

    const navLinks = [
        { icon: <House />, name: "Home", href: "/home" },
        { icon: <Users2 />, name: "Friends", href: "/friends" },
        {
            icon: <User2Icon />,
            name: "Profile",
            href: '#',
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
                    return (
                        <div
                            key={link.href}
                            className={"text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-medium transition-colors"}
                        >
                            {link.icon}
                        </div>
                    );
                })}
            </section>

            <section className="w-[15%] absolute md:relative top-1 right-2 flex items-center justify-end gap-2 mr-3 sm:space-x-2">
                <div
                    className="p-2 bg-[#F0F2F5] hover:bg-[#1877F2] hover:text-white rounded-full cursor-pointer inline-flex"
                >
                    <MessageCircle className="w-5 md:w-6 h-5 md:h-6" />
                </div>

                <div className="relative p-2 rounded-full bg-[#F0F2F5] hover:bg-[#1877F2] transition cursor-pointer">
                    <Bell className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <button className="cursor-pointer">
                    <LogOut className="w-5 md:w-6 h-5 md:h-6" />
                </button>
            </section>
        </nav>
    );
}
