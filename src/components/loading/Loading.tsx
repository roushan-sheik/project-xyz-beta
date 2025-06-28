import React from "react";

const Loading = () => {
  return (
    <div className="main_gradient_bg flex justify-center items-center min-h-screen w-full">
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-white text-heading2">読み込み中...</h2>
      </div>
    </div>
  );
};

export default Loading;
