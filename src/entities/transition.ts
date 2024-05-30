export const TRANSITION = {
  DEFAULT: "all 0.2s ease-in-out",
} as const;

export type Transition = keyof typeof TRANSITION;

export const toCssName = (transition: Transition) =>
  `--transition-${transition}`;

export const toCssValue = (transition: Transition) =>
  `var(${toCssName(transition)})`;
