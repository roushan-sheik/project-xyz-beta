import type { ReactNode, HTMLAttributes } from "react";
import React from "react";

type SectionContainerProps = {
  children: ReactNode;
  containerWrapperProps?: HTMLAttributes<HTMLDivElement>;
  containerInnerProps?: HTMLAttributes<HTMLDivElement>;
};

const SectionContainer = ({
  children,
  containerInnerProps,
  containerWrapperProps,
}: SectionContainerProps) => {
  const { className: wrapperClassName, ...restWrapperProps } =
    containerWrapperProps || {};
  const { className: innerClassName, ...restInnerProps } =
    containerInnerProps || {};

  return (
    <div
      className={`flex items-center justify-center max-w-full px-4 w-full ${
        wrapperClassName || ""
      }`}
      {...restWrapperProps}
    >
      <div
        className={`flex flex-col mx-auto xl:max-w-[85%] w-full ${
          innerClassName || ""
        }`}
        {...restInnerProps}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionContainer;
