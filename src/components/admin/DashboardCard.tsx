import { DashboardCardProps } from "@/types/admin/types";
import DynamicLucidIcon from "./DynamicLucidIcon";

const DashboardCard: React.FC<DashboardCardProps> = ({ label, icon }) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="w-12 h-12 flex items-center justify-center bg-brand-50 rounded-full mb-4">
        <DynamicLucidIcon name={icon} size={24} className="text-brand-500" />
      </div>
      <h3 className="text-body1 font-medium text-neutral-800">{label}</h3>
    </div>
  );
};

export default DashboardCard;
