import React from "react";
import styles from "./index.module.css";
import type { IconType } from "react-icons";

export type IconButtonProps = {
  label: string;
  icon: IconType;
  id?: string;
  handleClick: () => void;
  style?: React.CSSProperties;
  "data-testid"?: string;
  className?: string;
  "aria-pressed"?: boolean;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      label,
      icon,
      id,
      handleClick,
      style,
      "data-testid": dataTestId,
      className,
      "aria-pressed": ariaPressed,
    },
    ref,
  ) => {
    const IconComponent = icon;
    return (
      <button
        aria-label={label}
        aria-pressed={ariaPressed}
        className={className ? `${styles.button} ${className}` : styles.button}
        id={id}
        type="button"
        ref={ref}
        onClick={handleClick}
        style={style}
        data-testid={dataTestId}
      >
        <IconComponent size={36} />
      </button>
    );
  },
);
IconButton.displayName = "IconButton";
