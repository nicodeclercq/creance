import cormorant from "@capsizecss/metrics/cormorant";
import robotoMono from "@capsizecss/metrics/robotoMono";
import roboto from "@capsizecss/metrics/roboto";
import { font } from "../../infrastructure/style";

export const BASE_TOKENS = {
  FONTS: {
    HEADING: font({
      NAME: "Cormorant",
      METRICS: cormorant,
      SIZE: 48,
      WEIGHT: 700,
      LINE_GAP: 24,
    }),
    SUB_HEADING: font({
      NAME: "Cormorant",
      METRICS: cormorant,
      SIZE: 32,
      WEIGHT: 400,
      LINE_GAP: 16,
    }),
    LABEL: font({
      NAME: "Cormorant",
      METRICS: cormorant,
      SIZE: 16,
      WEIGHT: 300,
      LINE_GAP: 8,
    }),
    NUMERIC: {
      L: font({
        NAME: '"Roboto Mono"',
        METRICS: robotoMono,
        SIZE: 20,
        WEIGHT: 100,
        LINE_GAP: 8,
      }),
      M: font({
        NAME: '"Roboto Mono"',
        METRICS: robotoMono,
        SIZE: 16,
        WEIGHT: 100,
        LINE_GAP: 8,
      }),
      S: font({
        NAME: '"Roboto Mono"',
        METRICS: robotoMono,
        SIZE: 12,
        WEIGHT: 100,
        LINE_GAP: 8,
      }),
    },
    TEXT: {
      L: font({
        NAME: "Roboto",
        METRICS: roboto,
        SIZE: 20,
        WEIGHT: 400,
        LINE_GAP: 8,
      }),
      M: font({
        NAME: "Roboto",
        METRICS: roboto,
        SIZE: 16,
        WEIGHT: 400,
        LINE_GAP: 8,
      }),
      S: font({
        NAME: "Roboto",
        METRICS: roboto,
        SIZE: 12,
        WEIGHT: 400,
        LINE_GAP: 8,
      }),
    },
  },
  SPACES: {
    XXS: ".4rem",
    XS: ".8rem",
    S: "1.2rem",
    M: "1.6rem",
    L: "2rem",
    XL: "2.4rem",
    XXL: "3.2rem",
    XXXL: "4.8rem",
    XXXXL: "6.4rem",
  },
  COLORS: {
    BRAND: {
      "20": "#CBDDB4",
      "50": "#829871",
      "80": "#576F4F",
    },
    PRIMARY: {
      "20": "#A4CD84",
      "50": "#659B3A",
      "70": "#407317",
      "80": "#407317",
      "90": "#407317",
    },
    SUCCESS: {
      "20": "#9DEABC",
      "50": "#48B172",
      "80": "#16743B",
    },
    NEUTRAL: {
      "00": "#FCFCF6",
      "10": "#F5F5EC",
      "20": "#DCDBD2",
      "30": "#B1B4A2",
      "40": "#828575",
      "50": "#828575",
      "60": "#737766",
      "70": "#5C5C51",
      "80": "#4A4A41",
      "90": "#404136",
      "100": "#2E2F24",
    },
  },
} as const;
