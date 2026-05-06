import { HeaderPresenter } from "./presenter";
import type { CurrentPage } from "./presenter";
import { useRef } from "react";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { useMenu } from "./hooks/useMenu";

const toggleTheme = () => {
  const willBeDark = !document.documentElement.classList.contains("dark");
  if (willBeDark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    document.getElementById("theme-toggle-light")?.focus();
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    document.getElementById("theme-toggle-dark")?.focus();
  }
};

export const Header: React.FC<{ currentPage?: CurrentPage }> = ({
  currentPage,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const spMenuRef = useRef<HTMLDivElement>(null);

  const { menuOpen, openMenu, closeMenu } = useMenu({
    closeBtnRef,
    hamburgerRef,
  });

  useFocusTrap(spMenuRef, menuOpen);

  return (
    <HeaderPresenter
      menuOpen={menuOpen}
      onOpen={openMenu}
      onClose={closeMenu}
      closeBtnRef={closeBtnRef}
      onThemeToggle={toggleTheme}
      currentPage={currentPage}
      spMenuRef={spMenuRef}
      hamburgerRef={hamburgerRef}
    />
  );
};
