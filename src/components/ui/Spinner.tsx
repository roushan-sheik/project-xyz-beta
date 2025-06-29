import React from "react";

const Spinner = () => {
  return (
    <div className="  text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      </div>
    </div>
  );
};

export default Spinner;
