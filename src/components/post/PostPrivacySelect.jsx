"use client";

import { Globe, Users, Lock, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const OPTIONS = [
    { value: "everyone", label: "Everyone", icon: Globe },
    { value: "friends", label: "Friends", icon: Users },
    { value: "onlyme", label: "Only Me", icon: Lock },
];

export function PostPrivacySelect({ value = "everyone", onChange, size = "md" }) {
    const SelectedOption = OPTIONS.find((opt) => opt.value === value) || OPTIONS[0];
    const Icon = SelectedOption.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`flex items-center gap-1.5 bg-bg-gray1 dark:bg-dark-card2/70 hover:bg-bg-gray-hover dark:hover:bg-dark-card2 border border-border dark:border-border-dark dark:hover:border-border rounded-xl text-text1 transition-colors cursor-pointer ${size === "sm" ? "px-2 py-1 text-xs" : "w-50 px-3 py-2 text-sm"}`}
                >
                    <Icon className={`${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} text-primary`} />
                    <span className="font-medium">{SelectedOption.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="bg-bg-white1 dark:bg-dark-card border-border dark:border-border-dark">
                {OPTIONS.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                        <DropdownMenuItem
                            key={item.value}
                            onClick={() => onChange(item.value)}
                            className="flex items-center gap-2 cursor-pointer focus:bg-bg-gray-hover dark:focus:bg-dark-card2 text-text1 dark:text-text-dark"
                        >
                            <ItemIcon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}