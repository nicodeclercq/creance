import { Container, type ContainerStyles } from "../Container/Container";
import { createContext, useContext, type ReactNode } from "react";

const CardContext = createContext(false);

type CardProps = {
  children: ReactNode;
  as?: "div" | "li";
  padding?: ContainerStyles["padding"];
  isInteractive?: boolean;
  styles?: ContainerStyles<
    "padding" | "position" | "maxWidth" | "textAlign" | "breakInside"
  >;
};

export function Card({
  children,
  as = "div",
  padding = "m",
  isInteractive = false,
  styles = {},
}: CardProps) {
  const isNested = useContext(CardContext);

  return (
    <Container
      as={as}
      data-component="Card"
      styles={{
        ...styles,
        display: "block",
        width: "100%",
        background: "default",
        position: "relative",
        padding,
        cursor: isInteractive ? "pointer" : "default",
        radius: "m",
        shadow: isNested ? "none" : "default",
        border: isNested ? "default" : "none",
        customCSSProperties: padding
          ? {
              [`--component-layout-padding-x`]: `var(--ui-semantic-padding-x-${padding})`,
              [`--component-layout-padding-y`]: `var(--ui-semantic-padding-y-${padding})`,
            }
          : undefined,
      }}
    >
      <CardContext.Provider value={true}>{children}</CardContext.Provider>
    </Container>
  );
}
