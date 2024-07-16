import { ReactNode } from "react";

import { Spacing, SPACING } from "../../../entities/spacing";
import { useCss } from "react-use";

type Props = {
  children: ReactNode;
  spacing?: Spacing;
  justify?:
    | "CENTER"
    | "START"
    | "END"
    | "SPACE_BETWEEN"
    | "SPACE_AROUND"
    | "SPACE_EVENLY";
  align?: "CENTER" | "START" | "END" | "BASELINE" | "STRETCH";
  isFull?: boolean;
};
export function Stack({ children, spacing, justify, align, isFull }: Props) {
  const style = useCss({
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    alignItems: align,
    justifyContent: justify,
    gap: SPACING[spacing ?? "M"],
    width: isFull ? "100%" : undefined,
    height: isFull ? "100%" : undefined,
  });

  return <div className={style}>{children}</div>;
}
