"use client";

import React, { useState, useEffect } from "react"; // Added useEffect
import { Users, UserPlus, Send, UserCheck, Loader2 } from "lucide-react";
import UserCard from "@/components/profile/UserCard";
import { Card } from "@/components/ui/card";
import {
  getFriends,
  getPendingRequests,
  getSentRequests,
  getNearbyPeople,
} from "@/actions/friendActions";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("friends");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let res;

      // Map tabs to actions
      if (activeTab === "friends") res = await getFriends();
      if (activeTab === "pending") res = await getPendingRequests();
      if (activeTab === "sent") res = await getSentRequests();
      if (activeTab === "nearby") res = await getNearbyPeople();

      if (res?.success) {
        setData(res.data);
      } else {
        setData([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  const tabs = [
    { id: "friends", label: "All Friends", icon: <UserCheck size={20} /> },
    { id: "nearby", label: "Nearby People", icon: <Users size={20} /> },
    { id: "pending", label: "Pending Requests", icon: <UserPlus size={20} /> },
    { id: "sent", label: "Sent Requests", icon: <Send size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#F2F4F7] dark:bg-[#1b1b1b]">
      {/* Left Sidebar */}
      <div className="w-80 bg-white dark:bg-[#242526] shadow-md p-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold mb-4 px-2">Friends</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all relative
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <span className="text-sm text-gray-500 font-medium">
              {data.length} People
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-[#1877F2]" size={40} />
            </div>
          ) : data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.map((user) => (
                <UserCard
                  key={user._id} // MongoDB uses _id
                  user={user}
                  type={activeTab}
                />
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
