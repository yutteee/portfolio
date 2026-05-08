import { IconButton } from "../../ui/IconButton";
import { FiPlay, FiPause } from "react-icons/fi";
import { useAnimationMode } from "./hooks/useAnimationMode";

export const AnimationIcon: React.FC = () => {
  const { isStopped, toggleAnimation } = useAnimationMode();
  return (
    <IconButton
      label={
        isStopped ? "アニメーションを有効にする" : "アニメーションを停止する"
      }
      icon={isStopped ? FiPlay : FiPause}
      id={isStopped ? "togglePlayAnimation" : "toggleStopAnimation"}
      handleClick={toggleAnimation}
      aria-pressed={isStopped}
    />
  );
};
