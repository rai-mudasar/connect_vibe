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
import React, { useState, useEffect } from "react";
import UserCard from "@/components/profile/UserCard";
import { Users, UserPlus, Send, UserCheck, Loader2, Menu } from "lucide-react";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("friends");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleOnAction = async (id, type) => {
    let res;
    if (type === "friends") res = await handleUnfriend(id);
    if (type === "nearby") res = await handleSentFriendRequest(id);
    if (type === "pending") res = await handleApproveFriendRequest(id);
    if (type === "sent") res = await handleRejectFriendRequest(id);

    if(res.success) {
      setData(prev => prev.filter(user => user._id !== id))
      toast.success(res.message)
    } else{
      toast.error(`Error : ${res.message}`)
    }
  }

  return (
    <div className="flex h-screen bg-[#F2F4F7] dark:bg-[#1b1b1b] pt-20 md:pt-14">
      <Sheet
        open={sheetOpen}
        onOpenChange={() => setSheetOpen((prev) => !prev)}
      >
        <SheetTrigger className="h-6 absolute flex justify-start mt-6 ml-4 transition md:hidden">
          <Menu />
        </SheetTrigger>

        <SheetContent
          showCloseButton={false}
          side={"left"}
          className="w-52 h-screen mt-20 bg-white"
        >
          <SheetHeader>
            <SheetTitle className={"text-xl -mb-4"}>Friends</SheetTitle>
            <SheetDescription className="sr-only">
              View and manage your recent social notifications and activity.
            </SheetDescription>
          </SheetHeader> 

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-normal md:font-medium transition-all relative
              ${
                activeTab === tab.id
                  ? "text-[#1877F2] bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] hover:text-[#1877F2]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 h-full w-1 bg-[#1877F2] rounded-r-md" />
              )}
            </button>
          ))}
        </SheetContent>
      </Sheet>

      {/* Left Sidebar for desktop */}
      <div className="w-50 lg:w-80 bg-white dark:bg-[#242526] shadow-md py-4 hidden md:flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold mb-4 px-2">Friends</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-normal md:font-medium transition-all relative
              ${
                activeTab === tab.id
                  ? "text-[#1877F2] bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] hover:text-[#1877F2]"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 h-full w-1 bg-[#1877F2] rounded-r-md" />
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6 ml-7 md:ml-0">
            <h1 className="text-xl font-semibold">{tabs.map(tab => tab.id === activeTab ? tab.label : "" )}</h1>
            <span className="text-sm text-gray-500 font-medium">
              {data.length} People
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-[#1877F2]" size={40} />
            </div>
          ) : data.length > 0 ? (
            <div className="grid grid-cols-2 mob:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-9 pl-4">
              {data.map((user) => (
                <UserCard key={user._id} user={user} type={activeTab} onAction={handleOnAction} />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed">
              <Users size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No {activeTab} to show right now.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
