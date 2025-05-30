import {
  ColorStyles,
  Container,
  ContainerStyles,
} from "../Container/Container";

import type { ReactNode } from "react";

type ColumnsProps = {
  isInline?: boolean;
  children: ReactNode;
  as?: "div" | "li";
  styles?: ContainerStyles<
    ColorStyles | "position" | "padding" | "radius" | "overflow" | "flexGrow"
  >;
  template?: ContainerStyles["gridTemplateColumns"];
  gap?: ContainerStyles["gap"];
  align?: ContainerStyles["alignItems"];
  justify?: ContainerStyles["justifyContent"];
  wrap?: ContainerStyles["flexWrap"];
};

export function Columns({
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
  return (
    <Container
      as={as}
      styles={{
        ...styles,
        display: isInline ? "inline-flex" : "flex",
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
