import React from 'react';
import { ThemeOverride } from './theme';
import { ThemeContext } from './themeContext';
import { HIGH_CONTRAST } from './themes/highcontrast/highcontrast';
import { _Style as Styles } from './_style';

type Props<T extends ThemeOverride> = {
  defaultTheme?: T;
  children: React.ReactNode;
};

export function ThemeProvider<T extends ThemeOverride>({defaultTheme, children}: Props<T>) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      <Styles highContrastTheme={HIGH_CONTRAST}/>
      {children}
    </ThemeContext.Provider>
  );
}