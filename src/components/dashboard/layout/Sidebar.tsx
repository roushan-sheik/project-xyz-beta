"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { MENU_ITEMS } from "@/constants/dashboard/constants";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // const { user } = useAuth();
  const pathname = usePathname();
  const user = {
    role: "admin",
    name: "Jhon",
    avatar: "",
    email: "test@gmail.com",
  };
  const filteredMenuItems = MENU_ITEMS.filter((item) =>
    item.roles.includes("user")
  );

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<any>;
    return IconComponent || Icons.Home;
  };

  return (
    <aside className="w-64 xl:w-90 h-full bg-pri border-0  flex flex-col overflow-hidden">
      {/* Close button for mobile - positioned absolutely */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Close sidebar"
      >
        <Icons.X size={20} />
      </button>

      {/* Logo Section */}
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg">R</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-bold text-base sm:text-lg truncate">
              RequestHub
            </h2>
            <p className="text-gray-400 text-xs capitalize truncate">
              {user?.role} Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
        <div className="space-y-1 sm:space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={onClose}
                className={`
                  w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-gradient-to-r from-red-600/20 to-red-700/20 text-white border border-red-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0 ml-2">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info Section */}
      <div className="p-3 sm:p-4 border-t border-white/10">
        <div className="glass p-3 sm:p-4 rounded-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image
              width={100}
              height={100}
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              }
              alt={user?.name as string}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-xs sm:text-sm truncate">
                {user?.name}
              </p>
              <p className="text-gray-400 text-xs capitalize truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
