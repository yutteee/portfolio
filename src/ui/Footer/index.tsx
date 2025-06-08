import type React from "react";
import styles from "./index.module.css";

export type FooterProps = {
  accounts: Array<{
    name: string;
    url: string;
    icon: React.ReactNode;
    alt: string;
    darkIcon?: React.ReactNode;
    isWantedly?: boolean;
  }>;
  siteMapUrl?: string;
};

export const Footer: React.FC<FooterProps> = ({ accounts, siteMapUrl }) => {
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
            {acc.icon}
          </a>
        ))}
      </div>
      {siteMapUrl && (
        <a href={siteMapUrl} className={styles.link}>
          サイトマップ
        </a>
      )}
    </footer>
  );
}; 