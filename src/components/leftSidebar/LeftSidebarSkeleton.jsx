
export default function LeftSidebarSkeleton() {

  return (
    <div className="w-0 md:min-w-70 md:w-[23%] hidden md:block p-2 bg-bg dark:bg-dark border-r border-border dark:border-border-dark z-9 fixed">
      <div className="w-full pb-4 mb-100">
        <div className="flex items-center shadow-md rounded-xl space-x-3 p-2 cursor-pointer transition-all duration-200">
          <div className="w-9 md:w-10 h-9 md:h-10 text-primary border border-border bg-bg-white1 dark:bg-dark-card rounded-full">
            NU
          </div>
          <p className="text-[22px] text-text1 dark:text-text-dark">New User</p>
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