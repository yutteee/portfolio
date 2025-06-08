import styles from "./index.module.css";
import { accounts } from "./accounts";
import { useEffect, useState } from "react";

export const Footer: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // TODO: storybook専用の処理を書きたくない
  useEffect(() => {
    // Storybook/本番両対応: html要素のclassListで判定
    const checkDark = () =>
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(checkDark());
    // Storybookの背景切り替えにも対応
    const observer = new MutationObserver(() => setIsDark(checkDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>アカウント</h2>
      <div className={styles.accounts}>
        {accounts.map((acc) => (
          <a
            key={acc.name + acc.url}
            className={acc.isWantedly ? styles["icon-wantedly"] : styles.account}
            href={acc.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={acc.name}
          >
            <img
              src={isDark ? acc.darkImg : acc.img}
              alt={acc.alt}
              height={60}
              width={acc.isWantedly ? 87 : 60}
              className={acc.isWantedly ? styles["icon-wantedly"] : styles.icon}
            />
          </a>
        ))}
      </div>
      <a href="/siteMap" className={styles.link}>サイトマップ</a>
    </footer>
  );
}; 