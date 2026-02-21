import { HeaderPresenter } from "./presenter";
import type { CurrentPage } from "./presenter";
import { useRef } from "react";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { useMenu } from "./hooks/useMenu";
import { useThemeMode } from "./hooks/useThemeMode";

export const Header: React.FC<{ currentPage?: CurrentPage }> = ({
	currentPage,
}) => {
	const closeBtnRef = useRef<HTMLButtonElement>(null);
	const hamburgerRef = useRef<HTMLButtonElement>(null);
	const darkBtnRef = useRef<HTMLButtonElement>(null);
	const lightBtnRef = useRef<HTMLButtonElement>(null);
	const spMenuRef = useRef<HTMLDivElement>(null);

	const { menuOpen, openMenu, closeMenu } = useMenu({
		closeBtnRef,
		hamburgerRef,
	});
	const { isDark, toggleTheme } = useThemeMode({ darkBtnRef, lightBtnRef });

	useFocusTrap(spMenuRef, menuOpen);

	return (
		<HeaderPresenter
			menuOpen={menuOpen}
			onOpen={openMenu}
			onClose={closeMenu}
			closeBtnRef={closeBtnRef}
			isDark={isDark}
			onThemeToggle={toggleTheme}
			darkBtnRef={darkBtnRef}
			lightBtnRef={lightBtnRef}
			currentPage={currentPage}
			spMenuRef={spMenuRef}
			hamburgerRef={hamburgerRef}
		/>
	);
};
