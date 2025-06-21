import { useState, useLayoutEffect, useEffect } from "react";
import type { RefObject } from "react";

type UseThemeModeProps = {
  darkBtnRef: RefObject<HTMLButtonElement>;
  lightBtnRef: RefObject<HTMLButtonElement>;
};

export const useThemeMode = ({ darkBtnRef, lightBtnRef }: UseThemeModeProps) => {
  const [isDark, setIsDark] = useState(false);

  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    const isOsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (theme === "dark" || (theme === null && isOsDark)) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newIsDark = !prev;
      setTimeout(() => {
        if (newIsDark) {
          lightBtnRef.current?.focus();
        } else {
          darkBtnRef.current?.focus();
        }
      }, 0); // ブラウザのレンダリングが完了するまで待つ
      return newIsDark;
    });
  };

  return { isDark, toggleTheme };
}; 