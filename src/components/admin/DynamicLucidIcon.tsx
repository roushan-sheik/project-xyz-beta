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
  const IconComponent = LucidIcons[name] as React.FC<LucideProps>;

  if (!IconComponent) {
    console.warn(`Lucide Icon "${name}" not found. Rendering fallback.`);
    return (
      <LucidIcons.AlertTriangle
        size={props.size || 24}
        className={props.className || "text-red-500"}
      />
    );
  }

  return <IconComponent {...props} />;
};

export default DynamicLucidIcon;
