import { Container, type ContainerStyles } from "../Container/Container";

import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  as?: "div" | "li";
  padding?: ContainerStyles["padding"];
  isInteractive?: boolean;
  styles?: ContainerStyles<"padding" | "position" | "maxWidth" | "textAlign">;
};

export function Card({
  children,
  as = "div",
  padding = "m",
  isInteractive = false,
  styles = {},
}: CardProps) {
  return (
    <Container
      as={as}
      data-component="Card"
      styles={{
        ...styles,
        display: "block",
        background: "default",
        position: "relative",
        padding,
        cursor: isInteractive ? "pointer" : "default",
        radius: "m",
        shadow: "default",
        customCSSProperties: padding
          ? {
              [`component-layout-padding-x`]: `var(--ui-semantic-padding-x-${padding})`,
              [`component-layout-padding-y`]: `var(--ui-semantic-padding-y-${padding})`,
            }
          : undefined,
      }}
    >
      {children}
    </Container>
  );
}
