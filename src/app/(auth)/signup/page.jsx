"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounced";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signupSchema } from "@/schemas/signupSchema";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Signup = () => {
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const watchUsernameValue = form.watch("username");
  const debouncedUsername = useDebounce(watchUsernameValue, 500);

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      setUsernameMessage("");
      setIsUsernameAvailable(false);

      if (debouncedUsername) {
        setIsCheckingUsername(true);
        try {
          const respose = await axios.get(
            `/api/check-unique-username?username=${debouncedUsername}`,
          );

          if (respose.data.success) {
            setIsUsernameAvailable(true);
          }
          console.log("Response : ", respose.data);
          setUsernameMessage(respose.data.message);
        } catch (error) {
          console.error(
            error.response?.data?.message || "Error checking Username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUniqueness();
  }, [debouncedUsername]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/signup", data);
      if (response.data.success) {
        setIsSubmitting(false);
        toast.success("Account created Successfully");
        router.replace(`/verify/${data.email}`);
      }
    } catch (error) {
      console.log("Error in submitting : ", error);
      toast.error(error.response.data?.message || "Signup Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#F0F2F5] px-4 md:px-0 pt-20 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
      <div className="text-[#0866FF] text-3xl md:text-5xl font-bold">
        facebook
      </div>
      <div className="p-10 shadow-xl/30 rounded-4xl bg-white mx-4">
        <div className="w-[20rem]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <p
                      className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                    >
                      {usernameMessage}
                    </p>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || !isUsernameAvailable}
                className="bg-[#0866FF] text-[18px] md:text-[21px]"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin">
                    Signing Up
                  </Loader2>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="text-sm mt-6 font-semibold flex gap-3 text-[#0866FF] cursor-pointer">
          <p className="text-black cursor-default">
            Do you already have an account ?
          </p>
          <Link href={"/login"}> Login </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
