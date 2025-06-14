import { useState, useCallback, useEffect } from "react";
import type { RefObject } from "react";

type UseMenuProps = {
  closeBtnRef: RefObject<HTMLButtonElement>;
  hamburgerRef: RefObject<HTMLButtonElement>;
}

export function useMenu({ closeBtnRef, hamburgerRef }: UseMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (menuOpen && closeBtnRef?.current) {
      closeBtnRef.current.focus();
    }
    if (!menuOpen && hamburgerRef?.current) {
      hamburgerRef.current.focus();
    }
  }, [menuOpen, closeBtnRef, hamburgerRef]);

  return { menuOpen, openMenu, closeMenu };
} 