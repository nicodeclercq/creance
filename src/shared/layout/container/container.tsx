import { ReactNode } from "react";

import * as Spacing from "../../../entities/spacing";
import * as Shadow from "../../../entities/shadow";
import * as Color from "../../../entities/color";
import * as Border from "../../../entities/border";
import * as Radius from "../../../entities/radius";
import * as ZIndex from "../../../entities/z-index";

const dimensionToCssValue = (dimension: string | number) =>
  typeof dimension === "number" ? `${dimension}rem` : dimension;

type Props = {
  children: ReactNode;
  isInline?: boolean;
  isFlex?: boolean;
  margin?: Spacing.Spacing;
  marginX?: Spacing.Spacing;
  padding?: Spacing.Spacing;
  paddingX?: Spacing.Spacing;
  paddingY?: Spacing.Spacing;
  foreground?: Color.Color;
  background?: Color.Color;
  border?: Border.Border;
  borderTop?: Border.Border;
  borderLeft?: Border.Border;
  borderBottom?: Border.Border;
  borderRight?: Border.Border;
  radius?: Radius.Radius;
  radiusTopLeft?: Radius.Radius;
  radiusTopRight?: Radius.Radius;
  radiusBottomLeft?: Radius.Radius;
  radiusBottomRight?: Radius.Radius;
  grow?: boolean;
  shrink?: boolean;
  shadow?: Shadow.Shadow;
  zIndex?: ZIndex.ZIndex;
  scroll?: boolean;
  height?: string | number;
  width?: string | number;
  position?: "fixed" | "absolute";
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
};
export function Container({
  position,
  top,
  left,
  bottom,
  right,
  isFlex,
  isInline,
  children,
  shadow,
  grow,
  shrink,
  margin,
  marginX,
  padding,
  paddingX,
  paddingY,
  foreground,
  background,
  border,
  borderTop,
  borderLeft,
  borderBottom,
  borderRight,
  radius,
  radiusTopLeft,
  radiusTopRight,
  radiusBottomLeft,
  radiusBottomRight,
  zIndex,
  scroll,
  height,
  width,
}: Props) {
  return (
    <div
      style={{
        display: isInline
          ? `inline-${isFlex ? "flex" : "block"}`
          : isFlex
          ? "flex"
          : "block",
        overflowX: "hidden",
        overflowY: scroll ? "auto" : "hidden",
        flexGrow: grow ? 1 : 0,
        flexShrink: shrink ? 1 : 0,
        position,
        top: top ? dimensionToCssValue(top) : undefined,
        bottom: bottom ? dimensionToCssValue(bottom) : undefined,
        left: left ? dimensionToCssValue(left) : undefined,
        right: right ? dimensionToCssValue(right) : undefined,
        height: height ? dimensionToCssValue(height) : undefined,
        width: width ? dimensionToCssValue(width) : undefined,
        marginBlockStart: margin ? Spacing.toCssValue(margin) : undefined,
        marginInline: marginX ? Spacing.toCssValue(marginX) : undefined,
        padding: padding ? Spacing.toCssValue(padding) : undefined,
        paddingInline: paddingX ? Spacing.toCssValue(paddingX) : undefined,
        paddingBlock: paddingY ? Spacing.toCssValue(paddingY) : undefined,
        color: foreground ? Color.toCssValue(foreground) : undefined,
        background: background ? Color.toCssValue(background) : undefined,
        boxShadow: shadow ? Shadow.toCssValue(shadow) : undefined,
        border: border ? Border.toCssValue(border) : undefined,
        borderTop: borderTop ? Border.toCssValue(borderTop) : undefined,
        borderLeft: borderLeft ? Border.toCssValue(borderLeft) : undefined,
        borderBottom: borderBottom
          ? Border.toCssValue(borderBottom)
          : undefined,
        borderRight: borderRight ? Border.toCssValue(borderRight) : undefined,
        borderRadius: radius ? Radius.toCssValue(radius) : undefined,
        borderTopLeftRadius: radiusTopLeft
          ? Radius.toCssValue(radiusTopLeft)
          : undefined,
        borderTopRightRadius: radiusTopRight
          ? Radius.toCssValue(radiusTopRight)
          : undefined,
        borderBottomLeftRadius: radiusBottomLeft
          ? Radius.toCssValue(radiusBottomLeft)
          : undefined,
        borderBottomRightRadius: radiusBottomRight
          ? Radius.toCssValue(radiusBottomRight)
          : undefined,
        zIndex: zIndex ? ZIndex.toCssValue(zIndex) : undefined,
      }}
    >
      {children}
    </div>
  );
}
