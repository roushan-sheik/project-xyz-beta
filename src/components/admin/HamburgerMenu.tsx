// src/components/HamburgerMenu.tsx
import React from "react";
import DynamicLucidIcon from "./DynamicLucidIcon";

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 rounded-md lg:hidden"
      aria-label="Toggle sidebar"
    >
      {isOpen ? (
        <DynamicLucidIcon name="X" size={24} />
      ) : (
        <DynamicLucidIcon name="Menu" size={24} />
      )}
    </button>
  );
};

export default HamburgerMenu;
