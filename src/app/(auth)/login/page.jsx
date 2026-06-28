"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/schemas/loginSchema";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response.error);
      }

      if (response.ok) {
        toast.success("Login Successfully")
        router.replace("/home")
      }
    } catch (error) {
      toast.error(error.message || 'Error occured during login!')
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="h-screen w-full bg-bg-gray1 pt-20 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
      <div className="text-primary text-3xl md:text-5xl font-bold">
        <span className="text-text1">Connect</span>Vibe.
      </div>
      <div className="p-10 shadow-xl/10 shadow-[#032062] rounded-4xl bg-bg-white1 border border-border">
        <div className="w-68 md:w-80 text-text1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]" htmlFor="username">
                      Email/Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="email/username"
                        autoComplete="email"
                        autoFocus
                        required
                        className={'border-border focus-visible:ring-[1px] md:focus-visible:ring-2px'}
                        {...field}
                      />
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
                    <FormLabel className="text-[18px] " htmlFor="password">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          placeholder="password"
                          type={showPassword ? "text" : "password"}
                          required
                          autoComplete="current-password"
                          className={'border-border focus-visible:ring-[1px] md:focus-visible:ring-2px'}
                          {...field}
                        />
                        <button
                          className="text absolute right-2 top-0 h-full py-2 hover:cursor-pointer"
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <Eye className="h-5 w-5 text-label" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-label" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-end -my-2">
                <Link
                  href={'/forgot-password'}
                  className="text-[10px] text-primary" 
                >
                  forgot password ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary/90 hover:bg-primary border border-border rounded-3xl text-white font-semibold text-[18px] md:text-[21px] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <p>loging in</p>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <Link href={"/signup"} className="w-full bg-bg-white1 hover:bg-bg-gray-hover border border-primary rounded-3xl text-primary font-semibold text-[18px] md:text-[21px] cursor-pointer flex justify-center items-center mt-4 py-0.75">
          <p className="text-label">Create new account</p>
        </Link>
      </div>
    </div>
  );
};
