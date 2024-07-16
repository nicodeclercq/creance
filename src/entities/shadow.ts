export const SHADOW = {
  XS: '0px 1px 2px rgba(0, 0, 0, 0.25), 0px 0px 4px rgba(0, 0, 0, 0.05)',
  S: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 0px 8px rgba(0, 0, 0, 0.05)',
  M: '0px 4px 8px rgba(0, 0, 0, 0.25), 0px 0px 16px rgba(0, 0, 0, 0.05)',
  L: '0px 8px 16px rgba(0, 0, 0, 0.25), 0px 0px 16px rgba(0, 0, 0, 0.05)',
  XL: '0px 16px 24px rgba(0, 0, 0, 0.25), 0px 0px 24px rgba(0, 0, 0, 0.05)',
  FOOTER: '0rem -1rem 1rem rgba(0,0,0,0.1)',
} as const;

export const INNER_SHADOW = {
  INNER_XS: 'inset 0px 1px 2px rgba(0, 0, 0, 0.25), inset 0px 0px 4px rgba(0, 0, 0, 0.05)',
  INNER_S: 'inset 0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 8px rgba(0, 0, 0, 0.05)',
  INNER_M: 'inset 0px 4px 8px rgba(0, 0, 0, 0.25), inset 0px 0px 16px rgba(0, 0, 0, 0.05)',
  INNER_L: 'inset 0px 8px 16px rgba(0, 0, 0, 0.25), inset 0px 0px 16px rgba(0, 0, 0, 0.05)',
  INNER_XL: 'inset 0px 16px 24px rgba(0, 0, 0, 0.25), inset 0px 0px 24px rgba(0, 0, 0, 0.05)',
} as const;

type OuterShadow = keyof typeof SHADOW;
type InnerShadow = keyof typeof INNER_SHADOW;

export type Shadow = OuterShadow | InnerShadow;

const isOuterShadow = (shadow: Shadow): shadow is OuterShadow => shadow in SHADOW;

export const toCssName = (shadow: Shadow) => isOuterShadow(shadow)
  ? `--shadow-${shadow}`
  : `--shadow-inner-${shadow}`;

export const toCssValue = (spacing: Shadow) => `var(${toCssName(spacing)})`;