import { useState, useEffect } from "react";

export const useThemeMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    // BaseLayoutのインラインスクリプトで既にクラスが付いていればそれを使う
    if (document.documentElement.classList.contains("dark")) return true;
    // localStorageの設定を確認
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    // OSのカラースキーム設定にフォールバック
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
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
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleTheme };
};
