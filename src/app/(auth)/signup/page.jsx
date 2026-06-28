"use client";

import axios from "axios";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounced";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signupSchema } from "@/schemas/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";

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
    const validData = { ...data, email: data?.email?.toLowerCase() };
    try {
      const response = await axios.post("/api/signup", validData);
      if (response.data.success) {
        setIsSubmitting(false);
        toast.success("Account created Successfully");
        const encodedEmail = encodeURIComponent(validData.email);
        router.push(`/verify?email=${encodedEmail}`);
      }
    } catch (error) {
      console.log("Error in submitting : ", error);
      toast.error(error.response.data?.message || "Signup Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return ( 
    <div className="h-screen w-full bg-bg-gray1 px-4 md:px-0 pt-20 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
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
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="username"
                        autoComplete="username"
                        autoFocus
                        required
                        className={'border-border focus-visible:ring-[1px] md:focus-visible:ring-2px'}
                        {...field}
                      />
                    </FormControl>
                    <p
                      className={`text-sm ${usernameMessage === "Username is available" ? "text-green-400" : "text-red-500"}`}
                    >
                      {usernameMessage}
                    </p>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <FormMessage className={'text-red-600'} />
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
                      <Input
                        id="email"
                        placeholder="email@gmail.com"
                        autoComplete="email"
                        required
                        className={'border-border focus-visible:ring-[1px] md:focus-visible:ring-2px'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={'text-red-600'} />
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          required
                          autoComplete="new-password"
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
                    <FormMessage className={'text-red-600'} />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || !isUsernameAvailable}
                className="bg-primary/90 hover:bg-primary border border-border rounded-3xl text-white font-semibold text-[18px] md:text-[21px] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <p>signing up</p>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <Link href={"/login"} className="w-full bg-bg-white1 hover:bg-bg-gray-hover border border-primary rounded-3xl text-primary font-semibold text-[16px] cursor-pointer flex justify-center items-center mt-4 py-0.75">
          <p className="text-label">I already have an account</p>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
