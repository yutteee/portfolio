import type React from "react";
import styles from "./index.module.css";

export type TagVariant = "primary" | "secondary";

export type TagProps = {
  /** 表示ラベル。 */
  children: React.ReactNode;
  /** 見た目のスタイル。primary=塗り（強調）、secondary=枠線（控えめ）。 */
  variant?: TagVariant;
  /** 追加のクラス名。 */
  className?: string;
};

/**
 * タグ／バッジを統一する汎用コンポーネント。
 * ピル形状（--radius-infinity）で、強弱は variant（primary / secondary）で表現する。
 */
export const Tag: React.FC<TagProps> = ({
  children,
  variant = "secondary",
  className,
}) => {
  const classNames = [
    styles.tag,
    variant === "primary" ? styles.primary : styles.secondary,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{children}</span>;
};
