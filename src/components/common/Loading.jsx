import React from "react";

const Loading = () => {
  return (
    <div className="flex bg-base dark:bg-darkBase dark:text-white justify-center items-center min-h-screen">
      <div className="">
        <span className="loading loading-bars loading-xs"></span>
        <span className="loading loading-bars loading-sm"></span>
        <span className="loading loading-bars loading-md"></span>
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-xl"></span>
      </div>
    </div>
  );
};

export default Loading;
