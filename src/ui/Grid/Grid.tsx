import { type ReactNode } from "react";
import { Container, type ContainerStyles } from "../Container/Container";
import type { WithMediaQuery } from "../Container/styles";

type GridProps = {
  columns: WithMediaQuery<number | string[]>;
  children: ReactNode;
  gap?: ContainerStyles["gap"];
  align?: ContainerStyles["alignItems"];
  justify?: ContainerStyles["justifyContent"];
  styles?: ContainerStyles<"maxWidth" | "width" | "minWidth">;
};

export function Grid({
  children,
  columns,
  gap,
  align,
  justify,
  styles,
}: GridProps) {
  return (
    <Container
      data-component="Grid"
      styles={{
        ...styles,
        display: "grid",
        gap,
        alignItems: align,
        justifyContent: justify,
        width: styles?.width ?? "100%",
        gridTemplateColumns: columns,
      }}
    >
      {children}
    </Container>
  );
}
