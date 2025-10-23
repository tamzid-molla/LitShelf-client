import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const MobileMenuButton = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="lg:hidden fixed bottom-6 right-6 z-50 bg-bgBtn text-white p-4 rounded-full shadow-2xl hover:bg-hoverBtn transition-all hover:scale-110"
      aria-label="Toggle menu"
    >
      {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
    </button>
  );
};

export default MobileMenuButton;
