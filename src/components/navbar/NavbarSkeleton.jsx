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
        <nav className="w-full md:h-14 px-3 bg-card dark:bg-[#252728] flex flex-col md:flex-row items-center justify-around shadow-sm fixed z-50">

            <section className="w-full md:w-[25%] flex flex-row gap-2 items-center cursor-pointer mt-2 md:mt-0">
                <p className="text-[22px] md:text-2xl text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
                <FacebookSearchDialog />
            </section>

            <section className="w-full md:w-[60%] flex justify-around md:justify-evenly">
                {navLinks.map((link) => {
                    return (
                        <div
                            key={link.href}
                            className={"text-label hover:text-primary px-1 py-2 text-sm font-medium transition-colors"}
                        >
                            {link.icon}
                        </div>
                    );
                })}
            </section>

            <section className="w-[15%] absolute md:relative top-1 right-2 flex items-center justify-end gap-2 mr-3 sm:space-x-2">
                <div
                    className="p-2 bg-bg hover:bg-[#1877F2] hover:text-white rounded-full cursor-pointer inline-flex"
                >
                    <MessageCircle className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                </div>

                <div className="relative p-2 rounded-full bg-bg hover:bg-primary transition cursor-pointer">
                    <Bell className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                </div>
                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full border-border bg-bg"></div>
            </section>
        </nav>
    );
}
