import { ReactNode } from "react";

import * as Color from "../../../../entities/color";
import * as Font from "../../../../entities/font";

type Props = {
  children: ReactNode;
  htmlFor?: string;
  color?: Color.Color;
};

export function LabelSmall({ children, color, htmlFor }: Props) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        ...(color ? { color: Color.toCssValue(color) } : {}),
        font: Font.toCssValue("LABEL_SMALL"),
        display: "block",
      }}
    >
      {children}
    </label>
  );
}
