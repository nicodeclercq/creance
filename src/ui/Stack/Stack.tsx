import {
  ContainerStyles,
  computeGap,
  computePadding,
} from "../Container/Container";

import type { ReactNode } from "react";
import styles from "./Stack.module.css";

type StackProps = {
  children: ReactNode;
  as?: "div" | "ul" | "ol";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "stretch";
  gap?: ContainerStyles["gap"];
  padding?: ContainerStyles["padding"];
  width?: "auto" | `${number}%` | `${number}vw`;
};

export function Stack({
  children,
  as: Component = "div",
  alignItems = "start",
  justifyContent = "start",
  gap = "none",
  padding = "none",
  width = "100%",
}: StackProps) {
  return (
    <Component
      className={styles.stack}
      style={{
        alignItems,
        justifyContent,
        gap: computeGap(gap),
        padding: computePadding(padding),
        width,
      }}
    >
      {children}
    </Component>
  );
}
