import { Container, type ContainerStyles } from "../Container/Container";
import type { TypographyStyles, LayoutStyles } from "../Container/styles";
import type { ReactNode } from "react";

export type ParagraphProps = {
  id?: string;
  children: ReactNode;
  styles?: ContainerStyles<
    TypographyStyles | LayoutStyles | "customCSSProperties" | "gridArea"
  >;
};

export function Paragraph({ id, styles, children }: ParagraphProps) {
  return (
    <Container
      id={id}
      as="p"
      data-component="Paragraph"
      styles={{ ...styles, customCSSProperties: { "--icon-margin": "0.3rem" } }}
    >
      {children}
    </Container>
  );
}
