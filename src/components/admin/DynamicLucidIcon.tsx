import React from "react";
import * as LucidIcons from "lucide-react";
import { LucideProps } from "lucide-react";

export type LucidIconName = keyof typeof LucidIcons;

interface DynamicLucidIconProps extends LucideProps {
  name: LucidIconName;
}

const DynamicLucidIcon: React.FC<DynamicLucidIconProps> = ({
  name,
  ...props
}) => {
  const IconComponent = LucidIcons[name];

  if (!IconComponent) {
    console.warn(`Lucid Icon "${name}" not found. Rendering a fallback icon.`);
    return (
      <LucidIcons.AlertTriangle
        size={props.size || 24}
        className={props.className || "text-red-500"}
      />
    );
  }

  return React.createElement(IconComponent, props);
};

export default DynamicLucidIcon;
