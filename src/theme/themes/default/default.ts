import { Theme } from '../../theme';

const TOKEN = {
  COLOR: {
    PRIMARY: {
      LIGHT :'#CBDDB4',
      MEDIUM: '#576F4F',
      DARK :'#576F4F',
    },
    ACCENT: {
      LIGHT: '#94F999',
      DEFAULT: '#59B752',
      DARK: '#339953',
    },
    NEUTRAL: {
      LIGHTEST: '#FCFCF6',
      LIGHTER: '#F5F5EC',
      LIGHT: '#DCDBD2',
      DARK: '#828575',
      DARKER: '#737766',
      DARKEST: '#5C5C51',
    },
    NEGATIVE: {
      LIGHT: '#EAB7AC',
      DEFAULT: '#CC4F33',
      DARK: '#7A2F1F',
    },
    ALERT: {
      LIGHT: '#EAD5AC',
      DEFAULT: '#CC9833',
      DARK: '#7A5C1F',
    },
    POSITIVE: {
      LIGHT: '#ADEBB0',
      DEFAULT: '#33CC39',
      DARK: '#1E7B22',
    }
  },
  SIZE: {
    BASE: {
      XXXS: '2rem',
      XXS: '4rem',
      XS: '8rem',
      S: '12rem',
      M: '16rem',
      L: '20rem',
      XL: '24rem',
      XXL: '32rem',
      XXXL: '40rem',
    },
    GAP: {
      DEFAULT: '8rem 16rem',
      S: '16rem',
      M: '24rem',
      L: '32rem',
      XL: '48rem',
      XXL: '64rem',
    },
    PADDING: {
      M: {
        HORIZONTAL: '16rem',
        VERTICAL: '8rem',
      },
      L: {
        HORIZONTAL: '24rem',
        VERTICAL: '16rem',
      }
    }
  },
  RADIUS: {
    DEFAULT: '4px',
    ROUNDED: '99999999999px',
  },
  SHADOWS: {
    DEFAULT: '2rem 2rem #82857566',
  }
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
      DEFAULT: TOKEN.COLOR.NEGATIVE.DEFAULT,
    }
  },
  SIZE: TOKEN.SIZE,
  RADIUS: TOKEN.RADIUS,
  SHADOW: TOKEN.SHADOWS,
  SEPARATOR: {
    DEFAULT: `1px solid ${TOKEN.COLOR.NEUTRAL.LIGHT}`
  }
};
