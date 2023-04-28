import React, { useMemo } from "react";
import { css } from "@emotion/css";
import { shadow, Var, VAR } from "../theme/style";
import {
  formatResponsiveSize,
  getPaddingStyle,
  Padding,
  ResponsiveSize,
} from "../styles/size";
import { ContainerTag } from "../styles/tag";

export type Props = {
  as?: ContainerTag;
  children: React.ReactNode;
  width?: ResponsiveSize;
  padding?: Padding;
  elevation?: keyof Var["SHADOW"]["OUTSET"];
};

export function Card({
  as = "section",
  width = "100%",
  padding = "M",
  elevation = 1,
  children,
}: Props) {
  const Component = as;

  const style = useMemo(
    () =>
      css(`
      background: ${VAR.COLOR.COMMON.SURFACE.BASE};
      border-radius: ${VAR.RADIUS.BASE};
      color: ${VAR.COLOR.COMMON.MAIN.BASE};
      ${shadow(elevation)}
      ${getPaddingStyle(padding)}
      ${formatResponsiveSize("width", width)}
    `),
    [width]
  );

  return <Component className={style}>{children}</Component>;
}
