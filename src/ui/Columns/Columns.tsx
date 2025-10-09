import { Container, ContainerStyles } from "../Container/Container";

import type { ColorStyles } from "../Container/styles";
import type { ReactNode } from "react";

type ColumnsProps = {
  id?: string;
  isInline?: boolean;
  children: ReactNode;
  as?: "div" | "li";
  styles?: ContainerStyles<
    | ColorStyles
    | "position"
    | "padding"
    | "radius"
    | "overflow"
    | "flexGrow"
    | "width"
    | "radius"
    | "shadow"
    | "gridArea"
  >;
  template?: ContainerStyles["gridTemplateColumns"];
  gap?: ContainerStyles["gap"];
  align?: ContainerStyles["alignItems"];
  justify?: ContainerStyles["justifyContent"];
  wrap?: ContainerStyles["flexWrap"];
};

export function Columns({
  id,
  as = "div",
  children,
  template: gridTemplateColumns,
  gap,
  align,
  justify,
  styles = {},
  isInline = false,
  wrap,
}: ColumnsProps) {
  const displayType = gridTemplateColumns != null ? "grid" : "flex";
  const { padding, ...otherStyles } = styles;

  return (
    <Container
      id={id}
      as={as}
      data-component="Columns"
      styles={{
        ...otherStyles,
        padding,
        customCSSProperties:
          padding && padding !== "none"
            ? {
                [`--component-layout-padding-x`]: `var(--ui-semantic-padding-x-${padding})`,
                [`--component-layout-padding-y`]: `var(--ui-semantic-padding-y-${padding})`,
              }
            : undefined,
        display: isInline ? `inline-${displayType}` : displayType,
        width: styles?.width ?? isInline ? undefined : "100%",
        alignItems: align,
        gap,
        gridTemplateColumns,
        justifyContent: justify,
        flexWrap: wrap,
      }}
    >
      {children}
    </Container>
  );
}
