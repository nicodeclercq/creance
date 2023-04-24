import React, { useMemo } from "react";
import { css } from "@emotion/css";
import { BASE_DIRECTION, BaseDirection } from "../../styles/direction";
import { ContainerTag, CONTAINER_TAG } from "../../styles/tag";
import { Align, Justify } from "../../styles/flex";
import {
  Padding,
  formatResponsiveSize,
  getPaddingStyle,
  ResponsiveSize,
} from "../../styles/size";
import { VAR } from "../../theme/style";

type Props = {
  children: React.ReactNode;
  align?: Align;
  as?: ContainerTag;
  background?: string;
  color?: string;
  direction?: BaseDirection;
  gap?: keyof typeof VAR.SIZE.GAP;
  height?: ResponsiveSize;
  isInline?: boolean;
  justify?: Justify;
  maxHeight?: ResponsiveSize;
  maxWidth?: ResponsiveSize;
  minHeight?: ResponsiveSize;
  minWidth?: ResponsiveSize;
  padding?: Padding;
  shadow?: string;
  width?: ResponsiveSize;
  wraps?: boolean;
};

export function Flex({
  as = CONTAINER_TAG.DIV,
  isInline,
  justify,
  align,
  background,
  color,
  wraps,
  direction = BASE_DIRECTION.VERTICAL,
  width = "100%",
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  padding,
  shadow,
  gap = "M",
  children,
}: Props) {
  const Component = as;

  const style = useMemo(
    () =>
      css(`
        display: ${isInline ? "flex" : "inline-flex"};
        flex-wrap: ${wraps ? "wrap" : "nowrap"};
        flex-direction: ${
          direction === BASE_DIRECTION.VERTICAL ? "column" : "row"
        };
        justify-content: ${justify};
        align-items: ${align};
        background: ${background};
        color: ${color};
        box-shadow: ${shadow};
        gap: ${VAR.SIZE.GAP[gap]};
        ${formatResponsiveSize("width", width)}
        ${formatResponsiveSize("min-width", minWidth)}
        ${formatResponsiveSize("max-width", maxWidth)}
        ${formatResponsiveSize("height", height)}
        ${formatResponsiveSize("min-height", minHeight)}
        ${formatResponsiveSize("max-height", maxHeight)}
        ${getPaddingStyle(padding)}
      `),
    [
      isInline,
      wraps,
      direction,
      justify,
      align,
      background,
      color,
      gap,
      width,
      minWidth,
      height,
      minHeight,
      padding,
    ]
  );

  return <Component className={style}>{children}</Component>;
}
