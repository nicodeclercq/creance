import { camelCaseToKebab } from "../../helpers/string";
import { css } from "@emotion/css";
import { identity } from "fp-ts/function";
import { entries } from "../../utils/object";

export const MEDIA_QUERY_BREAKPOINTS = {
  default: 0,
  sm: 580,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const MEDIAS = Object.keys(MEDIA_QUERY_BREAKPOINTS) as Array<
  keyof typeof MEDIA_QUERY_BREAKPOINTS
>;

type MediaSize = keyof typeof MEDIA_QUERY_BREAKPOINTS;

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
export type Display =
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
  | "dashed"
  | "inverted"
  | Partial<
      Record<
        "top" | "bottom" | "left" | "right",
        "none" | "default" | "inverted"
      >
    >;
type CustomCSSProperties = Record<
  `--${string}`,
  WithMediaQuery<string | number>
>;

export type Styles = {
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
  breakInside?: WithMediaQuery<"page" | "column" | "avoid">;
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

export type Media = keyof typeof MEDIA_QUERY_BREAKPOINTS;

export type WithMediaQuery<S> = S | MediaQuery<S>;
type WithoutMediaQuery<S> = S extends MediaQuery<infer T> ? T : S;
type Defined<T> = T extends undefined ? never : T;

function isMediaQuery<S>(value: WithMediaQuery<S>): value is MediaQuery<S> {
  return typeof value === "object" && value !== null && "default" in value;
}

function getMediaValue<S>(
  media: keyof MediaQuery<S>,
  value: WithMediaQuery<S>
): S | undefined {
  if (!isMediaQuery(value)) {
    return media === "default" ? value : undefined;
  }

  return media in value ? (value[media] as S) : undefined;
}

function getPropertiesValueByMedia<
  S extends Record<string, WithMediaQuery<unknown>>
>(values: S) {
  type Values = {
    [key in keyof S]: S[key] extends WithMediaQuery<infer T> ? T : undefined;
  };

  return entries(MEDIA_QUERY_BREAKPOINTS).reduce((acc, [breakpoint]) => {
    const valuesAtBreakpoint = entries(values)
      .map(([key, value]) => [key, getMediaValue(breakpoint, value)])
      .filter(([_, value]) => value != null)
      .reduce((acc, [key, value]) => {
        const newAcc = (acc ?? {}) as Record<keyof S, S[keyof S]>;
        newAcc[key as keyof S] = value as S[keyof S];

        return newAcc;
      }, undefined as Record<keyof S, S[keyof S]> | undefined);

    if (valuesAtBreakpoint != null) {
      acc[breakpoint] = valuesAtBreakpoint as Values;
    }

    return acc;
  }, {} as Record<Partial<MediaSize>, Values>);
}

function buildMediaQueryStyles(
  media: MediaSize,
  styles: string | number | undefined
) {
  if (styles == null) {
    return "";
  }
  if (media === "default") {
    return styles;
  }
  return `@media (min-width: ${MEDIA_QUERY_BREAKPOINTS[media]}px) { ${styles} }`;
}

function buildStylesForAllMedia<S extends Record<string, unknown>>(
  values: Record<MediaSize, S>,
  transform: (value: S, currentMedia: MediaSize) => string | number | undefined
): string {
  return entries(MEDIA_QUERY_BREAKPOINTS).reduce((acc, [breakpoint]) => {
    const value = values[breakpoint];

    if (value == null) {
      return acc;
    }

    return `${acc ? `${acc} ` : ""}${buildMediaQueryStyles(
      breakpoint,
      transform(value, breakpoint)
    )}`;
  }, "");
}

type FromPropertiesRecord<
  S extends Record<string, WithMediaQuery<unknown> | undefined>
> = {
  [key in keyof S]: S[key] extends WithMediaQuery<infer T>
    ? T | undefined
    : undefined;
};

export function buildStylesForMedia<
  S extends Record<string, WithMediaQuery<unknown> | undefined>
>(
  values: S,
  transform: (value: FromPropertiesRecord<S>) => string | number | undefined
): string {
  const propertiesByMedia = getPropertiesValueByMedia(values);
  const stylesByMedia = buildStylesForAllMedia(propertiesByMedia, (value) =>
    transform(value as FromPropertiesRecord<S>)
  );

  return css(stylesByMedia);
}

function buildCustomPropertiesStyles(
  customCSSProperties: CustomCSSProperties | undefined
) {
  return Object.keys(MEDIA_QUERY_BREAKPOINTS)
    .map((breakpoint) => {
      const currentBreakpointStyles = entries(customCSSProperties ?? {})
        .map(([key, value]) => [
          key,
          getMediaValue(breakpoint as MediaSize, value),
        ])
        .filter(([_, value]) => value != null);

      if (currentBreakpointStyles.length === 0) {
        return undefined;
      }

      const styles = currentBreakpointStyles
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ");

      return buildMediaQueryStyles(breakpoint as MediaSize, styles);
    })
    .filter(Boolean)
    .join(" ");
}

function computeGridTemplate(value: GridTemplate) {
  if (typeof value === "number") {
    return value === 1 ? "1fr" : `repeat(${value}, '1fr')`;
  }
  if (value instanceof Array) {
    return value.join(" ");
  }
  return undefined;
}
function computeDisplay(value: Display = "default") {
  return value === "default" ? "block" : value;
}
function computePadding(
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
function computeGap(value: Spacing = "none") {
  return value === "none" ? "0" : `var(--ui-semantic-gap-${value})`;
}
function computeAlignItems(value: AlignItems = "default") {
  return value === "default" ? undefined : value;
}
function computeJustifyContent(value: JustifyContent = "default") {
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
  return value === "none"
    ? undefined
    : {
        "--layout-container-radius": `var(--ui-semantic-radius-${value})`,
        borderRadius: `var(--ui-semantic-radius-${value})`,
      };
}
function computeShadow(value: ShadowStyles = "none") {
  return value === "none"
    ? undefined
    : { boxShadow: `var(--ui-shadow-${value})` };
}
function computeBorder(value: Border = "none") {
  const properties = {
    top: "border-block-start",
    bottom: "border-block-end",
    left: "border-inline-start",
    right: "border-inline-end",
  };

  return typeof value === "object"
    ? entries(value).reduce((acc, [key, value]) => {
        acc[key] = `var(--ui-border-${value})`;
        return acc;
      }, {} as Record<keyof typeof properties, string>)
    : { border: `var(--ui-border-${value})` };
}
function computeFlexGrow(value: boolean) {
  return value ? "1" : undefined;
}
function computeFlexWrap(value: boolean) {
  return value ? "wrap" : "nowrap";
}

const transformers = {
  alignItems: { computeIfUndefined: false, transformer: computeAlignItems },
  alignSelf: { computeIfUndefined: false, transformer: computeAlignItems },
  background: { computeIfUndefined: false, transformer: computeBackground },
  border: { computeIfUndefined: false, transformer: computeBorder },
  radius: { computeIfUndefined: false, transformer: computeRadius },
  bottom: { computeIfUndefined: false, transformer: computeDistance },
  shadow: { computeIfUndefined: false, transformer: computeShadow },
  display: { computeIfUndefined: false, transformer: computeDisplay },
  cursor: { computeIfUndefined: false, transformer: identity },
  color: { computeIfUndefined: false, transformer: computeColor },
  flexDirection: { computeIfUndefined: false, transformer: identity },
  flexGrow: { computeIfUndefined: false, transformer: computeFlexGrow },
  flexWrap: { computeIfUndefined: false, transformer: computeFlexWrap },
  font: { computeIfUndefined: false, transformer: computeFont },
  gap: { computeIfUndefined: false, transformer: computeGap },
  gridArea: { computeIfUndefined: false, transformer: identity },
  gridTemplateColumns: {
    computeIfUndefined: false,
    transformer: computeGridTemplate,
  },
  gridTemplateRows: {
    computeIfUndefined: false,
    transformer: computeGridTemplate,
  },
  gridTemplateAreas: { computeIfUndefined: false, transformer: identity },
  height: { computeIfUndefined: false, transformer: computeDistance },
  justifyContent: {
    computeIfUndefined: false,
    transformer: computeJustifyContent,
  },
  left: { computeIfUndefined: false, transformer: computeDistance },
  maxHeight: { computeIfUndefined: false, transformer: computeDistance },
  minHeight: { computeIfUndefined: false, transformer: computeDistance },
  maxWidth: { computeIfUndefined: false, transformer: computeDistance },
  width: { computeIfUndefined: true, transformer: computeDistance },
  minWidth: { computeIfUndefined: false, transformer: computeDistance },
  overflow: { computeIfUndefined: false, transformer: identity },
  padding: { computeIfUndefined: false, transformer: computePadding },
  position: { computeIfUndefined: false, transformer: computePosition },
  right: { computeIfUndefined: false, transformer: computeDistance },
  textAlign: { computeIfUndefined: false, transformer: computeTextAlign },
  top: { computeIfUndefined: false, transformer: computeDistance },
  zIndex: {
    computeIfUndefined: false,
    transformer: (value) => `${value}`,
  },
  breakInside: { computeIfUndefined: false, transformer: identity },
} as const satisfies {
  [K in keyof Omit<Styles, "customCSSProperties">]: {
    computeIfUndefined: boolean;
    transformer: (
      value: Defined<WithoutMediaQuery<Styles[K]>>,
      styles: Styles,
      currentMedia: MediaSize
    ) =>
      | string
      | number
      | undefined
      | Record<string, string | number | undefined>;
  };
};

export function computeStyles(styles: Styles) {
  const { customCSSProperties, ...otherStyles } = styles;
  const customCSSPropertiesStyles =
    buildCustomPropertiesStyles(customCSSProperties);

  const propertiesByMedia = getPropertiesValueByMedia(otherStyles);
  const propertiesStyles = buildStylesForAllMedia(propertiesByMedia, (values) =>
    entries(values)
      .map(([key, value]) => {
        const { transformer, computeIfUndefined } =
          transformers[key as keyof typeof transformers];

        if (value == null && !computeIfUndefined) {
          return "";
        }

        if (!transformer) {
          console.warn(`No transformer found for property ${key}`);
          return "";
        }

        // simplifying types here to avoid complex type inference
        const result = transformer(value as never) as
          | string
          | number
          | undefined
          | Record<string, string | number | undefined>;

        if (result == null) {
          return "";
        }
        if (typeof result === "object") {
          return Object.entries(
            result as Record<string, string | number | undefined>
          )
            .map(([key, value]) => {
              return `${camelCaseToKebab(key)}: ${value};`;
            })
            .join(" ");
        } else if (typeof result === "string") {
          return `${camelCaseToKebab(key)}: ${result};`;
        } else {
          return "";
        }
      })
      .join(" ")
  );

  return [customCSSPropertiesStyles, propertiesStyles]
    .filter(Boolean)
    .join(" ");
}
