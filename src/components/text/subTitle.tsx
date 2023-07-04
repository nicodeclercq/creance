import React from "react";
import { css } from "@emotion/css";
import { font } from "../../theme/style";

const styles = css(`
  ${font("HEADING", "S")}
  margin: 0;
`);

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
