"use client";

import {
    House,
    Users2,
    MessageCircle,
    User2Icon,
    ChevronDown,
    Bell,
    Search,
} from "lucide-react";
import { Input } from "../ui/input";

export default function Navbar() {

    const navLinks = [
        { icon: <House />, name: "Home", },
        { icon: <Users2 />, name: "Friends" },
        { icon: <User2Icon />, name: "Profile" },
    ];

    return (
        <nav className="w-full md:h-14 pt-1 md:pt-0 px-3 bg-card dark:bg-[#252728] flex flex-col md:flex-row items-center justify-around shadow-sm fixed z-50">

            <section className="w-full md:w-[25%] flex flex-row gap-2 items-center cursor-pointer mt-2 md:mt-0">
                <p className="text-[22px] text-secondary font-semibold">Connect<span className="text-primary">Vibe.</span></p>
                <div className="hidden lg:flex">
                    <div className="relative hidden lg:block">
                        <div className="w-52 h-10 bg-bg rounded-2xl flex items-center pl-3 gap-1.5 border border-border">
                            <Search className="w-4 h-4 text-label shrink-0 stroke-[2px]" />
                            <Input
                                placeholder="Search ConnectVibe"
                                className="bg-transparent border-0 placeholder:text-label text-secondary w-full h-full text-sm rounded-2xl shadow-none focus-visible:ring-0 p-0"
                            />
                        </div>
                    </div>
                    <div
                        className="lg:hidden w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center text-label hover:text-primary transition-colors cursor-pointer"
                    >
                        <Search className="w-5 md:w-6 h-5 md:h-6 stroke-[2px] text-primary" />
                    </div>
                </div>
            </section>

            <section className="w-full md:[60%] mt-1 md:mt-0 flex justify-around md:justify-evenly">
                {navLinks.map((link) => {
                    return (
                        <div
                            key={link.name}
                            className={`text-label hover:text-primary hover:border-b-2 border-primary py-2 font-medium transition-colors px-1 text-sm`}
                        >
                            {link.icon}
                        </div>
                    );
                })}
                <div className="flex lg:hidden">
                    <div className="relative p-2 text-label hover:text-primary border-b-2 lg:border-0 border-card hover:border-primary lg:text-primary lg:hover:text-secondary transition-colors flex items-center justify-center">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                </div>
            </section>

            <section className="w-[45%] md:w-[25%] pt-1 md:pt-0 absolute md:relative top-1 right-2 flex items-center justify-end gap-2 md:gap-4 mr-1">
                <div className="lg:hidden">
                    <div className="relative hidden lg:block">
                        <div className="w-52 h-10 bg-bg rounded-2xl flex items-center pl-3 gap-1.5 border border-border">
                            <Search className="w-4 h-4 text-label shrink-0 stroke-[2px]" />
                            <Input
                                placeholder="Search ConnectVibe"
                                className="bg-transparent border-0 placeholder:text-label text-secondary w-full h-full text-sm rounded-2xl shadow-none focus-visible:ring-0 p-0"
                            />
                        </div>
                    </div>
                    <div
                        className="lg:hidden w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center text-label hover:text-primary transition-colors cursor-pointer"
                    >
                        <Search className="w-5 md:w-6 h-5 md:h-6 stroke-[2px] text-primary" />
                    </div>
                </div>
                <div className="w-9 md:w-10 h-9 md:h-10  bg-bg hover:bg-primary text-primary hover:text-secondary border border-border rounded-full cursor-pointer hidden lg:inline-flex justify-center items-center"
                >
                    <div className="relative p-2 text-label hover:text-primary border-b-2 lg:border-0 border-card hover:border-primary lg:text-primary lg:hover:text-secondary transition-colors flex items-center justify-center">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                </div>

                <div className="w-9 md:w-10 h-9 md:h-10 relative flex justify-center items-center rounded-full bg-bg hover:bg-primary text-primary hover:text-secondary border border-border transition cursor-pointer">
                    <Bell className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <div className="w-17.5 md:w-20 p-[0.5px] border border-border md:p-px bg-bg rounded-[19px] flex flex-row cursor-pointer items-center justify-between overflow-hidden">
                    <div className="w-9 md:w-10 h-9 md:h-10 border border-border bg-bg rounded-full flex justify-center items-center text-[22px] font-bold text-primary">
                        N
                    </div>
                    <div>
                        <ChevronDown className={`w-5 md:w-7 text-white duration-300 mr-1`} />
                    </div>
                </div>
            </section>
        </nav>
    );
}
