"use client";

import SectionContainer from "@/shared/SectionContainer";
import { useEffect } from "react";
import { menuItems } from "@/constants/home/home";
import { MenuItem } from "@/types/home/types";
import Cart from "@/components/ui/Cart";
import { useUser } from "@/context/AuthContext";
import Link from "next/link";
import Menu from "@/components/home/Menu";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/Loading";

const MainComponent = () => {
  const { user, isLoading } = useUser();
  console.log({ user });
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading]);

  // Block UI from rendering until we are sure
  if (isLoading || (!user && typeof window !== "undefined")) {
    return <Loading />;
  }

  return (
    <div className="main_gradient_bg">
      <Menu text="Menu" />
      <SectionContainer>
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-4 w-full mx-auto">
            {menuItems.map((item: MenuItem) => (
              <div key={item.id}>
                <Link href={item.path}>
                  <Cart item={item} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default MainComponent;
