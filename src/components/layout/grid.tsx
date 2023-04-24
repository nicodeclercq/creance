import React, { useMemo } from "react";
import { css } from "@emotion/css";
import * as IO from "io-ts";
import { BASE_DIRECTION, BaseDirection } from "../../styles/direction";
import { ContainerTag, CONTAINER_TAG } from "../../styles/tag";
import { Align, Justify } from "../../styles/flex";
import { formatResponsiveSize, ResponsiveSize } from "../../styles/size";
import { VAR } from "../../theme/style";
import { getStyle, Responsive } from "../../styles/responsive";

type Columns = number | string | string[];

type Props = {
  children: React.ReactNode;
  align?: Align;
  as?: ContainerTag;
  background?: string;
  color?: string;
  columns: Responsive<Columns>;
  direction?: BaseDirection;
  gap?: string;
  height?: ResponsiveSize;
  isInline?: boolean;
  justify?: Justify;
  maxHeight?: ResponsiveSize;
  maxWidth?: ResponsiveSize;
  minHeight?: ResponsiveSize;
  minWidth?: ResponsiveSize;
  shadow?: string;
  width?: ResponsiveSize;
  wraps?: boolean;
};

const createColumnsStyle = (columns: Columns): string => {
  if (IO.number.is(columns)) {
    return `repeat(${columns}, 1fr)`;
  }
  if (IO.string.is(columns)) {
    return columns;
  }
  if (columns instanceof Array && columns.every(IO.string.is)) {
    return columns.join(" ");
  }
  return "";
};

export function Grid({
  as = CONTAINER_TAG.DIV,
  isInline,
  justify,
  align,
  background,
  color,
  columns,
  wraps,
  direction = BASE_DIRECTION.VERTICAL,
  width = "100%",
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  shadow,
  gap = VAR.SIZE.GAP.M,
  children,
}: Props) {
  const Component = as;

  const style = useMemo(
    () =>
      css(`
    display: ${isInline ? "grid" : "inline-grid"};
    flex-wrap: ${wraps ? "wrap" : "nowrap"};
    flex-direction: ${direction === BASE_DIRECTION.VERTICAL ? "column" : "row"};
    justify-content: ${justify};
    align-items: ${align};
    background: ${background};
    color: ${color};
    box-shadow: ${shadow};
    gap: ${gap};
    grid-template-columns: ${getStyle(columns, createColumnsStyle)};
    ${formatResponsiveSize("width", width)}
    ${formatResponsiveSize("min-width", minWidth)}
    ${formatResponsiveSize("max-width", maxWidth)}
    ${formatResponsiveSize("height", height)}
    ${formatResponsiveSize("min-height", minHeight)}
    ${formatResponsiveSize("max-height", maxHeight)}
  `),
    []
  );

  return <Component className={style}>{children}</Component>;
}
