"use client";

import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent } from '../ui/dialog';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeUserPassword } from '@/actions/userActions';
import { changePasswordSchema } from '@/schemas/changePasswordSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function ChangePaswordDialog({ open, onOpenChange }) {
    const [loading, setLoading] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });


    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await changeUserPassword(values.currentPassword, values.newPassword);

            if (res.success) {
                toast.success(res.message);
                form.reset(); // Clear all fields automatically
                setShowCurrent(false);
                setShowNew(false);
                setShowConfirm(false);
                onOpenChange(false); // Close modal sheet layout
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Internal configuration client crash");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="z-100 max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
                <div className="w-full bg-bg-white1 p-6 rounded-2xl border border-border shadow-md">

                    <div className="flex items-center gap-2 mb-4">
                        <KeyRound className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-text1">Change Password</h2>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-text2">Current Password</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input
                                                    type={showCurrent ? "text" : "password"}
                                                    placeholder="Enter current password"
                                                    className="bg-bg border-border pr-10 w-full"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrent(!showCurrent)}
                                                    className="absolute right-3 text-text2 hover:text-text1 transition-colors"
                                                >
                                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-text2">New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input
                                                    type={showNew ? "text" : "password"}
                                                    placeholder="Enter new password"
                                                    className="bg-bg border-border pr-10 w-full"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNew(!showNew)}
                                                    className="absolute right-3 text-text2 hover:text-text1 transition-colors"
                                                >
                                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-text2">Confirm New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input
                                                    type={showConfirm ? "text" : "password"}
                                                    placeholder="Re-type new password"
                                                    className="bg-bg border-border pr-10 w-full"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirm(!showConfirm)}
                                                    className="absolute right-3 text-text2 hover:text-text1 transition-colors"
                                                >
                                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Form>

                </div>
            </DialogContent>
        </Dialog>
    );
}