import { useEffect, useState } from "react";
import { FooterPresenter } from "./presenter";

export const Footer: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () =>
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(checkDark());
  }, []);

  return <FooterPresenter isDark={isDark} />;
}; 