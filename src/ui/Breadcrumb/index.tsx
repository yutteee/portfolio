import type React from "react";
import styles from "./index.module.css";
import { FiChevronRight } from "react-icons/fi";

export type BreadcrumbAncestor = {
  label: string;
  href: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbAncestor[];
  currentLabel: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentLabel }) => {
  return (
    <nav aria-label="パンくずリスト">
      <ol className={styles.breadcrumbs} role="list">
        {items.map((item) => (
          <li key={item.href} className={styles.item}>
            <a href={item.href}>{item.label}</a>
            <FiChevronRight aria-hidden="true" />
          </li>
        ))}
        <li className={styles.item}>
          <span aria-current="page">{currentLabel}</span>
        </li>
      </ol>
    </nav>
  );
};
