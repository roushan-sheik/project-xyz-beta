export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string; // Using string for icon name to be mapped to Lucid Icon component
}

export interface DashboardCardProps {
  id: string;
  label: string;
  icon: string; // Using string for icon name
}
