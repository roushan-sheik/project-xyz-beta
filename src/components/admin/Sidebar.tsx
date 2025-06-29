"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DynamicLucidIcon from "./DynamicLucidIcon";
import { NavItem } from "@/types/admin/types";
import { LayoutDashboard } from "lucide-react";
import LogoutButton from "../logout/Logout";

interface SidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, isOpen, onClose }) => {
  const pathname = usePathname();

  const handleNavLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-basic-black bg-opacity-50 z-30 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar itself */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white  border-r border-gray-200 p-4 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-80 lg:min-h-screen
          ${isOpen ? "translate-x-0 z-40 w-72" : "-translate-x-full z-40 w-64"}
        `}
      >
        <div className="flex flex-col  justify-between h-full">
          <div className="flex flex-col">
            <div className="mb-8 ml-3 text-title3  font-bold text-neutral-900 flex justify-between gap-3 items-center">
              <div className="flex gap-2 items-center">
                <LayoutDashboard /> <span>管理画面</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-700 focus:outline-none rounded-md lg:hidden"
                aria-label="Close sidebar"
              >
                <DynamicLucidIcon name="X" size={24} />
              </button>
            </div>
            <nav>
              <ul>
                {navItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    <Link
                      href={item.href}
                      className={`
                    flex items-center p-3 rounded-lg transition-colors duration-200 text-body2
                    ${
                      pathname === item.href
                        ? "bg-brand-100 text-brand-700 font-semibold"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                    }
                  `}
                      onClick={handleNavLinkClick}
                    >
                      <span className="mr-3">
                        <DynamicLucidIcon name={item.icon} size={20} />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8"></div>
            </nav>
          </div>
          <LogoutButton variant="dark" className="w-full mb-4">
            Logout
          </LogoutButton>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
