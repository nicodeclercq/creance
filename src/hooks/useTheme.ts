import { useEffect, useState } from "react";

const getColorScheme = () => {
  if (window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(
    getColorScheme() ?? "light"
  );

  const changeTheme = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    setTheme(theme);
  };

  useEffect(() => {
    changeTheme(getColorScheme() ?? "light");
  }, []);

  return [theme, changeTheme] as const;
}
