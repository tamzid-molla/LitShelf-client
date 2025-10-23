import React from "react";

const DashboardSidebar = ({ 
  userData, 
  activeTab, 
  setActiveTab, 
  setSidebarOpen, 
  menuItems,
  userRole,
  children
}) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={userData?.photoURL || "https://via.placeholder.com/150"}
              alt={userData?.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-bgBtn"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-darkBase-secondary"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[150px]">
              {userData?.name || userData?.displayName}
            </h3>
            <p className="text-xs text-bgBtn font-semibold uppercase">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? "bg-gradient-to-r from-bgBtn to-bgBtn/80 text-white shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <item.icon className="text-xl flex-shrink-0" />
            <span className="font-semibold truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Additional Content (like Quick Actions for User Dashboard) */}
      {children && (
        <div className="flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;
