"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form"; // Fixed import
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/schemas/editProfileSchema";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { updateProfile } from "@/actions/userActions"; // Your Server Action
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Pass the initial user data as props
export default function EditProfileDialog({ currentProfileUser, isSettingPart }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: currentProfileUser?.firstName || "",
      lastName: currentProfileUser?.lastName || "",
      bio: currentProfileUser?.bio || "",
      location: currentProfileUser?.location || "",
      occupation: currentProfileUser?.occupation || "",
      relationshipStatus: currentProfileUser?.relationshipStatus || ""
    },
  });

  const onSubmit = async (data) => {
    try {
      // 1. Call Server Action
      const result = await updateProfile(currentProfileUser._id, data);

      if (result.success) {
        setIsDialogOpen(false);
        router.refresh();
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className={`flex items-center gap-2 font-semibold rounded-lg ${isSettingPart ? 'w-full hover:bg-bg-gray-hover py-2 pl-2 flex-row'
          :
          'w-32 sm:w-39 bg-bg-gray2 border border-border text-[15px] text-label px-2.5 md:px-5 py-2 md:py-2.5 my-7 md:my-0 hover:bg-bg-gray-hover transition'} cursor-pointer`}>
          <div className={`${isSettingPart ? 'rounded-full bg-bg-gray2 p-2.5' : ''}`}>
            <Pencil className="w-5 md:w-6 h-5 md:h-6" />
          </div>
          <span>Edit Profile</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[98vh] overflow-y-scroll bg-bg-white1 text-text1">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'text-text2'}>First Name</FormLabel>
                    <FormControl>
                      <Input
                        id="firstname"
                        placeholder="firstname"
                        autoComplete="firstname"
                        autoFocus
                        required
                        className={'text-text1 border-border focus-visible:ring-[1px] md:focus-visible:ring-2'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={"text-red-600"} />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'text-text2'}>Last Name</FormLabel>
                    <FormControl className={'text-text2'}>
                      <Input
                        id="lastname"
                        placeholder="lastname"
                        autoComplete="lastname"
                        required
                        className={'text-label border-border focus-visible:ring-[1px] md:focus-visible:ring-2'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={"text-red-600"} />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="bio"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-text2'}>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe yourself..."
                      required
                      className={'text-label border-border focus-visible:ring-[1px] md:focus-visible:ring-2 resize-none'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={"text-red-600"} />
                </FormItem>
              )}
            />

            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-text2'}>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City, Country"
                      required
                      className={'text-label border-border focus-visible:ring-[1px] md:focus-visible:ring-2'}
                      {...field} />
                  </FormControl>
                  <FormMessage className={"text-red-600"} />
                </FormItem>
              )}
            />

            <FormField
              name="occupation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-text2'}>Occupation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Software Engineer"
                      required
                      className={'text-label border-border focus-visible:ring-[1px] md:focus-visible:ring-2'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={"text-red-600"} />
                </FormItem>
              )}
            />

            <FormField
              name="relationshipStatus"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-text2'}>Relationship Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-bg-white1 border-border">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-bg-white1 text-text1 border-border">
                      <SelectItem className={'cursor-pointer hover:bg-bg-gray-hover'} value="None">None</SelectItem>
                      <SelectItem className={'cursor-pointer hover:bg-bg-gray-hover'} value="Single">Single</SelectItem>
                      <SelectItem className={'cursor-pointer hover:bg-bg-gray-hover'} value="Engaged">Engaged</SelectItem>
                      <SelectItem className={'cursor-pointer hover:bg-bg-gray-hover'} value="Married">Married</SelectItem>
                      <SelectItem className={'cursor-pointer hover:bg-bg-gray-hover'} value="In a relationship">
                        In a relationship
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-primary/80 hover:bg-primary border border-border text-white mt-2 w-full cursor-pointer"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
