import type React from "react";
import styles from "./index.module.css";
import { FiArrowRight } from "react-icons/fi";

export type LinkButtonProps = {
  text: string;
  url: string;
  ariaLabel: string;
};

export const LinkButton: React.FC<LinkButtonProps> = ({
  text,
  url,
  ariaLabel,
}) => {
  return (
    <a className={styles.button} href={url} aria-label={ariaLabel}>
      {text}
      <FiArrowRight size={20} />
    </a>
  );
};
