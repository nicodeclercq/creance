import React from "react";
import { css } from "@emotion/css";
import { VAR, font } from "../../theme/style";

const styles = css(`
  ${font("HEADING", "M")}
  color: ${VAR.COLOR.BRAND.MAIN.STRONGER};
  margin: 0;
`);
console.log(
  "[YOUPI]",
  `
${font("HEADING", "M")}
color: ${VAR.COLOR.BRAND.MAIN.STRONGER};
margin: 0;
`
);
type Props = {
  children: string;
};

export function Title({ children }: Props) {
  return <h1 className={styles}>{children}</h1>;
}
