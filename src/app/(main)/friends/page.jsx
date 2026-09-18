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
import { useState, useEffect, useCallback } from "react";
import { useConfirm } from "@/context/ConfirmContext";
import { Users, UserPlus, Send, UserCheck, Loader2, Menu, UserX2Icon } from "lucide-react";
import UserCard from "@/components/profile/UserCard";

// ─── How many users to fetch per page ────────────────────────────────────────
const PAGE_SIZE = 10;

// ─── Map tab id → server action ───────────────────────────────────────────────
const FETCHER = {
  friends: getFriends,
  nearby:  getNearbyPeople,
  pending: getPendingRequests,
  sent:    getSentRequests,
};

export default function FriendsPage() {
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");

  // pagination state per tab so switching back doesn't reset progress
  const [pages, setPages]       = useState({ friends: 1, nearby: 1, pending: 1, sent: 1 });
  const [hasMore, setHasMore]   = useState({ friends: false, nearby: false, pending: false, sent: false });

  const { confirm, close } = useConfirm();

  const tabs = [
    { id: "friends", label: "All Friends",       icon: <UserCheck size={20} /> },
    { id: "nearby",  label: "Nearby People",     icon: <Users size={20} />    },
    { id: "pending", label: "Pending Approvals", icon: <UserPlus size={20} /> },
    { id: "sent",    label: "Sent Requests",     icon: <Send size={20} />     },
  ];

  // ── Initial load whenever tab changes ──────────────────────────────────────
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setData([]);

      const res = await FETCHER[activeTab]({ page: 1, limit: PAGE_SIZE });

      if (res?.success) {
        setData(res.data);
        // If the server returns a total or a hasMore flag use it;
        // fall back to checking whether we got a full page
        const more =
          res.hasMore !== undefined
            ? res.hasMore
            : res.data.length === PAGE_SIZE;

        setHasMore(prev => ({ ...prev, [activeTab]: more }));
        setPages(prev  => ({ ...prev, [activeTab]: 1 }));
      } else {
        setData([]);
        setHasMore(prev => ({ ...prev, [activeTab]: false }));
      }

      setLoading(false);
    };

    fetchInitial();
  }, [activeTab]);

  // ── Load more (append) ─────────────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore[activeTab]) return;

    setLoadingMore(true);
    const nextPage = pages[activeTab] + 1;

    const res = await FETCHER[activeTab]({ page: nextPage, limit: PAGE_SIZE });

    if (res?.success) {
      setData(prev => {
        // de-duplicate by _id in case of race conditions
        const existingIds = new Set(prev.map(u => String(u._id)));
        const fresh = res.data.filter(u => !existingIds.has(String(u._id)));
        return [...prev, ...fresh];
      });

      const more =
        res.hasMore !== undefined
          ? res.hasMore
          : res.data.length === PAGE_SIZE;

      setHasMore(prev => ({ ...prev, [activeTab]: more }));
      setPages(prev  => ({ ...prev, [activeTab]: nextPage }));
    } else {
      toast.error("Failed to load more users.");
    }

    setLoadingMore(false);
  }, [activeTab, loadingMore, hasMore, pages]);

  // ── Tab switch helper (used by mobile sheet) ───────────────────────────────
  const handleClick = (id) => {
    setActiveTab(id);
    setSheetOpen(prev => !prev);
  };

  // ── Per-card actions ───────────────────────────────────────────────────────
  const handleOnAction = async (id, type, name) => {
    if (type === "friends") {
      confirm({
        title: `Unfriend ${name}?`,
        description:
          "Are you sure? This action cannot be undone and user will be removed from your friendlist and feed.",
        confirmText: "Unfriend",
        icon: UserX2Icon,
        variant: "destructive",
        onConfirm: async () => {
          const res = await handleUnfriend(id);
          close();
          if (res?.success) {
            setData(prev => prev.filter(u => u._id !== id));
            toast.success(res.message);
          } else {
            toast.error(`Error: ${res?.message || "Failed to unfriend"}`);
          }
        },
      });
      return;
    }

    let res;
    if (type === "nearby")  res = await handleSentFriendRequest(id);
    if (type === "pending") res = await handleApproveFriendRequest(id);
    if (type === "sent")    res = await handleRejectFriendRequest(id);

    if (res?.success) {
      setData(prev => prev.filter(u => u._id !== id));
      toast.success(res.message);
    } else {
      toast.error(`Error: ${res?.message || "Action failed"}`);
    }
  };

  // ── Shared sidebar tab button ──────────────────────────────────────────────
  const TabButton = ({ tab, onClick }) => (
    <button
      key={tab.id}
      onClick={() => onClick(tab.id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-normal md:font-medium transition-all relative cursor-pointer
        ${activeTab === tab.id
          ? "bg-bg-gray-hover dark:bg-dark-card2 border border-border dark:border-border-dark"
          : "hover:bg-bg-gray-hover dark:hover:bg-dark-card2"
        }`}
    >
      {tab.icon}
      <span>{tab.label}</span>
      {activeTab === tab.id && (
        <div className="absolute bottom-0 left-0 h-full w-1 bg-primary rounded-r-md" />
      )}
    </button>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-bg-gray1 dark:bg-dark text-text1 dark:text-text-dark -pt-63 sm:pt-20 md:pt-14 relative">

      {/* ── Mobile sheet sidebar ── */}
      <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(prev => !prev)}>
        <SheetTrigger className="h-6 absolute top-6.5 left-4 flex justify-start transition cursor-pointer md:hidden">
          <Menu className="text-text2 dark:text-text-dark" />
        </SheetTrigger>

        <SheetContent
          showCloseButton={false}
          side="left"
          className="w-60 h-screen mt-23 bg-bg-white1 dark:bg-dark-card border-border dark:border-border-dark"
        >
          <SheetHeader>
            <SheetTitle className="text-xl text-text1 dark:text-text-dark -mb-4">Friends</SheetTitle>
            <SheetDescription className="sr-only">
              View and manage your recent social notifications and activity.
            </SheetDescription>
          </SheetHeader>

          {tabs.map(tab => (
            <TabButton key={tab.id} tab={tab} onClick={handleClick} />
          ))}
        </SheetContent>
      </Sheet>

      {/* ── Desktop sidebar ── */}
      <div className="w-70 bg-bg-white1 dark:bg-dark-card shadow-md py-4 hidden md:flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold mb-4 px-2">Friends</h2>
        {tabs.map(tab => (
          <TabButton key={tab.id} tab={tab} onClick={setActiveTab} />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 hide-scrollbar">
        <div className="max-w-5xl mx-auto">

          {/* Header row */}
          <div className="flex justify-between items-center mb-6 ml-7 md:ml-0">
            <h1 className="text-xl font-semibold">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <span className="text-sm text-text2 font-medium">
              {data.length}{hasMore[activeTab] ? "+" : ""} People
            </span>
          </div>

          {/* Initial loading spinner */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>

          ) : data.length > 0 ? (
            <>
              {/* User grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-9 -pl-2">
                {data.map(user => (
                  <UserCard
                    key={user._id}
                    user={user}
                    type={activeTab}
                    onAction={handleOnAction}
                    className="w-40 md:w-50"
                  />
                ))}
              </div>

              {/* Load More / end-of-list */}
              <div className="flex justify-center mt-8 mb-10">
                {hasMore[activeTab] ? (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold
                               hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Loading…
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                ) : (
                  <p className="text-sm text-text2 py-2">
                    You&apos;ve reached the end — {data.length} {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} total.
                  </p>
                )}
              </div>
            </>

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
