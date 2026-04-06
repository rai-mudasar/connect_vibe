"use client";

import SafeImage from "./SafeImage";
import { Avatar, AvatarFallback } from "./ui/avatar";

const LeftSidebar = ({loggedInUser}) => {

  return (
    <aside className="w-75 h-[calc(100vh-56px)] hidden md:block fixed left-0 top-16 p-2 xl:block bg-[#F2F4F7] dark:bg-[#333334] custom-scrollbar hover:overflow-y-auto">
      <div className="space-y-0.5 pb-4 mb-100">
        <div className="w-67 flex items-center shadow-md rounded-xl space-x-3 p-2 hover:bg-gray-200 cursor-pointer transition-all duration-200 group mr-7">
          {/* <div className="w-8 h-8 rounded-full overflow-hidden z-20 relative">
            </div> */}
          <Avatar className="w-8 md:w-8 h-8 md:h-8 border-3 md:border-0 border-white bg-neutral-300">
            <SafeImage
              src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
              fill
              alt="User Profile Image"
              className="object-contain"
            />
            <AvatarFallback className={'text-md font-bold'}>{loggedInUser?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <p className="font-medium text-[15px] text-gray-800">{`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}</p>
        </div>
      </div> 

      <div className="border-t border-gray-300 mb-7"></div>
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
