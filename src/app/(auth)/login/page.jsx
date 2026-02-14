"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema } from "@/schemas/loginSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Login = () => {
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

      if(response?.error){
        toast.error(response.error);
      }
      
      if(response.ok){
        toast.success("Login Successfully")
        router.replace("/home")
      }
      } catch (error) {
      console.log("Error in SignIn page : ", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="h-screen w-full bg-[#F0F2F5] pt-20 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
      <div className="text-[#0866FF] text-3xl md:text-5xl font-bold">
        facebook
      </div>
      <div className="p-10 shadow-xl/30 rounded-4xl bg-white">
        <div className="w-[20rem]">
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
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0866FF] text-[18px] md:text-[21px]"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="text-sm mt-6 font-semibold flex gap-3 text-[#0866FF] cursor-pointer">
          <p className="text-black cursor-default">Don't have an account ?</p>
          <Link href={"/signup"}> Signup </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
