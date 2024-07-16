import { ReactNode } from "react";

import { Container } from "../../layout/container/container";

export const CARD_PADDING = "M" as const;

type Props = {
  header?: ReactNode;
  children: ReactNode;
  type?: "default" | "light";
  isFlat?: boolean;
  noPaddings?: boolean;
};
export function Card({
  header,
  noPaddings,
  children,
  type = "default",
  isFlat = false,
}: Props) {
  return (
    <Container
      background="WHITE"
      border={isFlat ? "LIGHT" : "NONE"}
      shadow={isFlat ? null : "M"}
      radius={type}
      scroll={false}
    >
      {header && <Container borderBottom="LIGHT">{header}</Container>}
      <Container padding={noPaddings ? undefined : CARD_PADDING}>
        {children}
      </Container>
    </Container>
  );
}
