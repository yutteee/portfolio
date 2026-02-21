import type React from "react";
import styles from "./index.module.css";
import { FiExternalLink } from "react-icons/fi";

export type BlogPostProps = {
	title: string;
	url: string;
	image: string;
	date: string;
	alt: string;
	isExternal?: boolean;
	marp?: boolean;
};

export const BlogPost: React.FC<BlogPostProps> = ({
	title,
	url,
	image,
	date,
	alt,
	isExternal,
	marp,
}) => {
	return (
		<li className={styles.container}>
			<a
				href={url}
				className={styles.link}
				aria-label={title}
				target={isExternal ? "_blank" : "_self"}
				rel={isExternal ? "noopener noreferrer" : undefined}
			>
				<div className={styles.mask}>
					<img
						src={image}
						alt={alt}
						className={styles.image}
						width={340}
						height={178}
					/>
				</div>
				<div className={styles.texts}>
					<div className={styles.meta}>
						<div>{date}</div>
						{marp && <span className={styles.slideBadge}>スライド</span>}
					</div>
					<div className={styles.title}>
						{title}
						{isExternal && <FiExternalLink style={{ marginLeft: 4 }} />}
					</div>
				</div>
			</a>
		</li>
	);
};
