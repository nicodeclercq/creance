import { entries } from "../../utils/object";

type Direction =
  | "horizontal"
  | "vertical"
  | "both"
  | Array<"top" | "bottom" | "left" | "right">;

type BleedProps<D extends Direction> = {
  children: React.ReactNode;
  direction?: D;
  spacing?: D extends Array<infer T>
    ? Record<T extends string ? T : never, string>
    : Record<D extends string ? D : never, string>;
  width?: string;
  height?: string;
};

const directionToMargin = {
  top: {
    property: "marginBlockStart",
    variable: "--component-layout-padding-y",
  },
  bottom: {
    property: "marginBlockEnd",
    variable: "--component-layout-padding-y",
  },
  left: {
    property: "marginInlineStart",
    variable: "--component-layout-padding-x",
  },
  right: {
    property: "marginInlineEnd",
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
  return (["top", "bottom", "left", "right"] as const).reduce((acc, dir) => {
    if ("both" in spacing) {
      acc[dir] = spacing["both"];
    } else if ("horizontal" in spacing && (dir === "left" || dir === "right")) {
      acc[dir] = spacing["horizontal"];
    } else if ("vertical" in spacing) {
      acc[dir] = spacing["vertical"];
    } else if (dir in spacing) {
      acc[dir] = spacing[dir];
    } else {
      acc[dir] = `var(${
        directionToMargin[dir as keyof typeof directionToMargin].variable
      }, 0)`;
    }
    return acc;
  }, {} as Record<"top" | "bottom" | "left" | "right", string | undefined>);
};

const computeStyles = (
  direction: Direction,
  spacing: Record<string, string | undefined>,
  width: string | undefined,
  height: string | undefined
) => {
  const styles = {
    marginBlockStart: "0",
    marginBlockEnd: "0",
    marginInlineStart: "0",
    marginInlineEnd: "0",
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
    styles.width = `calc(${width} + ${directionsSpacing.left} + ${directionsSpacing.right})`;
  }
  if (height && height !== "inherit") {
    styles.height = `calc(${height} + ${directionsSpacing.top} + ${directionsSpacing.bottom})`;
  }

  return styles;
};

export function Bleed<D extends Direction>({
  children,
  direction = "both" as D,
  spacing = {} as never,
  width,
  height,
}: BleedProps<D>) {
  const styles = computeStyles(direction, spacing, width, height);

  return (
    <div data-component="Bleed" style={styles}>
      {children}
    </div>
  );
}
