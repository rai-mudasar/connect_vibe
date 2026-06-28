import { useState } from "react";
import { ArrowLeft, Settings, Lock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import ChangePaswordDialog from "./ChangePaswordDialog";
import EditProfileDialog from "../profile/EditProfileDialog";

export default function SettingSheet({ loggedInUser }) {
    const [open, setOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <div className="w-full hover:bg-bg-gray-hover py-2 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold">
                        <div className="rounded-full bg-bg-gray2 p-2.5">
                            <Settings className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                        <p>Settings & privacy</p>
                    </div>
                </SheetTrigger>

                <SheetContent showCloseButton={false} className="w-70 md:w-80 h-90 max-h-110 z-50 bg-bg-white1 backdrop-blur-xl shadow-2xl rounded-xl text-text1 flex flex-col top-23 md:top-14 overflow-y-scroll">
                    <SheetHeader className="flex flex-row justify-start items-center text-xl text-text1">
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
                            className="w-full hover:bg-bg-gray-hover py-2 pl-2 rounded-lg cursor-pointer flex flex-row items-center gap-2 font-semibold"
                        >
                            <div className="rounded-full bg-bg-gray2 p-2.5">
                                <Lock className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <p>Change Password</p>
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