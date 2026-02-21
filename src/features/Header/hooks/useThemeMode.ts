import { useState, useEffect } from "react";
import type { RefObject } from "react";

type UseThemeModeProps = {
  darkBtnRef: RefObject<HTMLButtonElement>;
  lightBtnRef: RefObject<HTMLButtonElement>;
};

export const useThemeMode = ({
  darkBtnRef,
  lightBtnRef,
}: UseThemeModeProps) => {
  // 初期状態: DOMの現在のクラスを読み取る（SSR時はfalse）
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

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
