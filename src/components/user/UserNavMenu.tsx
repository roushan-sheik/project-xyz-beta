"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiImage, FiVideo, FiGift, FiEdit, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { cn } from "@/utils/function/cn";
import LogoutButton from "@/components/logout/Logout";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: <FiHome /> },
  { label: "Alibi Photos", href: "/alibi-photos", icon: <FiImage /> },
  { label: "Alibi Video", href: "/alibi-video", icon: <FiVideo /> },
  { label: "Alibi Souvenir", href: "/alibi-souvenir", icon: <FiGift /> },
  { label: "Photo Edit", href: "/photo-edit", icon: <FiEdit /> },
  { label: "Profile", href: "/user/profile", icon: <FiUser /> },
];

const UserNavMenu = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full z-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo or Brand */}
          <div className="flex items-center gap-2 text-xl font-bold text-white drop-shadow-lg">
            <FiHome className="text-blue-400" />
            XYZ Premium
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-white/20">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full transition-colors cursor-pointer text-white hover:bg-blue-400/20 hover:text-blue-300",
                    pathname === item.href && "bg-blue-400/30 text-blue-200 font-semibold"
                  )}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            ))}
            <LogoutButton />
          </div>
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-full bg-white/10 hover:bg-blue-400/20 text-white"
              aria-label="Open menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 right-0 w-64 h-full bg-white/10 backdrop-blur-lg shadow-2xl border-l border-white/20 flex flex-col gap-2 p-6 animate-in slide-in-from-right-10 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-lg text-white hover:bg-blue-400/20 hover:text-blue-300 transition-colors cursor-pointer",
                    pathname === item.href && "bg-blue-400/30 text-blue-200 font-semibold"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            ))}
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavMenu; 