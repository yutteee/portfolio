import { useRef } from "react";
import { FiPause, FiPlay } from "react-icons/fi";
import { IconButton } from "../../ui/IconButton";
import styles from "./index.module.css";

export const AnimationIcon: React.FC = () => {
  const stopButtonRef = useRef<HTMLButtonElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  const toggleAnimation = () => {
    const html = document.documentElement;
    const willStop = !html.classList.contains("stop");
    html.classList.toggle("stop", willStop);
    localStorage.setItem("animation", willStop ? "stop" : "play");
    // display:none で外れる focus を、表示側のボタンへ移す
    (willStop ? playButtonRef : stopButtonRef).current?.focus();
  };

  return (
    <>
      <IconButton
        ref={stopButtonRef}
        label="アニメーションを停止する"
        icon={FiPause}
        handleClick={toggleAnimation}
        className={styles.stopButton}
      />
      <IconButton
        ref={playButtonRef}
        label="アニメーションを有効にする"
        icon={FiPlay}
        handleClick={toggleAnimation}
        className={styles.playButton}
      />
    </>
  );
};
