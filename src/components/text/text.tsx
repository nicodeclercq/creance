import React from "react";
import { css } from "@emotion/css";

import { font } from "../../infrastructure/style";
import { TextTag } from "../../styles/tag";
import { TOKEN } from "../../theme/tokens/tokens";

const styles = {
  L: css({
    ...TOKEN.FONT.TEXT.L,
    margin: 0,
  }),
  M: css({
    ...TOKEN.FONT.TEXT.M,
    margin: 0,
  }),
  S: css({
    ...TOKEN.FONT.TEXT.S,
    margin: 0,
  }),
} as const;

type Props = {
  as?: TextTag;
  children: React.ReactNode;
  size?: "L" | "M" | "S";
  color?: string;
};

export function Text({ as = "p", children, size = "M", color }: Props) {
  const Component = as;
  return (
    <Component className={styles[size]} style={{ color }}>
      {children}
    </Component>
  );
}
