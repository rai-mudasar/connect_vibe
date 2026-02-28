"use client";
import { Bell } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns"; 
import { markNotificationsAsRead } from "@/actions/notificationActions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function NotificationDrawer({ userId, initialNotifications }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Handle opening the drawer
  const handleOpenChange = async (newOpenState) => {
    setOpen(newOpenState);

    // If the drawer is being opened and there are unread notifications
    if (newOpenState && unreadCount > 0) {
      // 1. Optimistic Update: Update UI immediately
      setNotifications(prev => 
        prev.map(not => ({ ...not, isRead: true }))
      );

      await markNotificationsAsRead(userId);
    }
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${userId}`);
    
    channel.bind("new-notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => pusherClient.unsubscribe(`user-${userId}`);
  }, [userId]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger className="relative p-2 rounded-full hover:bg-gray-100 transition">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-80 sm:w-96">
        <SheetHeader>
          <div className="flex justify-between items-center border-b pb-4">
            <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-600 font-medium">New</span>
            )}
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-3 overflow-y-auto h-[calc(100vh-100px)] pr-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n._id} 
                className={`p-3 rounded-xl border transition-colors ${
                  n.isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100 shadow-sm'
                }`}
              >
                <div className="flex gap-3">
                  {/* You could add a small Avatar here for senderId */}
                  <div className="flex-1">
                    <p className={`text-sm ${n.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                      {n.type === "MESSAGE" && "You have a new message"}
                      {n.type === "LIKE" && "Someone reacted to your post"}
                      {n.type === "FRIEND_REQUEST" && "New friend request pending"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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