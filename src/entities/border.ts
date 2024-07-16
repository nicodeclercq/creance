export const BORDER_DEFINITION = {
  NONE:'none',
  _FOOTER:'0.5rem solid currentColor',
  DEFAULT:'1px solid currentColor',
  LIGHT:'0.5px solid currentColor',
  TRANSPARENT:'1px solid transparent',
  TRANSPARENT_LIGHT:'0.5px solid transparent',
} as const;

export type Border = keyof typeof BORDER_DEFINITION;

export const BORDER = Object
  .keys(BORDER_DEFINITION)
  .reduce((acc, cur) => ({...acc, [cur]: cur}), {}) as {[k in Border]: k};

export const toCssName = (border: Border) => `--border-${border}`;

export const toCssValue = (border: Border) => `var(${toCssName(border)})`;
