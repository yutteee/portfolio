import { useEffect, useState } from "react";
import { FooterPresenter } from "./presenter";

export const Footer: React.FC = () => {
	const [isDark, setIsDark] = useState(() =>
		document.documentElement.classList.contains("dark"),
	);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setIsDark(document.documentElement.classList.contains("dark"));
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	return <FooterPresenter isDark={isDark} />;
};
