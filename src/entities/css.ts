import { BORDER } from "./border";
import { THEME_COLOR, STATUS_COLOR } from "./color";
import { FONT } from "./font";
import { RADIUS } from "./radius";
import { SHADOW } from "./shadow";
import { SPACING } from "./spacing";
import { TRANSITION } from "./transition";

export const getCustomCss = () => `:root {
  ${Object.entries({ ...THEME_COLOR, ...STATUS_COLOR })
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join("\n")}
  ${Object.entries(SPACING)
    .map(([key, value]) => `--spacing-${key}: ${value};`)
    .join("\n")}
  ${Object.entries(RADIUS)
    .map(([key, value]) => `--radius-${key}: ${value};`)
    .join("\n")}
  ${Object.entries(BORDER)
    .map(([key, value]) => `--border-${key}: ${value};`)
    .join("\n")}
  ${Object.entries(FONT)
    .map(([key, value]) => `--font-${key}: ${value};`)
    .join("\n")}
  ${Object.entries(SHADOW)
    .map(([key, value]) => `--shadow-${key}: ${value};`)
    .join("\n")}
  ${Object.entries(TRANSITION)
    .map(([key, value]) => `--transition-${key}: ${value};`)
    .join("\n")}
  }`;
