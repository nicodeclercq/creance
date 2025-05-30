import {
  Container,
  ContainerStyles,
  LayoutStyles,
  TypographyStyles,
} from "../Container/Container";

import type { ReactNode } from "react";

export type ParagraphProps = {
  children: ReactNode;
  styles?: ContainerStyles<TypographyStyles | LayoutStyles>;
};

export function Paragraph({ styles, children }: ParagraphProps) {
  return (
    <Container as="p" styles={styles}>
      {children}
    </Container>
  );
}
