import SafeImage from "../SafeImage";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function LeftSidebar({ loggedInUser }) {

  return (
    <div className="w-0 md:min-w-70 md:w-[23%] hidden md:block p-2 z-9 fixed">
      <div className="w-full pb-4 mb-100">
        <div className="flex items-center bg-bg-white1 dark:bg-dark-card border border-border dark:border-border-dark shadow-md rounded-xl space-x-3 p-2 cursor-pointer transition-all duration-200">
          {/* <div className="w-8 h-8 rounded-full overflow-hidden z-20 relative">
            </div> */}
          <Avatar className="w-9 md:w-10 h-9 md:h-10">
            <SafeImage
              src={loggedInUser?.profileImageUrl !== "" ? loggedInUser?.profileImageUrl : null}
              fill
              alt="User Profile Image"
              className="object-contain"
            />
            <AvatarFallback className={'bg-gray-100 dark:bg-dark-card2 text-[22px] text-primary font-bold'}>{loggedInUser?.firstName?.[0] + loggedInUser?.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <p className="font-medium text-[15px] text-text1 dark:text-text-dark">{`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}</p>
        </div>
      </div>

      <div className="border-t border-border dark:border-border-dark mb-7"></div>
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