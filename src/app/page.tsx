"use client";

import SectionContainer from "@/shared/SectionContainer";
import { useState } from "react";

const MainComponent = () => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <h2>読み込み中...</h2>;
  }

  return (
    <div className="main_gradient_bg">
      <SectionContainer>
        <div className="bg-white w-full h-20"></div>
      </SectionContainer>
    </div>
  );
};

export default MainComponent;
