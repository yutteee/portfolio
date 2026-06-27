import type React from "react";
import styles from "./index.module.css";

export type ScrapProps = {
  title: string;
  pubDate: string;
  description: string;
  /** マークダウン本文（`<Content />`）を渡す。詳細・参考など自由なセクションを含められる。 */
  children: React.ReactNode;
};

/**
 * スクラップ1件を表示するコンポーネント。
 * 日付・タイトル・説明は常に表示し、本文は「詳細を見る」で一括展開する（ネイティブ details/summary）。
 * クリックのみで動作するため hydration 不要。`client:*` を付けずに使用する。
 */
export const Scrap: React.FC<ScrapProps> = ({
  title,
  pubDate,
  description,
  children,
}) => {
  return (
    <article className={styles.container}>
      <time className={styles.date} dateTime={pubDate}>
        {pubDate}
      </time>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <details className={styles.details}>
        <summary className={styles.summary}>
          <span className={styles.chevron} aria-hidden="true">
            ▸
          </span>
          <span className={styles.labelClosed}>詳細を見る</span>
          <span className={styles.labelOpen}>閉じる</span>
        </summary>
        <div className={styles.body}>{children}</div>
      </details>
    </article>
  );
};
