import { Theme } from "../../theme";

const TOKEN = {
  COLOR: {
    PRIMARY: {
      LIGHT: "#CBDDB4",
      MEDIUM: "#576F4F",
      DARK: "#576F4F",
    },
    ACCENT: {
      LIGHT: "#94F999",
      DEFAULT: "#59B752",
      DARK: "#339953",
    },
    NEUTRAL: {
      LIGHTEST: "#FCFCF6",
      LIGHTER: "#F5F5EC",
      LIGHT: "#DCDBD2",
      DARK: "#828575",
      DARKER: "#737766",
      DARKEST: "#5B5B57",
    },
    NEGATIVE: {
      LIGHT: "#EAB7AC",
      DEFAULT: "#CC4F33",
      DARK: "#7A2F1F",
    },
    ALERT: {
      LIGHT: "#EAD5AC",
      DEFAULT: "#CC9833",
      DARK: "#7A5C1F",
    },
    POSITIVE: {
      LIGHT: "#ADEBB0",
      DEFAULT: "#33CC39",
      DARK: "#1E7B22",
    },
  },
  SIZE: {
    BASE: {
      XXXS: "0.2rem",
      XXS: "0.4rem",
      XS: "0.8rem",
      S: "1.2rem",
      M: "1.6rem",
      L: "2rem",
      XL: "2.4rem",
      XXL: "3.2rem",
      XXXL: "4rem",
    },
    GAP: {
      XS: "0.4rem 0.8rem",
      DEFAULT: "0.8rem 1.6rem",
      S: "1.6rem",
      M: "2.4rem",
      L: "3.2rem",
      XL: "4.8rem",
      XXL: "6.4rem",
    },
    PADDING: {
      S: {
        HORIZONTAL: "0.8rem",
        VERTICAL: "0.4rem",
      },
      M: {
        HORIZONTAL: "1.6rem",
        VERTICAL: "0.8rem",
      },
      L: {
        HORIZONTAL: "2.4rem",
        VERTICAL: "1.6rem",
      },
    },
  },
  RADIUS: {
    DEFAULT: "0.4rem",
    ROUNDED: "99999999999px",
  },
  SHADOWS: {
    DEFAULT: "0.2rem 0.2rem #82857566",
  },
} as const;

export const DEFAULT: Theme = {
  COLOR: {
    DEFAULT: {
      BACKGROUND: TOKEN.COLOR.NEUTRAL.LIGHTEST,
      COLOR: TOKEN.COLOR.NEUTRAL.DARKEST,
    },
    BRAND: {
      BACKGROUND: TOKEN.COLOR.PRIMARY.MEDIUM,
      COLOR: TOKEN.COLOR.NEUTRAL.LIGHTEST,
    },
    NEGATIVE: {
      BACKGROUND: TOKEN.COLOR.NEGATIVE.DARK,
      COLOR: TOKEN.COLOR.NEGATIVE.DEFAULT,
    },
  },
  SIZE: TOKEN.SIZE,
  RADIUS: TOKEN.RADIUS,
  SHADOW: TOKEN.SHADOWS,
  SEPARATOR: {
    DEFAULT: `1px solid ${TOKEN.COLOR.NEUTRAL.LIGHT}`,
  },
};
