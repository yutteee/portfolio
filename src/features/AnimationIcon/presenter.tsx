import { IconButton } from "../../ui/IconButton";
import styles from "./index.module.css";

export const AnimationIconPresenter: React.FC = () => (
	<div className={styles.container}>
		<IconButton
			label="アニメーションを有効にする"
			icon="FiPlay"
			handleClick={() => {}}
		/>
		<IconButton
			label="アニメーションを停止する"
			icon="FiPause"
			handleClick={() => {}}
		/>
	</div>
);
