"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { useState } from "react";

import Sidebar from "@/components/admin/Sidebar";
import { navItems } from "@/constants/admin";
import HamburgerMenu from "@/components/admin/HamburgerMenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`flex flex-col lg:flex-row bg-gray-50 min-h-screen font-sans`}
    >
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header for hamburger menu and main content title */}
        <header className="bg-white  fixed w-full z-20  shadow-sm p-4 border-b border-gray-200 flex items-center lg:hidden">
          <HamburgerMenu isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          <h1 className="text-heading2 font-bold text-neutral-900 ml-4">
            管理画面
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 mt-18 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
