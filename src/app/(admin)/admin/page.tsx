import DashboardCard from "@/components/admin/DashboardCard";
import LogoutButton from "@/components/logout/Logout";
import { dashboardCards } from "@/constants/admin";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-title3 sm:text-heading1 font-bold  text-neutral-900 mb-6 sm:mb-8 hidden lg:block">
        ダッシュボード
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
}
