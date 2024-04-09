import React, { useMemo } from "react";
import { css } from "@emotion/css";
import { DIRECTION, Direction } from "../../styles/direction";
import { ContainerTag, CONTAINER_TAG } from "../../styles/tag";
import { VAR, padding, radius } from "../../theme/style";

type Props = {
  as?: ContainerTag;
  isInline?: boolean;
  direction?: Direction;
  children: React.ReactNode;
  padding?: string;
};

export function Center({
  as = CONTAINER_TAG.DIV,
  isInline,
  direction = DIRECTION.BOTH,
  children,
  padding,
}: Props) {
  const Component = as;

  const style = useMemo(
    () =>
      css({
        display: isInline ? "inline-flex" : "flex",
        justifyContent:
          direction !== DIRECTION.VERTICAL ? "center" : "flex-start",
        alignItems:
          direction !== DIRECTION.HORIZONTAL ? "center" : "flex-start",
        width: direction !== DIRECTION.VERTICAL ? "100%" : undefined,
        height: direction !== DIRECTION.HORIZONTAL ? "100%" : undefined,
        padding,
      }),
    [direction, isInline]
  );

  return <Component className={style}>{children}</Component>;
}
