import { useEffect, useState } from "react";

interface UseAnimationModeReturn {
  isStopped: boolean;
  toggleAnimation: () => void;
}

/**
 * アニメーション再生/停止の状態を管理するカスタムフック。
 *
 * 初期値は以下の優先順位で決定する。
 * 1. `<html>` 要素の `.stop` クラス（BaseLayout のインラインスクリプトが付与）
 * 2. localStorage の `"animation"` キー（`"stop"` または `"play"`）
 * 3. OS のモーション設定（`prefers-reduced-motion: reduce`）
 *
 * 状態変化時は `<html>` への `.stop` クラスの付け外しと localStorage への保存を行う。
 */
export const useAnimationMode = (): UseAnimationModeReturn => {
  const [isStopped, setIsStopped] = useState(() => {
    if (typeof document === "undefined") return false;
    if (document.documentElement.classList.contains("stop")) return true;
    const stored = localStorage.getItem("animation");
    if (stored === "stop") return true;
    if (stored === "play") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (isStopped) {
      document.documentElement.classList.add("stop");
      localStorage.setItem("animation", "stop");
    } else {
      document.documentElement.classList.remove("stop");
      localStorage.setItem("animation", "play");
    }
  }, [isStopped]);

  const toggleAnimation = () => {
    setIsStopped((prev) => !prev);
  };

  return { isStopped, toggleAnimation };
};
