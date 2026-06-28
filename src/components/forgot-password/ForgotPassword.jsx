'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { emailSchema } from '@/schemas/emailSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { getResetPasswordLink } from '@/actions/userActions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

export default function ForgotPassword() {

  const [isSubmitting, setIssubmittimg] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    console.log("front : ", data.email)
    setIssubmittimg(true);
    
    try {
      const response = await getResetPasswordLink(data.email)
      console.log("front 2 : ", data.email)

      if (response.success) {
        toast.success("Verification mail sent to your email");
      }
      else{
        toast.error(response?.message || "Error: Try again later too");
      }
    } catch (error) {
      toast.error(error.response?.message || "Error: Try again later");
    } finally {
      setIssubmittimg(false);
    }
  }
  return (
    <div className="h-screen w-full bg-bg-gray1 text-text1 px-4 md:px-0 pt-30 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
      <div className="p-10 rounded-4xl bg-bg-white1 border border-border">
        <h1 className="text-3xl font-bold text-center">Verify your Account</h1>
        <p className="mt-1 flex flex-col text-center">
          Enter email linked to your account
        </p>

        <div className="mt-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]" htmlFor="email">
                      Email ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="user@gmail.com"
                        autoFocus
                        required
                        className={'placeholder:text-text2 text-text1 border-border focus-visible:ring-[1px] md:focus-visible:ring-2px'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-primary/90 hover:bg-primary text-[18px] md:text-[21px] text-white cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Get OTP"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

