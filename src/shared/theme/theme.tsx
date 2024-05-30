import { ReactNode } from "react";

import * as Color from "../../entities/color";
import * as Shadow from "../../entities/shadow";
import * as Spacing from "../../entities/spacing";
import * as Border from "../../entities/border";
import * as Radius from "../../entities/radius";
import * as ZIndex from "../../entities/z-index";
import * as Font from "../../entities/font";
import { entries } from "../../utils/object";

export type Props = {
  children: ReactNode;
};

export function Theme({ children }: Props) {
  const styles = [
    ...entries(Color.THEME_COLOR).map(([key, value]) => ({
      [Color.toCssName(key)]: value,
    })),
    ...entries(Color.STATUS_COLOR).map(([key, value]) => ({
      [Color.toCssName(key)]: value,
    })),
    ...entries(Shadow.SHADOW).map(([key, value]) => ({
      [Shadow.toCssName(key)]: value,
    })),
    ...entries(Shadow.INNER_SHADOW).map(([key, value]) => ({
      [Shadow.toCssName(key)]: value,
    })),
    ...entries(Spacing.SPACING).map(([key, value]) => ({
      [Spacing.toCssName(key)]: value,
    })),
    ...entries(Border.BORDER_DEFINITION).map(([key, value]) => ({
      [Border.toCssName(key)]: value,
    })),
    ...entries(Radius.RADIUS).map(([key, value]) => ({
      [Radius.toCssName(key)]: value,
    })),
    ...entries(ZIndex.Z_INDEX).map(([key, value]) => ({
      [ZIndex.toCssName(key)]: value,
    })),
    ...entries(Font.FONT).map(([key, value]) => ({
      [Font.toCssName(key)]: value,
    })),
  ].reduce((acc, cur) => ({ ...acc, ...cur }), {} as { [key: string]: string });

  return (
    <div style={styles}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Old+Standard+TT&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
