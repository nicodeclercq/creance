import {
  Container,
  ContainerStyles,
  LayoutStyles,
  TypographyStyles,
} from "../Container/Container";

import type { ReactNode } from "react";

export type ParagraphProps = {
  id?: string;
  children: ReactNode;
  styles?: ContainerStyles<
    TypographyStyles | LayoutStyles | "customCSSProperties"
  >;
};

export function Paragraph({ id, styles, children }: ParagraphProps) {
  return (
    <Container
      id={id}
      as="p"
      data-component="Paragraph"
      styles={{ ...styles, customCSSProperties: { "icon-margin": "0.3rem" } }}
    >
      {children}
    </Container>
  );
}
