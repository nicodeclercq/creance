import type { HTMLElementType, ReactNode } from "react";

import classNames from "classnames";
import { css } from "@emotion/css";
import { identity } from "fp-ts/function";

const MEDIA_QUERY_BREAKPOINTS = {
  default: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

type Spacing = "none" | "s" | "m" | "l";
type Position = "default" | "absolute" | "relative" | "fixed" | "sticky";
type Background =
  | "default"
  | "body"
  | "transparent"
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
  | "primary-stronger"
  | "warning-weaker"
  | "warning-weak"
  | "warning-default"
  | "warning-strong"
  | "warning-stronger"
  | "success-weaker"
  | "success-weak"
  | "success-default"
  | "success-strong"
  | "success-stronger";
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
  | "warning-weaker"
  | "warning-weak"
  | "warning-default"
  | "warning-strong"
  | "warning-stronger"
  | "primary-weaker"
  | "primary-weak"
  | "primary-default"
  | "primary-strong"
  | "primary-stronger"
  | "success-weaker"
  | "success-weak"
  | "success-default"
  | "success-strong"
  | "success-stronger";
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
  | "space-around"
  | "space-evenly";
type TextAlign = "default" | "start" | "center" | "end";
type Radius = "none" | "s" | "m" | "l" | "round";
type Border =
  | "none"
  | "default"
  | "inverted"
  | Partial<
      Record<
        "top" | "bottom" | "left" | "right",
        "none" | "default" | "inverted"
      >
    >;
type CustomCSSProperties = Record<string, WithMediaQuery<string | number>>;

type Styles = {
  cursor?: WithMediaQuery<"pointer" | "default">;
  display?: WithMediaQuery<Display>;
  background?: WithMediaQuery<Background>;
  border?: WithMediaQuery<Border>;
  color?: WithMediaQuery<Color>;
  position?: WithMediaQuery<Position>;
  top?: WithMediaQuery<number | string>;
  bottom?: WithMediaQuery<number | string>;
  left?: WithMediaQuery<number | string>;
  right?: WithMediaQuery<number | string>;
  padding?: Spacing;
  gridTemplateColumns?: WithMediaQuery<GridTemplate> | undefined;
  gridTemplateRows?: WithMediaQuery<GridTemplate> | undefined;
  gridTemplateAreas?: WithMediaQuery<string> | undefined;
  gridArea?: string;
  font?: WithMediaQuery<Font>;
  gap?: WithMediaQuery<Spacing>;
  alignItems?: WithMediaQuery<AlignItems>;
  alignSelf?: WithMediaQuery<AlignItems>;
  justifyContent?: WithMediaQuery<JustifyContent>;
  textAlign?: WithMediaQuery<TextAlign>;
  flexDirection?: WithMediaQuery<"row" | "column">;
  flexGrow?: WithMediaQuery<boolean>;
  flexWrap?: WithMediaQuery<boolean>;
  radius?: WithMediaQuery<Radius>;
  shadow?: WithMediaQuery<ShadowStyles>;
  overflow?: WithMediaQuery<"hidden" | "auto" | "scroll" | "visible">;
  zIndex?: WithMediaQuery<number>;
  width?: WithMediaQuery<
    | `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`
    | "auto"
    | "max-content"
    | "min-content"
    | "fit-content"
  >;
  maxWidth?: WithMediaQuery<`${number}${
    | "vw"
    | "%"
    | "vh"
    | "vmin"
    | "vmax"
    | "rem"}`>;
  minWidth?: WithMediaQuery<`${number}${
    | "vw"
    | "%"
    | "vh"
    | "vmin"
    | "vmax"
    | "rem"}`>;
  height?: WithMediaQuery<
    | `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`
    | "max-content"
    | "min-content"
    | "fit-content"
  >;
  minHeight?: WithMediaQuery<
    | `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`
    | "max-content"
    | "min-content"
    | "fit-content"
  >;
  maxHeight?: WithMediaQuery<
    | `${number}${"vw" | "%" | "vh" | "vmin" | "vmax" | "rem"}`
    | "max-content"
    | "min-content"
    | "fit-content"
  >;
  customCSSProperties?: CustomCSSProperties;
};

export type LayoutStyles = "display" | "padding" | "flexGrow";
export type ColorStyles = "background" | "color";
export type TypographyStyles = "color" | "font" | "textAlign";
export type ShadowStyles = "default" | "none";

type MediaQuery<S> = {
  default: S;
  sm?: S;
  md?: S;
  lg?: S;
  xl?: S;
};

export type WithMediaQuery<S> = S | MediaQuery<S>;

export function isMediaQuery<S>(
  value: WithMediaQuery<S>
): value is MediaQuery<S> {
  return typeof value === "object" && value !== null && "default" in value;
}

export function withMediaQuery<S>(
  property: string,
  value: WithMediaQuery<S> | undefined,
  toStyle: (value: S) => string | number | undefined
): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (isMediaQuery(value)) {
    const result = Object.entries(MEDIA_QUERY_BREAKPOINTS)
      .map(([breakpoint, size]) => {
        if (
          breakpoint in value &&
          value[breakpoint as keyof MediaQuery<S>] != null
        ) {
          const v = value[breakpoint as keyof MediaQuery<S>];
          return v != null
            ? `@media (min-width: ${size}px) { ${property}: ${toStyle(v)}; }`
            : undefined;
        }
        return undefined;
      })
      .filter(Boolean)
      .join(" ");

    return css(result);
  }

  return css`
    ${property}: ${toStyle(value)};
  `;
}

