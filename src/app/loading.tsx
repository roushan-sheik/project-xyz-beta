import React from "react";

const loading = () => {
  return (
    <div className="main_gradient_bg flex justify-center items-center min-h-screen w-full">
      <div className=" min-h-screen flex items-center justify-center">
        <h2 className="text-white text-heading2">読み込み中...</h2>
      </div>
    </div>
  );
};

export default loading;
