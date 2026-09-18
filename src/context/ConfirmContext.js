"use client";

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { createContext, useContext, useState } from "react";

const ConfirmContext = createContext(null);

export function ConfirmContextProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState({
        title: "",
        description: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        variant: "destructive",
        icon: null,
        requireTextConfirm: false,
        textToMatch: "DELETE",
        onConfirm: () => { },
    });

    const confirm = (options) => {
        setIsOpen(true);
        setIsLoading(false);
        setConfig({
            confirmText: "Confirm",
            cancelText: "Cancel",
            variant: "destructive",
            requireTextConfirm: false,
            textToMatch: "DELETE",
            ...options,
        });
    };

    const close = () => setIsOpen(false);

    const handleConfirm = async () => {
        if (config.onConfirm) {
            setIsLoading(true);
            try {
                await config.onConfirm();
                close();
            } catch (error) {
                console.error("Action failed:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <ConfirmContext.Provider value={{ confirm, close }}>
            {children}

            <ConfirmationDialog
                open={isOpen}
                onOpenChange={close}
                isLoading={isLoading}
                onConfirm={handleConfirm}
                {...config}
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmContextProvider");
    }
    return context;
}