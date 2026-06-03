import SafeImage from "../SafeImage";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function LeftSidebar({ loggedInUser }) {

  return (
    <div className="w-0 md:min-w-70 md:w-[23%] hidden md:block p-2 bg-bg dark:bg-[#333334] border-r border-border z-9 fixed">
      <div className="w-full pb-4 mb-100">
        <div className="flex items-center bg-card border border-border shadow-md rounded-xl space-x-3 p-2 cursor-pointer transition-all duration-200">
          {/* <div className="w-8 h-8 rounded-full overflow-hidden z-20 relative">
            </div> */}
          <Avatar className="w-8 md:w-8 h-8 md:h-8 border-3 md:border-0 border-border bg-neutral-300">
            <SafeImage
              src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
              fill
              alt="User Profile Image"
              className="object-contain"
            />
            <AvatarFallback className={'text-md font-bold'}>{loggedInUser?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <p className="font-medium text-[15px] text-primary">{`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}</p>
        </div>
      </div>

      <div className="border-t border-border mb-7"></div>
      <footer className="mt-4 px-2 text-[12px] text-label leading-tight">
        <p className="hover:underline cursor-pointer inline">Privacy</p> ·
        <p className="hover:underline cursor-pointer inline"> Terms</p> ·
        <p className="hover:underline cursor-pointer inline"> Advertising</p> ·
        <p className="hover:underline cursor-pointer inline"> Cookies</p> ·
        <p className="cursor-default inline"> Meta © 2026</p>
      </footer>
    </div>
  );
};