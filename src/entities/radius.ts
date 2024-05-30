export const RADIUS = {
  default: "2rem",
  light: "1rem",
  rounded: "999999rem",
  none: "0",
} as const;

export type Radius = keyof typeof RADIUS;

export const toCssName = (radius: Radius) => `--radius-${radius}`;

export const toCssValue = (radius: Radius) => `var(${toCssName(radius)})`;
