import { type ReactNode } from "react";
import {
  Container,
  ContainerStyles,
  WithMediaQuery,
} from "../Container/Container";

type GridProps = {
  columns: WithMediaQuery<number | string[]>;
  children: ReactNode;
  gap?: ContainerStyles["gap"];
  align?: ContainerStyles["alignItems"];
  justify?: ContainerStyles["justifyContent"];
};

export function Grid({ children, columns, gap, align, justify }: GridProps) {
  return (
    <Container
      data-component="Grid"
      styles={{
        display: "grid",
        gap,
        alignItems: align,
        justifyContent: justify,
        width: "100%",
        gridTemplateColumns: columns,
      }}
    >
      {children}
    </Container>
  );
}
