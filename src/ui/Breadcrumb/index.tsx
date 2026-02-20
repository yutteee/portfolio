import type React from "react";
import styles from "./index.module.css";
import { FiChevronRight } from "react-icons/fi";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="パンくずリスト">
      <ol className={styles.breadcrumbs}>
        {items.map((item, index) => (
          <li key={item.label} className={styles.item}>
            {index > 0 && <FiChevronRight aria-hidden="true" />}
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
