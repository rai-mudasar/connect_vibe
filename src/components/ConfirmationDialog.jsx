"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "destructive",
    icon: Icon,
    requireTextConfirm = false,
    textToMatch = "DELETE",
    isLoading = false,
    onConfirm,
}) {
    const [userInput, setUserInput] = useState("");

    // Modal close ya open hone par verification text input reset karne ke liye
    useEffect(() => {
        if (!open) {
            setUserInput("");
        }
    }, [open]);

    // Confirm action button ko disable state evaluate karne ke liye
    const isConfirmDisabled =
        isLoading || (requireTextConfirm && userInput !== textToMatch);

    // Linear + Stripe premium dashboard color design maps
    const variantStyles = {
        destructive: {
            iconBg: "bg-red-500/10 dark:bg-red-500/15",
            iconColor: "text-red-600 dark:text-red-400",
            buttonClass: "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white focus:ring-red-500",
        },
        warning: {
            iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
            iconColor: "text-amber-600 dark:text-amber-400",
            buttonClass: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white focus:ring-amber-500",
        },
        default: {
            iconBg: "bg-zinc-500/10 dark:bg-zinc-500/15",
            iconColor: "text-zinc-600 dark:text-zinc-400",
            buttonClass: "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 focus:ring-zinc-500",
        },
    };

    const activeStyles = variantStyles[variant] || variantStyles.default;

    return (
        <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
            <DialogContent className="sm:max-w-110 gap-0 p-0 border border-border dark:border-border-dark bg-white dark:bg-dark-card2 overflow-hidden rounded-xl">

                {/* Dynamic Context Header Layout */}
                <div className="flex items-start gap-4 p-6">
                    {Icon && (
                        <div className={cn("hidden sm:flex p-2.5 rounded-lg shrink-0", activeStyles.iconBg)}>
                            <Icon className={cn("h-5 w-5", activeStyles.iconColor)} strokeWidth={2} />
                        </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                        <DialogHeader>
                            <DialogTitle className="text-base font-semibold tracking-tight text-text1 dark:text-text-dark">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm leading-relaxed text-text1/60 dark:text-text-dark/60">
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {/* Text Match Verification Area
                <AnimatePresence>
                    {requireTextConfirm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: "easeInOut" }}
                            className="px-6 pb-6"
                        >
                            <div className="space-y-2 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 p-4">
                                <Label htmlFor="verification-input" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    To confirm, type <span className="font-mono font-bold select-none text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">{textToMatch}</span> below
                                </Label>
                                <Input
                                    id="verification-input"
                                    type="text"
                                    placeholder={textToMatch}
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="off"
                                    className="h-9 mt-1.5 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0 text-sm font-medium"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence> */}

                {/* Action Panel Footer */}
                <DialogFooter className="px-6 py-4 bg-zinc-50 dark:bg-dark-card border-t border-border dark:border-border-dark flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="h-9 font-medium px-4 border-zinc-200 dark:border-border-dark hover:bg-zinc-100 dark:hover:bg-dark-card2 text-sm cursor-pointer"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isConfirmDisabled}
                        className={cn(
                            "h-9 font-medium px-4 shadow-sm text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            activeStyles.buttonClass,
                            isConfirmDisabled && "opacity-40 cursor-not-allowed pointer-events-none"
                        )}
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
                        <span>{confirmText}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}