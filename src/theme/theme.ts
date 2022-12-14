import { FontMetrics } from '@capsizecss/core';
import cormorant from '@capsizecss/metrics/cormorant';
import robotoMono from '@capsizecss/metrics/robotoMono';
import roboto from '@capsizecss/metrics/roboto';
import { DeepPartial } from './../../@types/deepPartial';

export type Font = {
  NAME: string;
  METRICS: FontMetrics;
  SIZE: number;
  WEIGHT: number;
  LINE_GAP: number;
};

export const FONTS = {
  HEADING: {NAME: 'Cormorant', METRICS: cormorant, SIZE: 48, WEIGHT: 700, LINE_GAP: 24},
  SUB_HEADING: {NAME: 'Cormorant', METRICS: cormorant, SIZE: 32, WEIGHT: 400, LINE_GAP: 16},
  LABEL: {NAME: 'Cormorant', METRICS: cormorant, SIZE: 16, WEIGHT: 300, LINE_GAP: 8},
  NUMERIC: {
    L: {NAME: '"Roboto Mono"', METRICS: robotoMono, SIZE: 20, WEIGHT: 100, LINE_GAP: 8},
    M: {NAME: '"Roboto Mono"', METRICS: robotoMono, SIZE: 16, WEIGHT: 100, LINE_GAP: 8},
    S: {NAME: '"Roboto Mono"', METRICS: robotoMono, SIZE: 12, WEIGHT: 100, LINE_GAP: 8},
  },
  TEXT: {
    L: {NAME: 'Roboto', METRICS: roboto, SIZE: 20, WEIGHT: 400, LINE_GAP: 8},
    M: {NAME: 'Roboto', METRICS: roboto, SIZE: 16, WEIGHT: 400, LINE_GAP: 8},
    S: {NAME: 'Roboto', METRICS: roboto, SIZE: 12, WEIGHT: 400, LINE_GAP: 8},
  },
} as const;

type Colors = {
  DEFAULT: {
    BACKGROUND: string;
    COLOR: string;
  };
  BRAND: {
    BACKGROUND: string;
    COLOR: string;
  }
};

type Shadows = {
  DEFAULT: string;
};

type Radiuses = {
  DEFAULT: string,
  ROUNDED: string,
}

type Sizes = {
  BASE: {
    XXXS: string,
    XXS: string,
    XS: string,
    S: string,
    M: string,
    L: string,
    XL: string,
    XXL: string,
    XXXL: string,
  },
  GAP: {
    DEFAULT: string;
    S: string,
    M: string,
    L: string,
    XL: string,
    XXL: string,
  },
  PADDING: {
    M: {
      HORIZONTAL: string,
      VERTICAL: string,
    },
    L: {
      HORIZONTAL: string,
      VERTICAL: string,
    },
  },
}

type Separator = {
  DEFAULT: string,
}

export type Theme = {
  COLOR: Colors,
  SIZE: Sizes,
  RADIUS: Radiuses,
  SHADOW: Shadows,
  SEPARATOR: Separator,
};
export type ThemeOverride = DeepPartial<Theme>;
