const SidebarItem = ({ icon: Icon, label, iconColor }) => (
  <div className="flex items-center space-x-3 p-2 hover:bg-gray-200 cursor-pointer transition-all duration-200 group">
    <div className={`${iconColor || "text-blue-500"} transition-transform group-active:scale-95`}>
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <span className="font-medium text-[15px] text-gray-800">{label}</span>
  </div>
);

export default SidebarItem;