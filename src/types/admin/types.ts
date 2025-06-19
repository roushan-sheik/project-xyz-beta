import { LucidIconName } from "@/components/admin/DynamicLucidIcon";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucidIconName;
}

export interface DashboardCardProps {
  id: string;
  label: string;
  href: string;
  icon: string; // Using string for icon name
}
