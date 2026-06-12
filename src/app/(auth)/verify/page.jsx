"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import Loading from '@/components/Loading';
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { otpVerificationSchema } from "@/schemas/otpVerificationSchema";

export default function verifyPage() {
    // const params = useParams()
    const searchParams = useSearchParams();
    const searchEmail = searchParams.get('email')
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmittimg] = useState(false);

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(otpVerificationSchema),
        defaultValues: {
            code: "",
        },
    });

    useEffect(() => {
        try {
            if (!searchEmail) {
                setError("Email parameter is missing");
                setIsLoading(false);
                return;
            }
            
            const decodedEmail = decodeURIComponent(searchEmail);
            if (!decodedEmail || !decodedEmail.includes('@')) {
                setError('Invalid email parameter')
                setIsLoading(false);
                return;
            }

            setEmail(decodedEmail)
            setError('');
            setIsLoading(false)
        } catch (error) {
            setError('Failed to process verify :', error)
            console.log("Error is following : ")
            console.log(error)
            setIsLoading(false)
        }
    }, [searchEmail])

    async function onSubmit(data) {
        setIsSubmittimg(true);

        try {
            const response = await axios.post("/api/verify-code", {
                email,
                code: data.code,
            });

            if (response.data.success) {
                toast.success("Account verfied Successfully");
                router.replace("/login");
            }
        } catch (error) {
            console.log("Error in verification response", error.response.data.message);
            toast.error(error?.message || "Verification failed");
        } finally {
            setIsSubmittimg(false);
        }
    }

    if (isLoading) {
        return (
            <Loading className={'w-screen h-screen'} />
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="h-screen w-full bg-bg text-secondary flex items-center justify-center">
                <div className="px-20 py-10 rounded-4xl bg-card border border-border flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold text-red-500">{error}</p>
                    <button
                        onClick={() => router.push("/signup")}
                        className="mt-4 px-4 py-2 bg-primary text-secondary rounded-md"
                    >
                        Back to Signup
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-bg text-secondary px-4 md:px-0 pt-20 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
            <div className="p-10  rounded-4xl bg-card border border-border">
                <h1 className="text-3xl font-bold text-center">Please Verify your Account</h1>
                <p className="mt-6 flex flex-col text-center">
                    Enter the verification code sent to
                    <span className="text-primary font-bold">{email}</span>
                </p>

                <div className="mt-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-5"
                        >
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[18px]" htmlFor="otp">
                                            Verification Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="otp"
                                                placeholder="Enter OTP"
                                                autoFocus
                                                required
                                                className={'placeholder:text-label text-secondary border-border focus-visible:ring-[1px] md:focus-visible:ring-[2px]'}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button
                                type="submit"
                                className="bg-primary hover:bg-bg text-[18px] md:text-[21px] text-secondary hover:text-primary cursor-pointer hover:border border-border"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Verify"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}