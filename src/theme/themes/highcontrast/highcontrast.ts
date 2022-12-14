import { ThemeOverride } from '../../theme';

const TOKEN = {
  COLOR: {
    PRIMARY: {
      LIGHT: '#576F4F',
      DARK :'#576F4F',
    },
    ACCENT: {
      LIGHT: '#94F999',
      DARK: '#339953',
    },
    NEUTRAL: {
      LIGHTEST: '#FCFCF6',
      DARKEST: '#5C5C51',
    },
    NEGATIVE: {
      LIGHT: '#EAB7AC',
      DARK: '#7A2F1F',
    },
    ALERT: {
      LIGHT: '#EAD5AC',
      DARK: '#7A5C1F',
    },
    POSITIVE: {
      LIGHT: '#ADEBB0',
      DARK: '#1E7B22',
    }
  }
} as const;

export const HIGH_CONTRAST: ThemeOverride = {
  COLOR: {
    DEFAULT: {
      BACKGROUND: TOKEN.COLOR.NEUTRAL.LIGHTEST,
      COLOR: TOKEN.COLOR.NEUTRAL.DARKEST,
    }
  }
}