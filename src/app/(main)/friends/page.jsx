"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getFriends,
  getPendingRequests,
  getSentRequests,
  getNearbyPeople,
  handleUnfriend,
  handleSentFriendRequest,
  handleApproveFriendRequest,
  handleRejectFriendRequest,
} from "@/actions/friendActions";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useConfirm } from "@/context/ConfirmContext";
import { Users, UserPlus, Send, UserCheck, Loader2, Menu, UserX2Icon } from "lucide-react";
import UserCard from "@/components/profile/UserCard";

export default function FriendsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");

  const { confirm, close } = useConfirm()

  const tabs = [
    { id: "friends", label: "All Friends", icon: <UserCheck size={20} /> },
    { id: "nearby", label: "Nearby People", icon: <Users size={20} /> },
    { id: "pending", label: "Pending Approvals", icon: <UserPlus size={20} /> },
    { id: "sent", label: "Sent Requests", icon: <Send size={20} /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let res;

      if (activeTab === "friends") res = await getFriends();
      if (activeTab === "nearby") res = await getNearbyPeople();
      if (activeTab === "pending") res = await getPendingRequests();
      if (activeTab === "sent") res = await getSentRequests();

      if (res?.success) {
        setData(res.data);
      } else {
        setData([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);


  const handleClick = (id) => {
    setActiveTab(id)
    setSheetOpen((prev) => !prev)
  }

const handleOnAction = async (id, type, name) => {
  if (type === "friends") {
    confirm({
      title: `Unfriend ${name}?`,
      description: "Are you sure? This action cannot be undone and user will be removed from your friendlist and feed.",
      confirmText: "Unfriend",
      icon: UserX2Icon,
      variant: "destructive",
      onConfirm: async () => {
        const res = await handleUnfriend(id);
        close();
        if (res?.success) {
          setData(prev => prev.filter(user => user._id !== id));
          toast.success(res.message);
        } else {
          toast.error(`Error : ${res?.message || "Failed to unfriend"}`);
        }
      },
    });
    return;
  }

  let res;
  if (type === "nearby") res = await handleSentFriendRequest(id);
  if (type === "pending") res = await handleApproveFriendRequest(id);
  if (type === "sent") res = await handleRejectFriendRequest(id);

  if (res?.success) {
    setData(prev => prev.filter(user => user._id !== id));
    toast.success(res.message);
  } else {
    toast.error(`Error : ${res?.message || "Action failed"}`);
  }
};

  return (
    <div className="flex h-screen bg-bg-gray1 dark:bg-dark text-text1 dark:text-text-dark -pt-63 sm:pt-20 md:pt-14 relative">
      <Sheet
        open={sheetOpen}
        onOpenChange={() => setSheetOpen((prev) => !prev)}
      >
        <SheetTrigger className="h-6 absolute top-6.5 left-4 flex justify-start transition cursor-pointer md:hidden">
          <Menu className="text-text2 dark:text-text-dark" />
        </SheetTrigger>

        <SheetContent
          showCloseButton={false}
          side={"left"}
          className="w-60 h-screen mt-23 bg-bg-white1 dark:bg-dark-card border-border dark:border-border-dark"
        >
          <SheetHeader>
            <SheetTitle className={"text-xl text-text1 dark:text-text-dark -mb-4"}>Friends</SheetTitle>
            <SheetDescription className="sr-only">
              View and manage your recent social notifications and activity.
            </SheetDescription>
          </SheetHeader>

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-text1 dark:text-text-dark font-normal md:font-medium transition-all relative
              ${activeTab === tab.id
                  ? "bg-bg-gray-hover dark:bg-dark-card2 border border-border dark:border-border-dark"
                  : "hover:bg-bg-gray-hover "
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 h-full w-1 bg-primary rounded-r-md" />
              )}
            </button>
          ))}
        </SheetContent>
      </Sheet>

      {/* Left Sidebar for desktop */}
      <div className="w-70 bg-bg-white1 dark:bg-dark-card shadow-md py-4 hidden md:flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold mb-4 px-2">Friends</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center hover:bg-bg-gray-hover dark:hover:bg-dark-card2 gap-3 px-4 py-3 rounded-lg font-normal md:font-medium transition-all relative cursor-pointer
              ${activeTab === tab.id
                ? "bg-bg-gray-hover dark:bg-dark-card2 border border-border dark:border-border-dark"
                : ""
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 h-full w-1 bg-bg rounded-r-md" />
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 hide-scrollbar">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6 ml-7 md:ml-0">
            <h1 className="text-xl font-semibold">{tabs.map(tab => tab.id === activeTab ? tab.label : "")}</h1>
            <span className="text-sm text-text2 font-medium">
              {data.length} People
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : data.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-9 -pl-2">
              {data.map((user) => (
                <UserCard key={user._id} user={user} type={activeTab} onAction={handleOnAction} className={'w-40 md:w-50'} />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed">
              <Users size={64} className="text-text2 mb-4" />
              <p className="text-text2 text-lg font-medium">
                No {activeTab} to show right now.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
