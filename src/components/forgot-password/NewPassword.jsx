'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNewPassword } from '@/actions/userActions'
import { newPasswordSchema } from '@/schemas/newPasswordSchema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

export default function NewPassword({userId}) {

  const [isSubmitting, setIssubmittimg] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    setIssubmittimg(true);

    try {
      const response = await createNewPassword(userId, data.newPassword)

      if (response.success) {
        toast.success(response?.message || "Password changed successfully");
        router.replace(`/login`);
      }
      else{
        toast.error(response?.message || "Error: Try again later");
      }
    } catch (error) {
      toast.error(error?.message || "Error: Try again later");
    } finally {
      setIssubmittimg(false);
    }
  }
  return (
    <div className="w-full h-screen bg-bg-gray1 text-text1 px-4 md:px-0 pt-30 sm:pt-15 md:pt-10 flex flex-col items-center gap-9">
      <div className="w-[35%] p-10 rounded-4xl bg-bg-white1 border border-border">
        <h1 className="text-3xl font-bold text-center">Create new Password</h1>
        <p className="mt-6 flex flex-col text-center">
          Choose strong password for your account
        </p>

        <div className="mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]" htmlFor="newPassword">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="newPassword"
                        autoFocus
                        required
                        className={'placeholder:text-text2 text-text1 border-border focus-visible:ring-[1px] md:focus-visible:ring-2px'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={'text-red-500'} />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]" htmlFor="confirmPassword">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        required
                        className={'placeholder:text-text2 text-text1 border-border focus-visible:ring-[1px] md:focus-visible:ring-2px'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={'text-red-500'} />
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
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

