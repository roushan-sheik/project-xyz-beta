"use client";

import React, { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}
const user = {
  role: "Admin",
  name: "Jhon",
  avatar: "",
  email: "test@gmail.com",
};

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    // logout();
    setShowUserMenu(false);
  };

  const notifications = [
    {
      id: 1,
      message: "New photo edit request received",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "Payment completed successfully",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "User registration approved",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <header className="bg-pri shadow-pri card border-0 border-b border-white/10 w-full">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 lg:py-5">
          {/* Left Section */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg glass hover:glass-mid transition-all duration-200 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>

            {/* Logo & Title */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm">
                  R
                </span>
              </div>
              <div className="hidden sm:block min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                  {user?.role === "admin" ? "Admin Console" : "User Console"}
                </h1>
                <p className="text-gray-400 text-xs truncate">
                  Welcome back, {user?.name}
                </p>
              </div>
              {/* Mobile title */}
              <div className="sm:hidden min-w-0 flex-1">
                <h1 className="text-base font-bold text-white truncate">
                  {user?.role === "admin" ? "Admin" : "Dashboard"}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex items-center">
              <div className="glass px-3 py-2 rounded-lg flex items-center space-x-2 w-48 xl:w-64">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search requests, users..."
                  className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-1 text-sm"
                />
              </div>
            </div>

            {/* Mobile Search Button */}
            <button className="lg:hidden p-2 rounded-lg glass hover:glass-mid transition-all duration-200">
              <Search size={18} className="text-gray-300" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg glass hover:glass-mid transition-all duration-200 relative"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-gray-300 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 glass-card rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <h3 className="text-white font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-white/5 transition-colors ${
                          notification.unread ? "border-l-2 border-red-500" : ""
                        }`}
                      >
                        <p className="text-white text-sm line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-white/10">
                    <button
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg glass hover:glass-mid transition-all duration-200"
                aria-label="User menu"
              >
                <Image
                  width={40}
                  height={40}
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  }
                  alt={user?.name as string}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="hidden md:block text-left min-w-0">
                  <p className="text-white text-sm font-medium truncate max-w-20 lg:max-w-none">
                    {user?.name}
                  </p>
                  <p className="text-gray-400 text-xs capitalize truncate">
                    {user?.role}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 glass-card rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium truncate text-sm">
                      {user?.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center space-x-2 text-sm">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
