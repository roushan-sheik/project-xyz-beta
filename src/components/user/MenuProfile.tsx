"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/utils/function/cn";
import { useUser } from "@/context/AuthContext";
import LogoutButton from "../logout/Logout";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MenuProfileProps {
  className?: string;
}

const MenuProfile: React.FC<MenuProfileProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const router = useRouter();

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, closeDropdown]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeDropdown();
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, closeDropdown]);

  const handleMenuItemClick = (action: string) => {
    closeDropdown();

    switch (action) {
      case "profile":
        break;
      case "logout":
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    closeDropdown();
  };

  return (
    <div className={cn("py-2 ", className)}>
      <div className="relative">
        {/* Header Section */}
        <div className="flex items-center justify-between text-center">
          <div className="flex-1" />

          <h2 className="text-title3 mb-2 mt-3 uppercase text-white font-medium">
            Menu
          </h2>

          <div className="flex-1 flex justify-end">
            {user && (
              <div className="relative">
                {/* Profile Avatar Button */}
                <div
                  ref={buttonRef}
                  className="inline-block lg:mr-22 mr-4 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-full"
                  onClick={toggleDropdown}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleDropdown();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-400 transition-colors duration-300 bg-gray-100">
                    <Image
                      src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                      alt="User Profile"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>

                  {/* Active Status Indicator */}
                  <span
                    className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"
                    aria-hidden="true"
                  />
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute lg:right-22 right-4 mt-2 w-64 origin-top-right rounded-2xl glass-profile shadow-2xl ring-1 ring-black ring-opacity-10 z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-lg border border-gray-200/40"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="py-2 px-3 flex flex-col gap-2">
                      {/* Remove Back Button */}
                      <Link href={"/user/profile"}>
                        <button
                          onClick={() => handleMenuItemClick("profile")}
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 rounded-lg font-medium"
                          role="menuitem"
                        >
                          My Profile
                        </button>
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <LogoutButton size="md" className="w-full" variant="dark">
                        LogOut
                      </LogoutButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Glass effect element if needed */}
        <div className="glass" />
      </div>
    </div>
  );
};

export default MenuProfile;
