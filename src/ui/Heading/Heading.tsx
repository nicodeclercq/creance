import {
  Container,
  ContainerStyles,
  TypographyStyles,
} from "../Container/Container";

import type { ReactNode } from "react";

type ParagraphProps = {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  styles?: ContainerStyles<TypographyStyles | "flexGrow">;
};

export function Heading({ styles = {}, level = 1, children }: ParagraphProps) {
  const { color = "primary-default", ...rest } = styles;
  return (
    <Container
      as={`h${level}`}
      styles={{ color, background: "transparent", ...rest }}
    >
      {children}
    </Container>
  );
}
