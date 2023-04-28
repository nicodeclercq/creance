import React from "react";
import { css } from "@emotion/css";

import { font } from "../../infrastructure/style";
import { TextTag } from "../../styles/tag";
import { TOKEN } from "../../theme/tokens/tokens";

const styles = {
  L: css({
    ...TOKEN.FONT.NUMERIC.L,
    margin: 0,
    whiteSpace: "nowrap",
  }),
  M: css({
    ...TOKEN.FONT.NUMERIC.M,
    margin: 0,
    whiteSpace: "nowrap",
  }),
  S: css({
    ...TOKEN.FONT.NUMERIC.S,
    margin: 0,
    whiteSpace: "nowrap",
  }),
} as const;

export type Props = {
  as?: TextTag;
  children: number | string;
  size?: "L" | "M" | "S";
  color?: string;
};

export function Numeric({ as = "span", children, size = "M", color }: Props) {
  const Component = as;
  return (
    <Component className={styles[size]} style={{ color }}>
      {children}
    </Component>
  );
}
