export const NavIcon = ({ Icon, active = false, className = "" }) => (
  <div className={`flex items-center cursor-pointer md:px-10 sm:h-14 md:hover:bg-gray-100 rounded-xl group ${className}`} >
    <Icon className={`h-6 text-center sm:h-7 mx-auto group-hover:text-blue-500 ${ active ? "text-blue-500" : "text-gray-500" }`} />
  </div>
);
