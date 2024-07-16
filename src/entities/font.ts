export const FONT = {
  DEFAULT:'1rem/1.25 "Roboto", sans-serif',
  TITLE:'500 1.375rem/1.25 "Cormorant", serif',
  SUBTITLE:'bold 1.25rem/1.25 "Cormorant", serif',
  LABEL:'1rem/1.25 "Cormorant", serif',
  LABEL_SMALL:'0.75rem/1.25 "Cormorant", serif',
  NUMERIC: '1em/1.25 "Old Standard TT", serif',
} as const;

export type Font = keyof typeof FONT;

export const toCssName = (font: Font) => `--font-${font}`;

export const toCssValue = (font: Font) => `var(${toCssName(font)})`;
