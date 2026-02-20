import type React from "react";
import styles from "./index.module.css";
import { Breadcrumb } from "../Breadcrumb";

export type PageTitleProps = {
  title: string;
};

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Breadcrumb items={[{ label: "トップ", href: "/" }, { label: title }]} />
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.line} />
    </div>
  );
};
