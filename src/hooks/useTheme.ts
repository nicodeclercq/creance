import { useEffect, useState } from "react";

import z from "zod";

const LOCAL_STORAGE_KEY = "theme";

const themeSchema = z.union([z.literal("light"), z.literal("dark")]);
export type Theme = z.infer<typeof themeSchema>;
const DEFAULT_THEME: Theme = "light";

const getSystemTheme = (): Theme => {
  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return DEFAULT_THEME;
};
const getPreferredTheme = (): Theme | undefined => {
  const theme = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (themeSchema.safeParse(theme).success) {
    return theme as Theme;
  }
  return undefined;
};

const getTheme = (): Theme => {
  return getPreferredTheme() ?? getSystemTheme();
};

const initTheme = (theme: Theme | undefined) => {
  if (theme) {
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }
  document.documentElement.setAttribute(
    "data-theme",
    theme ?? getSystemTheme()
  );
};

/**
 * Switch between light and dark theme depending on preferences or system theme
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme | undefined>(getPreferredTheme());

  const changeTheme = (newTheme: Theme | undefined) => {
    if (newTheme) {
      localStorage.setItem(LOCAL_STORAGE_KEY, newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      setTheme(newTheme);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      document.documentElement.setAttribute("data-theme", getSystemTheme());
      setTheme(undefined);
    }
  };

  useEffect(() => {
    initTheme(theme);

    const mediaQueries = [
      window.matchMedia("(prefers-color-scheme: dark)"),
      window.matchMedia("(prefers-color-scheme: light)"),
    ];
    const handleChange = () => {
      changeTheme(getTheme());
    };
    mediaQueries.forEach((query) => {
      query.addEventListener("change", handleChange);
    });

    return () =>
      mediaQueries.forEach((query) => {
        query.removeEventListener("change", handleChange);
      });
  }, []);

  return { theme, changeTheme, usedTheme: theme ?? getSystemTheme() } as const;
}
