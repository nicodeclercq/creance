export const THEME_COLOR = {
  OVERLAY: "#62755C55",
  OVERLAY_LIGHT: "#62755C22",
  PRIMARY: "#829871",
  PRIMARY_LIGHT: "#CBDDB4",
  PRIMARY_DARK: "#576F4F",
  ACCENT: "#59B752",
  ACCENT_LIGHT: "#94F999",
  ACCENT_DARK: "#339953",
  WHITE: "#FCFCF6",
  INACTIVE: "#EEEEE8",
  GREY: "#B1B4A2",
  GREY_LIGHT: "#DCDBD2",
  GREY_DARK: "#828575",
  BLACK: "#5C5C51",
} as const;
export const STATUS_COLOR = {
  WARNING: "#CC9833",
  ERROR: "#CC4F33",
  ERROR_DARK: "#7A2F1F",
  SUCCESS: "#33CC39",
  SUCCESS_DARK: "#1E7B22",
} as const;

export const SHADE_COLORS = [
  "#3F68D7",
  "#C83FD7",
  "#3FD763",
  "#D73F4F",
  "#B4D73F",
  "#D7953F",
  "#D7C83F",
  "#3F81D7",
  "#D73FB4",
  "#805C51",
  "#953FD7",
  "#D7633F",
  "#D73F81",
  "#3F4FD7",
  "#633FD7",
  "#3FD7C8",
  "#81D73F",
  "#3FB4D7",
  "#3FD795",
] as const;

export type StatusColor = keyof typeof STATUS_COLOR;
export type ThemeColor = keyof typeof THEME_COLOR;

export type Color = ThemeColor | StatusColor;

export const COLOR = Object.keys(THEME_COLOR)
  .concat(Object.keys(STATUS_COLOR))
  .reduce((acc, cur) => ({ ...acc, [cur]: cur }), {}) as { [k in Color]: k };

const isThemeColor = (color: Color): color is ThemeColor =>
  color in THEME_COLOR;

export const toCssName = (color: Color) =>
  isThemeColor(color) ? `--color-${color}` : `--color-status-${color}`;

export const toCssValue = (color: Color) => `var(${toCssName(color)})`;
