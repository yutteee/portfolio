import styles from "./index.module.css";
import { IconButton } from "../../ui/IconButton";

export const NAV_PAGES = ["私について", "プロダクト", "記事"] as const;
export type CurrentPage = (typeof NAV_PAGES)[number];

export type HeaderPresenterProps = {
	menuOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	closeBtnRef: React.RefObject<HTMLButtonElement>;
	isDark: boolean;
	onThemeToggle: () => void;
	darkBtnRef: React.RefObject<HTMLButtonElement>;
	lightBtnRef: React.RefObject<HTMLButtonElement>;
	currentPage?: CurrentPage;
	spMenuRef: React.RefObject<HTMLDivElement>;
	hamburgerRef: React.RefObject<HTMLButtonElement>;
};

export const HeaderPresenter: React.FC<HeaderPresenterProps> = ({
	menuOpen,
	onOpen,
	onClose,
	closeBtnRef,
	isDark,
	onThemeToggle,
	darkBtnRef,
	lightBtnRef,
	currentPage,
	spMenuRef,
	hamburgerRef,
}) => {
	return (
		<header className={styles.header}>
			<a href="/" className={styles.logo} aria-label="トップ">
				Yutteee
			</a>
			<div className={styles.nav}>
				<nav className={styles.navLinks} aria-label="メインナビゲーション">
					<a
						href="/about/"
						className={
							currentPage === "私について" ? styles.current : undefined
						}
					>
						私について
					</a>
					<a
						href="/products/"
						className={
							currentPage === "プロダクト" ? styles.current : undefined
						}
					>
						プロダクト
					</a>
					<a
						href="/posts/"
						className={currentPage === "記事" ? styles.current : undefined}
					>
						記事
					</a>
				</nav>
				<div className={styles.hamburger}>
					<IconButton
						label="メニューを開く"
						icon="FiMenu"
						id="hamburger"
						handleClick={onOpen}
						ref={hamburgerRef}
					/>
				</div>
				<div style={{ display: isDark ? "none" : "inline-flex" }}>
					<IconButton
						label="ダークモードにする"
						icon="FiMoon"
						id="theme-toggle-dark"
						data-testid="theme-toggle-dark"
						handleClick={onThemeToggle}
						ref={darkBtnRef}
					/>
				</div>
				<div style={{ display: isDark ? "inline-flex" : "none" }}>
					<IconButton
						label="ライトモードにする"
						icon="FiSun"
						id="theme-toggle-light"
						data-testid="theme-toggle-light"
						handleClick={onThemeToggle}
						ref={lightBtnRef}
					/>
				</div>
			</div>
			<div
				data-testid="sp-menu"
				ref={spMenuRef}
				className={`${styles.spMenu}${menuOpen ? ` ${styles.open}` : ""}`}
			>
				<div className={styles.close}>
					<IconButton
						label="メニューを閉じる"
						icon="FiX"
						id="close"
						handleClick={onClose}
						ref={closeBtnRef}
					/>
				</div>
				<nav aria-label="スマホメニュー" className={styles.spNav}>
					<a href="/">トップページ</a>
					<a href="/about/">私について</a>
					<a href="/products/">プロダクト</a>
					<a href="/posts/">記事</a>
				</nav>
			</div>
		</header>
	);
};
