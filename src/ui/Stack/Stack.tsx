import { Container, ContainerStyles } from "../Container/Container";

import type { ReactNode } from "react";

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
  width?: ContainerStyles["width"];
  styles?: ContainerStyles<"background" | "color" | "zIndex">;
};

export function Stack({
  children,
  as,
  alignItems = "start",
  justifyContent = "start",
  gap = "none",
  padding = "none",
  width = "100%",
  styles,
}: StackProps) {
  return (
    <Container
      as={as}
      styles={{
        background: "transparent",
        ...styles,
        display: "flex",
        flexDirection: "column",
        alignItems,
        justifyContent,
        gap,
        padding,
        width,
      }}
    >
      {children}
    </Container>
  );
}
