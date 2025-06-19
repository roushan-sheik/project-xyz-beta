"use client";
import React, { useState, useEffect } from "react";

import Sidebar from "@/components/dashboard/layout/Sidebar";
import Header from "@/components/dashboard/layout/Header";
import { useUser } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change and handle window resize
  useEffect(() => {
    setIsSidebarOpen(false);

    const handleResize = () => {
      // Auto-close sidebar on mobile when resizing
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside (mobile)
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="main_gradient_bg min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            <span className="text-white font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="main_gradient_bg min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl text-center max-w-md w-full mx-4">
          <h2 className="text-white text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-4">Please login to continue</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 w-full sm:w-auto"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main_gradient_bg h-screen overflow-hidden flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Always fixed, never scrolls */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-auto lg:flex-shrink-0
        `}
      >
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main Content Area - Fixed height with internal scrolling */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed at top, never scrolls */}
        <div className="flex-shrink-0 z-30">
          <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        {/* Page Content - Only this scrolls */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
