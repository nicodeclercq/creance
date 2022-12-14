export const BASE_DIRECTION = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
} as const;

export type BaseDirection = keyof typeof BASE_DIRECTION;

export const DIRECTION = {
  ...BASE_DIRECTION,
  BOTH: 'BOTH',
} as const;

export type Direction = keyof typeof DIRECTION;
