import type React from "react";
import type { IconType } from "react-icons";
import styles from "./index.module.css";

const ICON_SIZE = 20;

type ButtonBaseProps = {
  children: React.ReactNode;
  /** テキスト先頭に表示するアイコン */
  startIcon?: IconType;
  /** テキスト末尾に表示するアイコン */
  endIcon?: IconType;
};

type ButtonAsButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLinkProps = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

/** href を渡すと <a>、渡さなければ <button> としてレンダリングされる */
export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const joinClass = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

function ButtonContent({
  startIcon: StartIcon,
  endIcon: EndIcon,
  children,
}: ButtonBaseProps) {
  return (
    <>
      {StartIcon ? <StartIcon size={ICON_SIZE} /> : null}
      {children}
      {EndIcon ? <EndIcon size={ICON_SIZE} /> : null}
    </>
  );
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { children, startIcon, endIcon, className, ...rest } = props;
    return (
      <a className={joinClass(styles.button, className)} {...rest}>
        <ButtonContent startIcon={startIcon} endIcon={endIcon}>
          {children}
        </ButtonContent>
      </a>
    );
  }

  const { children, startIcon, endIcon, className, type, ...rest } = props;
  return (
    <button
      type={type ?? "button"}
      className={joinClass(styles.button, className)}
      {...rest}
    >
      <ButtonContent startIcon={startIcon} endIcon={endIcon}>
        {children}
      </ButtonContent>
    </button>
  );
}
