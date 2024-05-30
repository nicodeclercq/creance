export const SPACING = {
  XXL:'3rem',
  XL: '2rem',
  L: '1.5rem',
  M: '1rem',
  S: '0.5rem',
  XS: '0.25rem',
  XXS: '0.125rem',
} as const;

export type Spacing = keyof typeof SPACING;

export const toCssName = (spacing: Spacing) => `--spacing-${spacing}`;

export const toCssValue = (spacing: Spacing) => `var(${toCssName(spacing)})`;