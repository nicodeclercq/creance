export const JUSTIFY = {
  CENTER: 'center',
  START: 'flex-start',
  END: 'flex-end',
  SPACE_BETWEEN: 'space-between',
  SPACE_EVENLY: 'space-evenly',
} as const;

export type Justify = keyof typeof JUSTIFY;

export const ALIGN = {
  CENTER: 'center',
  START: 'flex-start',
  END: 'flex-end',
  BASELINE: 'baseline',
} as const;

export type Align = keyof typeof ALIGN;