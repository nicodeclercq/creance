import React from "react";
import { css } from "@emotion/css";
import { TOKEN } from "../../theme/tokens/tokens";

const styles = css({
  ...TOKEN.FONT.SUB_HEADING,
  margin: 0,
});

type Props = {
  children: string;
  color?: string;
};

export function Subtitle({ children, color }: Props) {
  return (
    <h1 className={styles} style={{ color }}>
      {children}
    </h1>
  );
}
