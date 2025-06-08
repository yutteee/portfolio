import type React from "react";
import styles from "./index.module.css";
import { FiChevronRight } from 'react-icons/fi';

export type PageTitleProps = {
  title: string;
};

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.breadcrumbs}>
          <a href="/">トップ</a>
          <FiChevronRight />
          <div>{title}</div>
        </div>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.line} />
    </div>
  );
}; 