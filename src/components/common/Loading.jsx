import React from "react";

const Loading = () => {
  return (
    <div className="flex bg-base dark:bg-darkBase dark:text-white justify-center items-center min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Custom book-themed loading spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute w-full h-full animate-spin rounded-full border-4 border-transparent border-t-bgBtn dark:border-t-bgBtn/50"></div>
          <div className="absolute w-3/4 h-3/4 animate-spin rounded-full border-4 border-transparent border-b-bgBtn dark:border-b-bgBtn/50"></div>
          <svg
            className="w-8 h-8 text-bgBtn dark:text-bgBtn/80 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>

        {/* Loading text with animation */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bgBtn dark:text-bgBtn/80 mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Preparing your reading experience</p>
        </div>

        {/* Animated progress dots */}
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 bg-bgBtn dark:bg-bgBtn/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}></div>
          <div
            className="w-3 h-3 bg-bgBtn dark:bg-bgBtn/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}></div>
          <div
            className="w-3 h-3 bg-bgBtn dark:bg-bgBtn/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
