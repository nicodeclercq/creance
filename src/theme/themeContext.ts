import React from 'react';
import { ThemeOverride } from './theme';

export const ThemeContext = React.createContext<ThemeOverride | undefined>(undefined);