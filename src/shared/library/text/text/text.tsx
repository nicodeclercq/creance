import { ReactNode } from "react";

import * as Color from "../../../../entities/color";
import * as Font from "../../../../entities/font";

type Props = {
  children: ReactNode;
  color?: Color.Color;
  decoration?: "overline" | "line-through" | "underline";
};

export function Text({ children, color, decoration }: Props) {
  return (
    <span
      style={{
        ...(color ? { color: Color.toCssValue(color) } : {}),
        font: Font.toCssValue("DEFAULT"),
        textDecoration: decoration,
      }}
    >
      {children}
    </span>
  );
}
