"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { useState, useEffect } from "react";
import { getExactDateAndTime } from "@/helpers/getSmartDate";
import { readNotificationById } from "@/actions/notificationActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function NotificationDrawer({
  loggedInUserId,
  initialNotifications,
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter()

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;


  const handleReadNotification = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((not) =>
        not._id === notificationId ? { ...not, isRead: true } : not,
      ),
    );
    setOpen(!open)
    const response = await readNotificationById(notificationId);

    if (response.success) {
      router.refresh()
    } else {
      toast.error(response.message)
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {

    const channel = pusherClient.subscribe(`user-${loggedInUserId.toString()}`);

    channel.bind("new-notification", (newNotification) => {
      // console.log('new : ', newNotification)
      setNotifications((prev) => [newNotification, ...prev]);
      router.refresh();
    });

    return () => {
      channel.unbind();
      pusherClient.unsubscribe(`user-${loggedInUserId}`);
    };
  }, [loggedInUserId]);

  if (!isMounted) {
    return (
      <div className="w-9 md:w-10 h-9 md:h-10 relative flex justify-center items-center rounded-full transition cursor-pointer">
        <Bell className="w-5 md:w-6 h-5 md:h-6" />
      </div>
    )
  }
  return (
    <Sheet open={open} onOpenChange={state => setOpen(state)}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger className="w-9 md:w-10 h-9 md:h-10 relative flex justify-center items-center rounded-full bg-bg-gray2 transition cursor-pointer">
              <Bell className="w-5 md:w-6 h-5 md:h-6 stroke-[2.7px] lg:fill-text1" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </SheetTrigger>
          </TooltipTrigger>

          <TooltipContent side="bottom" className="bg-black text-white text-xs font-medium px-2 py-1 rounded-md shadow-md border-none">
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent className="w-80 sm:w-96 bg-bg-white1 border-border">
        <SheetHeader>
          <div className="flex justify-between items-center border-b border-border pb-4 relative">
            <SheetTitle className="text-xl text-text1 font-bold">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <span className="text-[8px] text-white font-medium absolute -top-2 left-27 bg-red-700 px-1 py-0.5 rounded-2xl">
                New
              </span>
            )}
          </div>

          <SheetDescription className="sr-only">
            View and manage your recent social notifications and activity.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 overflow-y-auto h-[calc(100vh-100px)] pr-2 px-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              // if there is navigation change the following div to link
              <Link href={`${notification.redirectUrl}`} key={notification._id}>
                <div
                  className={`p-3 rounded-xl border transition-colors hover:bg-bg-gray-hover mt-4 ${notification.isRead
                    ? "border-border"
                    : "bg-[#AAC9FF] border-border"
                    }`}
                >
                  <div className="flex gap-3">
                    <div
                      className="flex-1"
                      onClick={() => handleReadNotification(notification._id)}
                    >
                      <div
                        className={`text-sm ${notification.isRead ? "text-text2" : "text-text2 font-semibold"}`}
                      >
                        {notification.type === "LIKE" && (
                          <div className="flex flex-row gap-1">
                            <h1 className="font-bold text-text1">{`${notification?.senderId?.firstName} ${notification?.senderId?.lastName}`}
                              <span className="font-normal"> likes your post.</span>
                            </h1>
                          </div>
                        )}
                        {notification.type === "UNLIKE" && (
                          <div className="flex gap-1">
                            <h1 className="font-bold text-text1">{`${notification?.senderId?.firstName} ${notification?.senderId?.lastName}`}
                              <span className="font-normal"> unlikes your post.</span>
                            </h1>
                          </div>
                        )}
                        {notification.type === "COMMENT" && (
                          <div className="">
                            <h1 className="font-bold text-text1">{`${notification?.senderId?.firstName} ${notification?.senderId?.lastName}`}

                              <span className="font-normal"> commented on your post.</span>
                            </h1>
                          </div>
                        )}
                        {notification.type === "FRIEND_REQUEST" && (
                          <div className="flex gap-1">
                            <h1 className="font-bold text-text1">{`${notification?.senderId?.firstName} ${notification?.senderId?.lastName}`}
                              <span className="font-normal"> send you a friend request.</span>
                            </h1>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-text2 mt-1">
                        {getExactDateAndTime(notification?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-text2">
              <Bell size={48} className="mb-2 opacity-20" />
              <p>All caught up!</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
