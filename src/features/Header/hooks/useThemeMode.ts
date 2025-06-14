import { useState, useEffect, useCallback } from "react";
import type { RefObject } from "react";

type UseThemeModeProps = {
  darkBtnRef: RefObject<HTMLButtonElement>;
  lightBtnRef: RefObject<HTMLButtonElement>;
}

export function useThemeMode({ darkBtnRef, lightBtnRef }: UseThemeModeProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark && darkBtnRef?.current) {
      root.classList.add("dark");
      darkBtnRef.current.focus();
    } else if (!isDark && lightBtnRef?.current) {
      root.classList.remove("dark");
      lightBtnRef.current.focus();
    }
  }, [isDark, darkBtnRef, lightBtnRef]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggleTheme };
} 