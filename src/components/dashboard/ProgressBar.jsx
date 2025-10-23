import React from "react";

/**
 * ProgressBar Component
 * A reusable progress bar for displaying reading progress
 */
const ProgressBar = ({ label, percentage, color = "bgBtn" }) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className={`text-sm font-bold text-${color}`}>
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className={`bg-gradient-to-r from-${color} to-${color}/80 h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
