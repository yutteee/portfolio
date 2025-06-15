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
    if (isDark && lightBtnRef?.current) {
      root.classList.add("dark");
      lightBtnRef.current.focus();
    } else if (!isDark && darkBtnRef?.current) {
      root.classList.remove("dark");
      darkBtnRef.current.focus();
    }
  }, [isDark, darkBtnRef, lightBtnRef]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggleTheme };
} 