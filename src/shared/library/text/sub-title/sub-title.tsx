import { ReactNode } from "react";

import * as Color from "../../../../entities/color";
import * as Font from "../../../../entities/font";
import "./sub-title.css";

type Props = {
  children: ReactNode;
  color?: Color.Color;
};

export function SubTitle({ children, color }: Props) {
  return (
    <h2
      className="s-sub-title"
      style={{
        ...(color ? { color: Color.toCssValue(color) } : {}),
        font: Font.toCssValue("SUBTITLE"),
      }}
    >
      {children}
    </h2>
  );
}
