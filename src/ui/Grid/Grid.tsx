import { type ReactNode } from "react";
import {
  computeAlignItems,
  computeGap,
  computeJustifyContent,
  ContainerStyles,
} from "../Container/Container";

type GridProps = {
  columns: number | string[];
  children: ReactNode;
  gap?: ContainerStyles["gap"];
  align?: ContainerStyles["alignItems"];
  justify?: ContainerStyles["justifyContent"];
};

const getColumnsStyle = (columns: number | string[]) => {
  if (typeof columns === "number") {
    return `repeat(${columns}, 1fr)`;
  }
  return columns.join(" ");
};

export function Grid({ children, columns, gap, align, justify }: GridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: getColumnsStyle(columns),
        gap: computeGap(gap),
        alignItems: computeAlignItems(align),
        justifyContent: computeJustifyContent(justify),
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
