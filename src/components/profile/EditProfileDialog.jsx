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
export default function EditProfileDialog({ currentProfileUser }) {
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
        setIsDialogOpen(false); // Close dialog
        router.refresh(); // Refresh server data
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="w-30 md:w-39 flex items-center gap-1 bg-[#F2F2F2] text-[15px] font-semibold text-black px-2.5 md:px-5 py-2 md:py-2.5 rounded-[10px] hover:bg-gray-200 transition">
          <Pencil fill="black" className="w-5 md:w-6 h-5 md:h-6" strokeWidth={"1px"} />
          <span>Edit Profile</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-scroll bg-white">
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
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe yourself..."
                      {...field}
                      className="resize-none"
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
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
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
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
                  <FormLabel>Relationship Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Engaged">Engaged</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="In a relationship">
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
              className="bg-[#0866FF] hover:bg-blue-700 text-white mt-2 w-full"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
