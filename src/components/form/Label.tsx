import React from "react";
import { css } from "@emotion/css";
import { VAR } from "../../theme/style";

export const styles = css({
  ...VAR.FONT.TEXT.S,
  flexGrow: "1",
});

type Props = {
  htmlFor: string;
  children: React.ReactNode;
  gridArea?: string;
  asErrors: boolean;
};

export function Label({ htmlFor, children, asErrors, gridArea }: Props) {
  return (
    <label
      htmlFor={htmlFor}
      className={styles}
      style={{
        gridArea,
        color: asErrors ? VAR.COLOR.NEGATIVE.MAIN.BASE : "inherit",
      }}
    >
      {children}
    </label>
  );
}
