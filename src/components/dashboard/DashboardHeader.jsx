import React from "react";

const DashboardHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
};

export default DashboardHeader;
