import React from "react";
import { css } from "@emotion/css";
import { font } from "../../infrastructure/style";
import { VAR } from "../../theme/style";
import { TOKEN } from "../../theme/tokens/tokens";

const styles = css({
  ...TOKEN.FONT.HEADING,
  color: VAR.COLOR.BRAND.MAIN.STRONGER,
  margin: 0,
});

type Props = {
  children: string;
};

export function Title({ children }: Props) {
  return <h1 className={styles}>{children}</h1>;
}
