import type { HTMLElementType, ReactNode } from "react";

import classNames from "classnames";
import styles from "./Container.module.css";

type Spacing = "none" | "s" | "m" | "l";
type Position = "default" | "absolute" | "relative" | "fixed" | "sticky";
type Background = "default" | "transparent" | "inverted";
type Color =
  | "default"
  | "inverted"
  | "failure-weaker"
  | "failure-weak"
  | "failure-default"
  | "failure-strong"
  | "failure-stronger"
  | "neutral-weaker"
  | "neutral-weak"
  | "neutral-default"
  | "neutral-strong"
  | "neutral-stronger"
  | "primary-weaker"
  | "primary-weak"
  | "primary-default"
  | "primary-strong"
  | "primary-stronger";
type Display =
  | "default"
  | "flex"
  | "grid"
  | "block"
  | "inline-block"
  | "inline-flex"
  | "inline-grid";

type Font =
  | "default"
  | "body-smaller"
  | "body-small"
  | "body-default"
  | "body-large"
  | "body-larger";

type GridTemplate = string[] | number;

type AlignItems =
  | "default"
  | "center"
  | "start"
  | "end"
  | "baseline"
  | "stretch";
type JustifyContent =
  | "default"
  | "center"
  | "start"
  | "end"
  | "stretch"
  | "space-between"
  | "space-around";
type TextAlign = "default" | "start" | "center" | "end";
type Radius = "none" | "s" | "m" | "l" | "round";
type Styles = {
  cursor?: "pointer" | "default";
  display?: Display;
  background?: Background;
  color?: Color;
  position?: Position;
  top?: number;
  padding?: Spacing;
  gridTemplateColumns?: GridTemplate;
  font?: Font;
  gap?: Spacing;
  alignItems?: AlignItems;
  justifyContent?: JustifyContent;
  textAlign?: TextAlign;
  flexDirection?: "row" | "column";
  flexGrow?: boolean;
  flexWrap?: boolean;
  radius?: Radius;
  shadow?: ShadowStyles;
  overflow?: "hidden" | "auto" | "scroll" | "visible";
  zIndex?: number;
  width?: `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`;
  maxWidth?: `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`;
  minWidth?: `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`;
  height?: `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`;
  minHeight?: `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`;
  maxHeight?: `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`;
};

export type LayoutStyles = "display" | "padding" | "flexGrow";
export type ColorStyles = "background" | "color";
export type TypographyStyles = "color" | "font" | "textAlign";
export type ShadowStyles = "default" | "none";

export type ContainerStyles<K extends keyof Styles = keyof Styles> = Pick<
  Styles,
  K
>;

type ContainerProps = {
  children: ReactNode;
  styles?: Styles;
  as?: HTMLElementType;
};

function computeStyles({ display = "default", padding = "m" }: Styles) {
  return classNames(styles.container, {
    [styles.display]: display !== "default",
    [styles.padding]: padding,
  });
}

function computeGridTemplate(value?: GridTemplate) {
  if (typeof value === "number") {
    return `repeat(${value}, '1fr')`;
  }
  if (value instanceof Array) {
    return value.join(" ");
  }
  return undefined;
}

export function computePadding(
  value: Spacing | { x?: Spacing; y?: Spacing } = "none"
) {
  if (typeof value === "object") {
    const { x, y } = value;
    return [
      x === "none" ? "0" : `var(--ui-semantic-padding-${x})`,
      y === "none" ? "0" : `var(--ui-semantic-padding-${y})`,
    ].join(" ");
  }
  return value === "none" ? "0" : `var(--ui-semantic-padding-${value})`;
}
function computeBackground(value: Background = "transparent") {
  return value === "transparent" ? value : `var(--ui-background-${value})`;
}

function computeColor(value: Color = "default") {
  return value === "default" ? "inherit" : `var(--ui-semantic-color-${value})`;
}

function computeFont(value: Font = "default") {
  return value === "default" ? "inherit" : `var(--ui-semantic-font-${value})`;
}

export function computeGap(value: Spacing = "none") {
  return value === "none" ? "0" : `var(--ui-semantic-gap-${value})`;
}

export function computeAlignItems(value: AlignItems = "default") {
  return value === "default" ? undefined : value;
}

export function computeJustifyContent(value: JustifyContent = "default") {
  return value === "default" ? undefined : value;
}

function computeTextAlign(value: TextAlign = "default") {
  return value === "default" ? undefined : value;
}

function computePosition(value: Position = "default") {
  return value === "default" ? undefined : value;
}
function computeRadius(value: Radius = "none") {
  return value === "none" ? undefined : `var(--ui-semantic-radius-${value})`;
}
function computeShadow(value: ShadowStyles = "none") {
  return value === "none" ? undefined : `var(--ui-shadow-${value})`;
}

export function Container({
  children,
  as: Component = "div",
  styles: providedStyles = {},
}: ContainerProps) {
  const {
    display,
    flexDirection,
    position,
    gridTemplateColumns,
    color,
    background = "default",
    padding,
    font,
    gap,
    alignItems,
    flexGrow,
    flexWrap,
    justifyContent,
    cursor,
    radius,
    shadow,
    overflow,
    top,
    zIndex,
    width,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    height,
    ...styles
  } = providedStyles;

  return (
    <Component
      className={computeStyles(styles)}
      style={{
        cursor,
        flexDirection,
        minWidth,
        maxWidth,
        width:
          width ??
          (display ?? Component === "div" ? "block" : "inline")?.startsWith(
            "inline"
          )
            ? undefined
            : "100%",
        height,
        minHeight,
        maxHeight,
        display,
        margin: 0,
        position: computePosition(position),
        padding: computePadding(padding),
        alignItems: computeAlignItems(alignItems),
        gap: computeGap(gap),
        font: computeFont(font),
        background: computeBackground(background),
        color: computeColor(color),
        gridTemplateColumns: computeGridTemplate(gridTemplateColumns),
        textAlign: computeTextAlign(styles.textAlign),
        flexGrow: flexGrow ? 1 : undefined,
        justifyContent: computeJustifyContent(justifyContent),
        borderRadius: computeRadius(radius),
        boxShadow: computeShadow(shadow),
        overflow,
        top,
        zIndex,
        flexWrap: flexWrap ? "wrap" : undefined,
      }}
    >
      {children}
    </Component>
  );
}
