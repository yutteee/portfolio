import type React from "react";
import styles from "./index.module.css";

type HogePresenterProps = {
  // 必要に応じてpropsを追加
};

export const HogePresenter: React.FC<HogePresenterProps> = (props) => (
  <div className={styles.container}>
    HogePresenter
  </div>
); 