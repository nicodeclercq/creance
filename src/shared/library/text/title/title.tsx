import { ReactNode } from "react";

import * as Color from "../../../../entities/color";
import * as Font from "../../../../entities/font";
import "./title.css";

type Props = {
  children: ReactNode;
  color?: Color.Color;
};

export function Title({ children, color }: Props) {
  return (
    <h1
      className="s-title"
      style={{
        ...(color ? { color: Color.toCssValue(color) } : {}),
        font: Font.toCssValue("TITLE"),
      }}
    >
      {children}
    </h1>
  );
}
