import React from "react";
import { cn } from "@/utils/function/cn";

interface MenuProps {
  text: string;
  position?: "left" | "center" | "right";
  fontSize?: "title1" | "title2" | "title3";
  className?: string;
}

const Menu: React.FC<MenuProps> = ({
  text,
  position = "center",
  fontSize = "title3",
  className,
}) => {
  return (
    <div
      className={cn(
        position === "left" && "text-left",
        position === "center" && "text-center",
        position === "right" && "text-right",
        " cursor-pointer uppercase text-white "
      )}
    >
      <h2 className={cn(`text-${fontSize} my-2  ${className}`)}>{text}</h2>
      <div className="glass"></div>
    </div>
  );
};

export default Menu;
