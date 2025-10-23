import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../context/FirebaseContext";
import { ThemContext } from "../../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";

const DashboardNavbar = () => {
  const { user, logOutUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser().then(() => {
      Swal.fire({
        icon: "success",
        title: "Logged Out Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-darkNavbar shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">LitShelf</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </Link>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <MdDarkMode size={24} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <MdLightMode size={24} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Home Button */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              <FaHome />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || "https://via.placeholder.com/40"}
                alt={user?.displayName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-bgBtn"
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
