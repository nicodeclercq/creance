import React from "react";
import { _Style as Styles } from "./_style";
import { ThemeOverride } from "./theme";
import { ThemeContext } from "./themeContext";

type Props<T extends ThemeOverride> = {
  defaultTheme?: T;
  children: React.ReactNode;
};

export function ThemeProvider<T extends ThemeOverride>({
  defaultTheme,
  children,
}: Props<T>) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      <Styles />
      {children}
    </ThemeContext.Provider>
  );
}
