import React from "react";
import { css } from "@emotion/css";
import { VAR, font } from "../../theme/style";

type Props = {
  children: string;
  inheritColor?: boolean;
};

export function Title({ children, inheritColor = false }: Props) {
  const styles = css(`
    ${font("HEADING", "M")}
    color: ${inheritColor ? "inherit" : VAR.COLOR.BRAND.MAIN.STRONGER};
    margin: 0;
  `);

  return <h1 className={styles}>{children}</h1>;
}
