import React, { useMemo } from "react";
import { CSSObject, css } from "@emotion/css";
import { DIRECTION, Direction } from "../../styles/direction";
import { ContainerTag, CONTAINER_TAG } from "../../styles/tag";
type Scroll = "none" | "horizontal" | "vertical" | true;

type Props = {
  children: React.ReactNode;
  as?: ContainerTag;
  background?: string;
  color?: string;
  direction?: Direction;
  shadow?: string;
  scroll?: Scroll;
};

const cssFromScroll = (scroll?: Scroll): CSSObject => {
  if (scroll) {
    if (scroll === true) {
      return { overflow: "auto" };
    }
    if (scroll === "horizontal") {
      return { overflowX: "auto" };
    }
    if (scroll === "vertical") {
      return { overflowY: "auto" };
    }
    if (scroll === "none") {
      return { overflow: "node" };
    }
  }
  return {};
};

export function Fill({
  as = CONTAINER_TAG.DIV,
  direction = DIRECTION.BOTH,
  background,
  color,
  shadow,
  children,
  scroll,
}: Props) {
  const Component = as;

  const style = useMemo(
    () =>
      css({
        background,
        color,
        boxShadow: shadow,
        width: direction !== DIRECTION.VERTICAL ? "100%" : undefined,
        height: direction !== DIRECTION.HORIZONTAL ? "100%" : undefined,
        ...cssFromScroll(scroll),
      }),
    [direction]
  );

  return <Component className={style}>{children}</Component>;
}
