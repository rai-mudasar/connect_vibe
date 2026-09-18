import { useState } from "react";
import { ArrowLeft, Settings, Lock, SunMoon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import ChangePaswordDialog from "./ChangePaswordDialog";
import EditProfileDialog from "../profile/EditProfileDialog";
import { PostPrivacySelect } from "../post/PostPrivacySelect";
import { updateDefaultPostPrivacy } from "@/actions/userActions";
import { toast } from "sonner";
import { ThemeToggleButton } from "../ThemeToggleButton";

export default function SettingSheet({ loggedInUser }) {
    const [open, setOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [userDefaultPrivacy, setUserDefaultPrivacy] = useState(loggedInUser.privacy.defaultPostPrivacy)

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <div className="w-full text-text1 dark:text-text-dark hover:bg-bg-gray-hover dark:hover:bg-dark-card2 py-2 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold">
                        <div className="rounded-full bg-bg-gray2 dark:bg-dark-card2 p-2.5">
                            <Settings className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                        <p className="">Settings & privacy</p>
                    </div>
                </SheetTrigger>

                <SheetContent showCloseButton={false} className="w-70 md:w-80 max-h-90 md:max-h-110 z-50 bg-bg-white1 dark:bg-dark-card backdrop-blur-xl shadow-2xl rounded-l-xl text-text1 dark:text-text-dark flex flex-col top-23 md:top-14 right-3.5 overflow-y-scroll">
                    <SheetHeader className="flex flex-row justify-start items-center text-xl">
                        <div className="flex cursor-pointer" onClick={() => setOpen(false)}>
                            <ArrowLeft />
                        </div>
                        <p className="font-bold">Settings & privacy</p>
                    </SheetHeader>

                    <div className="px-2 flex flex-col gap-2">
                        {/* Click triggers local state without stacking context crashes */}
                        <EditProfileDialog currentProfileUser={loggedInUser} isSettingPart={true} />

                        {/* Change password dialog */}
                        <div
                            onClick={() => {
                                setOpen(false); // Close Sheet (Facebook style)
                                setPasswordDialogOpen(true); // Open Dialog safely
                            }}
                            className="w-full hover:bg-bg-gray-hover dark:hover:bg-dark-card2 py-2 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold"
                        >
                            <div className="rounded-full bg-bg-gray2 dark:bg-dark-card2 p-2.5">
                                <Lock className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <p>Change Password</p>
                        </div>
                        
                        {/* Post Privacy */}
                        <div className="w-full hover:bg-bg-gray-hover dark:hover:bg-dark-card2 py-2 pl-2 rounded-lg cursor-pointer font-semibold flex items-center justify-between">
                            <div className="w-full flex gap-2 items-center">
                                <div className="rounded-full bg-bg-gray2 dark:bg-dark-card2 p-2.5">
                                    <Lock className="w-5 md:w-6 h-5 md:h-6" />
                                </div>
                                <h3 className="font-semibold text-text1 dark:text-text-dark">Post Privacy</h3>
                            </div>

                            <PostPrivacySelect
                                value={userDefaultPrivacy}
                                onChange={async (newPrivacy) => {
                                    setUserDefaultPrivacy(newPrivacy);
                                    const res = await updateDefaultPostPrivacy(newPrivacy);
                                    if (res.success) {
                                        toast.success(res.message);
                                    } else {
                                        toast.error(res.message)
                                    }
                                }}
                            />
                        </div>

                        {/* Theme toggle */}
                        <div className="p-4 rounded-2xl border border-border dark:border-border-dark">
                            <h2 className="text-lg font-bold text-text1 dark:text-text-dark mb-4">Appearance Settings</h2>

                            {/* Theme Setting Row */}
                            <div className="flex items-center justify-between gap-0.5 py-3 border-b border-border dark:border-border-dark">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-bg-gray1 border border-border">
                                        <SunMoon className="w-5 h-5 text-text1" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[12px] md:text-sm text-text1 dark:text-text-dark">App Theme</h3>
                                        {/* <p className="text-[10px] md:text-xs text-text2">Customize how ConnectVibe looks to you</p> */}
                                    </div>
                                </div>

                                {/* Theme Toggle Dropdown */}
                                <ThemeToggleButton />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Rendered independently to sit on top of everything without context block */}
            <ChangePaswordDialog
                open={passwordDialogOpen}
                onOpenChange={setPasswordDialogOpen}
            />
        </>
    );
}