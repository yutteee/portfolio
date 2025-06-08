import type React from "react";
import styles from "./index.module.css";
import * as FiIcons from 'react-icons/fi';

export type IconButtonProps = {
  label: string;
  icon: keyof typeof FiIcons;
  id?: string;
};

export const IconButton: React.FC<IconButtonProps> = ({ label, icon, id }) => {
  const IconComponent = FiIcons[icon];
  return (
    <button aria-label={label} className={styles.button} id={id} type="button">
      <IconComponent size={36} />
    </button>
  );
}; 