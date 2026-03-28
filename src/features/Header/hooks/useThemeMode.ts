import { useState, useEffect } from "react";

/** `useThemeMode` の返り値 */
interface UseThemeModeReturn {
  /** 現在ダークモードかどうか */
  isDark: boolean;
  /** ダーク/ライトモードをトグルする */
  toggleTheme: () => void;
}

/**
 * ダーク/ライトモードの状態を管理するカスタムフック。
 *
 * 初期値は以下の優先順位で決定する。
 * 1. `<html>` 要素の `.dark` クラス（BaseLayout のインラインスクリプトが付与）
 * 2. localStorage の `"theme"` キー（`"dark"` または `"light"`）
 * 3. OS のカラースキーム設定（`prefers-color-scheme: dark`）
 *
 * 状態変化時は `<html>` への `.dark` クラスの付け外しと localStorage への保存を行う。
 */
export const useThemeMode = (): UseThemeModeReturn => {
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
