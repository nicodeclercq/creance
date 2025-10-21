import type { WithMediaQuery } from "../Container/styles";
import { buildStylesForMedia } from "../Container/styles";
import { entries } from "../../utils/object";

type Direction =
  | "horizontal"
  | "vertical"
  | "both"
  | Array<"top" | "bottom" | "left" | "right">;

type BleedProps<D extends Direction> = {
  children: React.ReactNode;
  direction?: WithMediaQuery<D>;
  spacing?: D extends WithMediaQuery<Array<infer T>>
    ? WithMediaQuery<Record<T extends string ? T : never, string>>
    : WithMediaQuery<Record<D extends string ? D : never, string>>;
  width?: WithMediaQuery<string> | undefined;
  height?: WithMediaQuery<string> | undefined;
};

const directionToMargin = {
  top: {
    property: "margin-block-start",
    variable: "--component-layout-padding-y",
  },
  bottom: {
    property: "margin-block-end",
    variable: "--component-layout-padding-y",
  },
  left: {
    property: "margin-inline-start",
    variable: "--component-layout-padding-x",
  },
  right: {
    property: "margin-inline-end",
    variable: "--component-layout-padding-x",
  },
} as const;

const directionsToObject = (direction: Direction) => {
  return (["top", "bottom", "left", "right"] as const).reduce((acc, dir) => {
    acc[dir] =
      direction === "both" ||
      (direction === "horizontal" && (dir === "left" || dir === "right")) ||
      (direction === "vertical" && (dir === "top" || dir === "bottom")) ||
      (Array.isArray(direction) && direction.includes(dir));

    return acc;
  }, {} as Record<"top" | "bottom" | "left" | "right", boolean>);
};

const spacingToDirections = (
  spacing: Record<string, string | undefined> = {}
) => {
  return (["top", "bottom", "left", "right"] as const).reduce(
    (acc, dir) => {
      if ("both" in spacing) {
        acc[dir] = spacing["both"] ?? "0";
      } else if (
        "horizontal" in spacing &&
        (dir === "left" || dir === "right")
      ) {
        acc[dir] = spacing["horizontal"] ?? "0";
      } else if ("vertical" in spacing) {
        acc[dir] = spacing["vertical"] ?? "0";
      } else if (dir in spacing) {
        acc[dir] = spacing[dir] ?? "0";
      } else {
        acc[dir] = `var(${
          directionToMargin[dir as keyof typeof directionToMargin].variable
        }, 0)`;
      }
      return acc;
    },
    {
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
    } as Record<"top" | "bottom" | "left" | "right", string>
  );
};

type ComputeStylesProps = {
  direction: Direction;
  spacing: Record<string, string | undefined> | undefined;
  width: string | undefined;
  height: string | undefined;
};

const computeStyles = ({
  direction,
  spacing,
  width,
  height,
}: ComputeStylesProps): string => {
  const styles = {
    "margin-block-start": "0",
    "margin-block-end": "0",
    "margin-inline-start": "0",
    "margin-inline-end": "0",
    width,
    height,
  };

  const directions = directionsToObject(direction);
  const directionsSpacing = spacingToDirections(spacing);

  entries(directions).forEach(([dir, value]) => {
    if (value) {
      styles[
        directionToMargin[dir as keyof typeof directionToMargin].property
      ] = `calc(${directionsSpacing[dir]} * -1)`;
    }
  });

  if (width && width !== "inherit") {
    styles.width = `calc(${width} + ${
      directions.left ? directionsSpacing.left : "0px"
    } + ${directions.right ? directionsSpacing.right : "0px"})`;
  }
  if (height && height !== "inherit") {
    styles.height = `calc(${height} + ${
      directions.top ? directionsSpacing.top : "0px"
    } + ${directions.bottom ? directionsSpacing.bottom : "0px"})`;
  }

  return Object.entries(styles).reduce(
    (acc, [property, value]) => `${acc} ${property}: ${value};`,
    ""
  );
};

export function Bleed<D extends Direction>({
  children,
  direction = "both" as D,
  spacing = {} as never,
  width,
  height,
}: BleedProps<D>) {
  const styles = buildStylesForMedia(
    { direction, spacing, width, height },
    (value) => computeStyles(value as ComputeStylesProps)
  );

  return (
    <div data-component="Bleed" className={styles}>
      {children}
    </div>
  );
}