export type ContainerStyles<K extends keyof Styles = keyof Styles> = Pick<
  Styles,
  K
>;

type ContainerProps = {
  id?: string;
  children?: ReactNode;
  styles?: Styles;
  as?: HTMLElementType;
  "data-component"?: string;
};

function computeGridTemplate(value: GridTemplate) {
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
  const bg = ["default", "body", "transparent", "inverted"];

  if (bg.includes(value)) {
    return value === "transparent" ? value : `var(--ui-background-${value})`;
  }
  return `var(--ui-semantic-color-${value})`;
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
  return value === "default" ? "static" : value;
}
function computeDistance(value: number | string) {
  return typeof value === "string" ? value : `${value / 10}rem`;
}

function computeRadius(value: Radius = "none") {
  return value === "none" ? undefined : `var(--ui-semantic-radius-${value})`;
}
function computeShadow(value: ShadowStyles = "none") {
  return value === "none" ? undefined : `var(--ui-shadow-${value})`;
}
function computeBorderWithMediaQuery(value: WithMediaQuery<Border> = "none") {
  const properties = {
    top: "border-block-start",
    bottom: "border-block-end",
    left: "border-inline-start",
    right: "border-inline-end",
  };

  return typeof value === "object"
    ? Object.entries(value).map(([key, value]) =>
        withMediaQuery(
          properties[key as keyof typeof properties],
          value,
          (value: Border) => `var(--ui-border-${value})`
        )
      )
    : [
        withMediaQuery(
          "border",
          value,
          (value: Border) => `var(--ui-border-${value})`
        ),
      ];
}

function computeCustomProperties(
  customCSSProperties: CustomCSSProperties | undefined
) {
  return Object.entries(customCSSProperties ?? {}).map(([key, value]) =>
    withMediaQuery(key, value, identity)
  );
}

function computeWidth(
  display: WithMediaQuery<Display> | undefined,
  width: WithMediaQuery<string> | undefined
) {
  if (width) {
    return withMediaQuery("width", width, identity);
  }
  if (display) {
    return withMediaQuery("width", display, (display: Display) =>
      display.startsWith("inline") ? undefined : "100%"
    );
  }
  return undefined;
}

export function Container({
  id,
  children,
  as: Component = "div",
  styles: providedStyles = {},
  "data-component": dataComponent,
}: ContainerProps) {
  const {
    display,
    flexDirection,
    position,
    gridTemplateColumns,
    gridTemplateRows,
    color,
    background,
    border,
    padding,
    font,
    gap,
    alignItems,
    alignSelf,
    flexGrow,
    flexWrap,
    justifyContent,
    cursor,
    radius,
    shadow,
    overflow,
    top,
    bottom,
    left,
    right,
    zIndex,
    width,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    height,
    customCSSProperties,
    textAlign,
    gridArea,
    gridTemplateAreas,
  } = providedStyles;

  return (
    <Component
      id={id}
      data-component={dataComponent || "Container"}
      className={classNames(
        withMediaQuery("--layout-container-radius", radius, computeRadius),
        withMediaQuery("align-items", alignItems, computeAlignItems),
        withMediaQuery("align-self", alignSelf, computeAlignItems),
        withMediaQuery("background", background, computeBackground),
        computeBorderWithMediaQuery(border),
        withMediaQuery("border-radius", radius, computeRadius),
        withMediaQuery("bottom", bottom, computeDistance),
        withMediaQuery("box-shadow", shadow, computeShadow),
        withMediaQuery("display", display, identity),
        withMediaQuery("cursor", cursor, identity),
        computeCustomProperties(customCSSProperties),
        withMediaQuery("color", color, computeColor),
        withMediaQuery("flex-direction", flexDirection, identity),
        withMediaQuery("flex-grow", flexGrow, (value) =>
          value ? "1" : undefined
        ),
        withMediaQuery("flex-wrap", flexWrap, (value) =>
          value ? "wrap" : "nowrap"
        ),
        withMediaQuery("font", font, computeFont),
        withMediaQuery("gap", gap, computeGap),
        withMediaQuery("grid-area", gridArea, identity),
        withMediaQuery(
          "grid-template-columns",
          gridTemplateColumns,
          computeGridTemplate
        ),
        withMediaQuery(
          "grid-template-rows",
          gridTemplateRows,
          computeGridTemplate
        ),
        withMediaQuery("grid-template-areas", gridTemplateAreas, identity),
        withMediaQuery("height", height, computeDistance),
        withMediaQuery(
          "justify-content",
          justifyContent,
          computeJustifyContent
        ),
        withMediaQuery("left", left, computeDistance),
        withMediaQuery("max-height", maxHeight, computeDistance),
        withMediaQuery("min-height", minHeight, computeDistance),
        withMediaQuery("max-width", maxWidth, computeDistance),
        withMediaQuery("min-width", minWidth, computeDistance),
        withMediaQuery("overflow", overflow, identity),
        withMediaQuery("padding", padding, computePadding),
        withMediaQuery("position", position, computePosition),
        withMediaQuery("right", right, computeDistance),
        withMediaQuery("text-align", textAlign, computeTextAlign),
        withMediaQuery("top", top, computeDistance),
        computeWidth(display, width),
        withMediaQuery("z-index", zIndex, identity),
        css({
          margin: 0,
        })
      )}
    >
      {children}
    </Component>
  );
}
