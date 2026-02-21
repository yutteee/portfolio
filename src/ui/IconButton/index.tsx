import React from "react";
import styles from "./index.module.css";
import * as FiIcons from "react-icons/fi";

export type IconButtonProps = {
	label: string;
	icon: keyof typeof FiIcons;
	id?: string;
	handleClick: () => void;
	style?: React.CSSProperties;
	"data-testid"?: string;
	className?: string;
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
		},
		ref,
	) => {
		const IconComponent = FiIcons[icon];
		return (
			<button
				aria-label={label}
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
