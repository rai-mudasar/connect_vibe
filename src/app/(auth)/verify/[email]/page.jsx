"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { otpVerificationSchema } from "@/schemas/otpVerificationSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

const verify = () => {
  const params = useParams();
  const email = decodeURIComponent(params.email);

  const [isSubmitting, setIssubmittimg] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data) {
    setIssubmittimg(true);

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
      toast.error( error.response?.data?.message || "Verification failed");
    } finally {
      setIssubmittimg(false);
    }
  }

  return (
    <div className="h-screen w-full bg-[#F0F2F5] px-4 md:px-0 pt-20 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
      <div className="p-10 shadow-xl/30 shadow-neutral-400 rounded-4xl bg-white">
        <h1 className="text-3xl font-bold text-center">Please Verify your Account</h1>
        <p className="mt-6 flex flex-col text-center">
          Enter the verification code sent to
          <span className="text-[#0866FF] font-bold">{email}</span>
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-[#0866FF] text-[18px] md:text-[21px] text-white"
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
  );
};

export default verify;
