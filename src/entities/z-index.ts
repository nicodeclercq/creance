export const Z_INDEX = {
  dropdown: '2',
  header:'1',
  main:'0',
} as const;

export type ZIndex = keyof typeof Z_INDEX;

export const toCssName = (zIndex: ZIndex) => `--z-index-${zIndex}`;

export const toCssValue = (zIndex: ZIndex) => `var(${toCssName(zIndex)})`;
