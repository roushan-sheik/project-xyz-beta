"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { menuItems } from "@/constants/home/home";
import { MenuItem } from "@/types/home/types";
import Cart from "@/components/ui/Cart";
import SectionContainer from "@/shared/SectionContainer";
import Loading from "@/components/loading/Loading";
import MenuProfile from "@/components/user/MenuProfile";
import { useSubscriptionGuard } from "@/hooks/payment/useSubscriptionGuard";
import { user_role } from "@/constants/role";

const MainComponent = () => {
  const router = useRouter();

  const { subscriptionStatus, loading, hasActiveSubscription, isPremium } =
    useSubscriptionGuard(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const role = localStorage.getItem("role");

    if (role === user_role.SUPER_ADMIN) {
      router.push("/admin");
      return;
    }

    if (!loading && !hasActiveSubscription) {
      router.replace("/login");
    }
  }, [loading, hasActiveSubscription, router]);

  if (loading) {
    return (
      <div className="min-h-screen main_gradient_bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">認証中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main_gradient_bg min-h-screen text-white">
      {/* Profile Section */}
      <MenuProfile />

      {/* Content Section */}
      <SectionContainer>
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mx-auto">
            {menuItems.map((item: MenuItem) => (
              <Link key={item.id} href={item.path}>
                <Cart item={item} />
              </Link>
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default MainComponent;
