import React from "react";
import { css } from "@emotion/css";

import { FONTS } from "../../theme/theme";
import { font } from "../../infrastructure/style";
import { VAR } from "../../theme/style";

const styles = css({
  ...font(FONTS.HEADING),
  color: VAR.COLOR.BRAND.BACKGROUND,
  margin: 0,
});

type Props = {
  children: string;
};

export function Title({ children }: Props) {
  return <h1 className={styles}>{children}</h1>;
}
