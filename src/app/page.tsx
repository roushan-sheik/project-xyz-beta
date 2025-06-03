/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import SectionContainer from "@/shared/SectionContainer";
import { useState } from "react";
import { menuItems } from "@/constants/home/home";
import { MenuItem } from "@/types/home/types";
import Cart from "@/components/ui/Cart";

import Link from "next/link";
import Menu from "@/components/home/Menu";

const MainComponent = () => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="main_gradient_bg min-h-screen flex items-center justify-center">
        <h2 className="text-white text-heading2">読み込み中...</h2>
      </div>
    );
  }

  return (
    <div className="main_gradient_bg">
      <Menu text="Menu" />
      <SectionContainer>
        <div className="  py-12   md:py-16  lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-4 w-full  mx-auto">
            {menuItems.map((item: MenuItem) => {
              return (
                <div key={item.id}>
                  <Link href={item.path}>
                    <Cart item={item} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default MainComponent;
