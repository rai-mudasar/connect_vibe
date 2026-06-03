"use client";

import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { pusherClient } from "@/lib/pusher";
import { readNotificationById } from "@/actions/notificationActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import getSmartDateTime from "@/helpers/getSmartDate";
import Link from "next/link";

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
    const channel = pusherClient.subscribe(`user-${loggedInUserId}`);

    channel.bind("new-notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      router.refresh();
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`user-${loggedInUserId}`);
    };
  }, [loggedInUserId]);

  if (!isMounted) {
    return <Bell className="w-5 md:w-6 h-5 md:h-6 cursor-pointer" />;
  }
  return (
    <Sheet open={open} onOpenChange={state => setOpen(state)}>
      <SheetTrigger className="w-9 md:w-10 h-9 md:h-10 relative flex justify-center items-center rounded-full bg-bg hover:bg-primary text-primary hover:text-secondary border border-border transition cursor-pointer">
        <Bell className="w-5 md:w-6 h-5 md:h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent className="w-80 sm:w-96 bg-white">
        <SheetHeader>
          <div className="flex justify-between items-center border-b pb-4 relative">
            <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
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
                  className={`p-3 rounded-xl border transition-colors hover:text-white mt-4 ${notification.isRead
                    ? "bg-white hover:bg-gray-300 border-gray-200 "
                    : "bg-blue-100 hover:bg-blue-400 border-blue-200 shadow-sm"
                    }`}
                >
                  <div className="flex gap-3">
                    <div
                      className="flex-1"
                      onClick={() => handleReadNotification(notification._id)}
                    >
                      <div
                        className={`text-sm ${notification.isRead ? "" : "text-gray-900 font-semibold"}`}
                      >
                        {notification.type === "LIKE" && (
                          <div className="flex gap-1">
                            <h1>{`${notification.senderId.firstName} ${notification.senderId.lastName}`}</h1>
                            <span className="font-normal">likes your post.</span>
                          </div>
                        )}
                        {notification.type === "UNLIKE" && (
                          <div className="flex gap-1">
                            <h1>{`${notification.senderId.firstName} ${notification.senderId.lastName}`}</h1>
                            <span className="font-normal">unlikes your post.</span>
                          </div>
                        )}
                        {notification.type === "COMMENT" && (
                          <div className="flex gap-1">
                            <h1>{`${notification.senderId.firstName} ${notification.senderId.lastName}`}</h1>
                            <span className="font-normal">
                              commented on your post.
                            </span>
                          </div>
                        )}
                        {notification.type === "FRIEND_REQUEST" && (
                          <div className="flex gap-1">
                            <h1>{`${notification.senderId.firstName} ${notification.senderId.lastName}`}</h1>
                            <span className="font-normal">
                              send you a friend request.
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-[#1877F2] mt-1">
                        {getSmartDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bell size={48} className="mb-2 opacity-20" />
              <p>All caught up!</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
