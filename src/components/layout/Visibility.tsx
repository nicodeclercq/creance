import React, { ReactNode } from "react";

type Props = {
  isVisible: boolean;
  children: ReactNode;
};

export function Visibility({ isVisible, children }: Props) {
  return (
    <div
      aria-hidden={!isVisible}
      style={{
        display: "inline-block",
        visibility: isVisible ? "visible" : "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? undefined
          : "translateX(-200vw) translateY(-200vh)",
      }}
    >
      {children}
    </div>
  );
}
