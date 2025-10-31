import { Container, type ContainerStyles } from "../Container/Container";
import type { TypographyStyles, LayoutStyles } from "../Container/styles";
import type { ReactNode } from "react";

export type SpanProps = {
  id?: string;
  children: ReactNode;
  styles?: ContainerStyles<
    TypographyStyles | LayoutStyles | "customCSSProperties" | "gridArea"
  >;
};

export function Span({ id, styles, children }: SpanProps) {
  return (
    <Container
      id={id}
      as="span"
      data-component="Span"
      styles={{ ...styles, customCSSProperties: { "--icon-margin": "0.3rem" } }}
    >
      {children}
    </Container>
  );
}
