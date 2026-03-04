"use client";

import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
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

  // Handle opening the drawer
  const handleOpenChange = async (newOpenState) => {
    setOpen(newOpenState);

    // if (newOpenState && unreadCount > 0) {
    //   setNotifications((prev) => prev.map((not) => ({ ...not, isRead: true })));

    //   //   await markAllNotificationsAsRead(userId);
    // }
  };

  const handleReadNotification = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((not) =>
        not._id === notificationId ? { ...not, isRead: true } : not,
      ),
    );
    const response = await readNotificationById(notificationId);

    if(response.success) {
      router.refresh()
    } else{
      toast.error(response.message)
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   const channel = pusherClient.subscribe(`user-${loggedInUserId}`);

  //   channel.bind("new-notification", (newNotification) => {
  //     setNotifications((prev) => [newNotification, ...prev]);
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     pusherClient.unsubscribe(`user-${loggedInUserId}`);
  //   };
  // }, [loggedInUserId]);

  if (!isMounted) {
    return <Bell className="w-5 md:w-6 h-5 md:h-6" />;
  }
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger className="relative p-2 rounded-full hover:bg-gray-100 transition">
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

        <div className="mt-4 space-y-3 overflow-y-auto h-[calc(100vh-100px)] pr-2 px-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              // if there is navigation change the following div to link
              <div
                key={notification._id}
                className={`p-3 rounded-xl border transition-colors ${
                  notification.isRead
                    ? "bg-white border-gray-100"
                    : "bg-blue-50 border-blue-100 shadow-sm"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className="flex-1"
                    onClick={() => handleReadNotification(notification._id)}
                  >
                    <div
                      className={`text-sm ${notification.isRead ? "text-gray-600" : "text-gray-900 font-semibold"}`}
                    >
                      {notification.type === "LIKE" && (
                        <div className="flex gap-1">
                          <h1>{`${notification.senderId.firstName} ${notification.senderId.lastName}`}</h1>
                          <span className="font-normal">likes your post.</span>
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
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
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
