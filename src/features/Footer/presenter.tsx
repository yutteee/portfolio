import type React from "react";
import { accounts } from "./accounts";
import styles from "./index.module.css";

type FooterPresenterProps = {
	isDark: boolean;
};

export const FooterPresenter: React.FC<FooterPresenterProps> = ({ isDark }) => (
	<footer className={styles.footer}>
		<h2 className={styles.title}>アカウント</h2>
		<div className={styles.accounts}>
			{accounts.map((acc) => (
				<a
					key={acc.name + acc.url}
					className={acc.isWantedly ? styles.iconWantedly : styles.icon}
					href={acc.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={acc.name}
				>
					<img
						src={isDark ? acc.darkImg : acc.img}
						alt={acc.alt}
						height={60}
						width={acc.isWantedly ? 87 : 60}
						className={acc.isWantedly ? styles.iconWantedly : styles.icon}
					/>
				</a>
			))}
		</div>
		<a href="/siteMap" className={styles.link}>
			サイトマップ
		</a>
	</footer>
);
