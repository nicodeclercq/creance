import type { ContainerStyles } from "../Container/Container";
import { Container } from "../Container/Container";

import type { ReactNode } from "react";
import type { TypographyStyles } from "../Container/styles";

type ParagraphProps = {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  styles?: ContainerStyles<TypographyStyles | "flexGrow" | "gridArea">;
};

export function Heading({ styles = {}, level = 1, children }: ParagraphProps) {
  const { color = "primary-default", ...rest } = styles;
  return (
    <Container
      as={`h${level}`}
      data-component="Heading"
      styles={{ color, ...rest }}
    >
      {children}
    </Container>
  );
}
