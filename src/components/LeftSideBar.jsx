"use client";

import SidebarItem from "./ui/SideBarItem";
import {
  Users,
  Bookmark,
  Clock,
  Store,
  ChevronDown,
  UserCircle,
  Play,
  Flag,
} from "lucide-react";
import Image from "next/image";
import SafeImage from "./SafeImage";

const LeftSidebar = ({user}) => {

  return (
    <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-56px)] w-75 p-2 xl:block bg-[#F2F4F7] dark:bg-[#333334] custom-scrollbar hover:overflow-y-auto">
      <div className="space-y-0.5 pb-4 border-b border-gray-300">
        <div className="w-67 flex items-center shadow-md rounded-xl space-x-3 p-2 hover:bg-gray-200 cursor-pointer transition-all duration-200 group mr-7">
          <div className="w-8 h-8 rounded-full overflow-hidden z-20 relative">
            {user.profileImageUrl && (
              <SafeImage
                src={user.profileImageUrl}
                fill
                alt="User Profile Image"
                className={'object-contain'}
              />
            )}
          </div>
          <p className="font-medium text-[15px] text-gray-800">{user.name}</p>
        </div>
        <SidebarItem icon={Users} label="Friends" iconColor="text-blue-600" />
        <SidebarItem
          icon={Store}
          label="Marketplace"
          iconColor="text-blue-500"
        />
        <SidebarItem icon={Clock} label="Memories" iconColor="text-blue-400" />
        <SidebarItem
          icon={Bookmark}
          label="Saved"
          iconColor="text-purple-600"
        />
        <SidebarItem icon={Flag} label="Pages" iconColor="text-orange-500" />
        <SidebarItem icon={Play} label="Video" iconColor="text-blue-500" />

        {/* See More Toggle */}
        <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-200 cursor-pointer">
          <div className="bg-gray-300 rounded-full p-1">
            <ChevronDown size={20} />
          </div>
          <span className="font-medium text-[15px]">See more</span>
        </div>
      </div>

      {/* Shortcuts Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center px-2 mb-2 group">
          <h3 className="text-gray-500 font-semibold text-[17px]">
            Your shortcuts
          </h3>
          <button className="text-blue-500 text-sm opacity-0 group-hover:opacity-100 hover:bg-gray-200 p-1 px-2 rounded-md transition-opacity">
            Edit
          </button>
        </div>

        {/* Dynamic Shortcut List */}
        <SidebarItem
          icon={UserCircle}
          label="React Developers Hub"
          iconColor="text-gray-500"
        />
        <SidebarItem
          icon={UserCircle}
          label="UI/UX Daily Challenge"
          iconColor="text-gray-500"
        />
        <SidebarItem
          icon={UserCircle}
          label="Marketplace Local"
          iconColor="text-gray-500"
        />
      </div>

      {/* Footer Links */}
      <footer className="mt-4 px-2 text-[12px] text-gray-500 leading-tight">
        <p className="hover:underline cursor-pointer inline">Privacy</p> ·
        <p className="hover:underline cursor-pointer inline"> Terms</p> ·
        <p className="hover:underline cursor-pointer inline"> Advertising</p> ·
        <p className="hover:underline cursor-pointer inline"> Cookies</p> ·
        <p className="cursor-default inline"> Meta © 2026</p>
      </footer>
    </aside>
  );
};

export default LeftSidebar;
