import { Container, type ContainerStyles } from "../Container/Container";
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
  width?: ContainerStyles["width"] | "auto";
  styles?: ContainerStyles<
    | "background"
    | "color"
    | "zIndex"
    | "radius"
    | "shadow"
    | "border"
    | "padding"
    | "overflow"
    | "height"
    | "width"
    | "maxWidth"
    | "minWidth"
    | "gridArea"
  >;
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
        ...styles,
        display: "flex",
        flexDirection: "column",
        alignItems,
        justifyContent,
        gap,
        padding,
        width: styles?.width ?? width,
        customCSSProperties:
          padding && padding !== "none"
            ? {
                [`--component-layout-padding-x`]: `var(--ui-semantic-padding-x-${padding})`,
                [`--component-layout-padding-y`]: `var(--ui-semantic-padding-y-${padding})`,
              }
            : undefined,
      }}
      data-component="Stack"
    >
      {children}
    </Container>
  );
}
