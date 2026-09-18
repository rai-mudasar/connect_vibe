"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const THEME_OPTIONS = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
];

export function ThemeToggleButton({ size = "md" }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch between server and client
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-28 h-9 bg-bg-gray1 animate-pulse rounded-xl border border-border" />
        );
    }

    // Find currently selected theme
    const currentOption =
        THEME_OPTIONS.find((opt) => opt.value === theme) || THEME_OPTIONS[2];
    const CurrentIcon = currentOption.icon;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`flex items-center gap-0.5 md:gap-2 bg-bg-gray1 hover:bg-bg-gray-hover dark:bg-dark-card2/70 dark:hover:bg-dark-card2 border border-border dark:border-border-dark rounded-xl text-text1 transition-colors cursor-pointer outline-none ${size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm"
                        }`}
                >
                    <CurrentIcon className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium capitalize">{currentOption.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-text2 opacity-60 ml-1" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-bg-white1 dark:bg-dark-card border-border dark:border-border-dark shadow-xl rounded-xl flex flex-col gap-1">
                {THEME_OPTIONS.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = theme === item.value;

                    return (
                        <DropdownMenuItem
                            key={item.value}
                            onSelect={() => {
                                setTheme(item.value);
                            }}
                            className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-bg-gray-hover dark:hover:bg-dark-card2 text-text1 dark:text-text-dark"
                                }`}
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