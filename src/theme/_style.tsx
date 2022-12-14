import React, { useContext, useEffect } from 'react';
import {pipe } from 'fp-ts/function';
import { DEFAULT } from './themes/default/default';
import { usePortal } from '../application/usePortal';
import { ThemeContext } from './themeContext';
import { deepMerge, isObject } from '../infrastructure/object';
import { ThemeOverride } from './theme';

const toCssVars = <T extends {}>(theme: T, rootName: string = ''): string => `
  ${
    Object.entries(theme)
      .map(([key, value]) => isObject(value)
        ? toCssVars(value, `${rootName}-${key}`)
        : `--${rootName}-${key}: ${value};`
      )
      .join('')
  }
`;

type Props = {
  highContrastTheme?: ThemeOverride;
}
export function _Style({highContrastTheme}: Props) {
  const theme = useContext(ThemeContext);
  const { show } = usePortal('#theme');

  useEffect(() => {
    const highContrastStyles = highContrastTheme != null
      ? `@media (prefers-contrast: more) {${toCssVars(highContrastTheme)}}`
      : '';
    const themeStyles = pipe(
      deepMerge(DEFAULT, theme ? theme : {}),
      toCssVars,
      a => `:root {${a}}`,
    );
    show(`${themeStyles}${highContrastStyles}`);
  }, [show, theme]);

  return (<></>);
}