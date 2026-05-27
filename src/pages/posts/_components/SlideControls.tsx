import { useCallback, useEffect, useState } from "react";
import styles from "./SlideControls.module.css";

interface Props {
  total: number;
}

const SELECTOR = ".slide-deck .marpit > section";

function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
}

function computeCurrentIndex(sections: HTMLElement[]): number {
  let bestIndex = 0;
  let bestVisible = -1;
  const viewportHeight = window.innerHeight;
  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    if (visibleHeight > bestVisible) {
      bestVisible = visibleHeight;
      bestIndex = i;
    }
  }
  return bestIndex;
}

export function SlideControls({ total }: Props) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const sections = getSections();
    if (sections.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setCurrent(computeCurrentIndex(sections) + 1);
    };
    const onScroll = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const sections = getSections();
    const section = sections[index];
    if (!section) return;
    const targetY = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  const goPrev = useCallback(() => {
    if (current > 1) scrollToSlide(current - 2);
  }, [current, scrollToSlide]);

  const goNext = useCallback(() => {
    if (current < total) scrollToSlide(current);
  }, [current, total, scrollToSlide]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        goNext();
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  return (
    <div
      className={styles.controls}
      role="group"
      aria-label="スライドコントロール"
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={current === 1}
        aria-label="前のスライド"
        className={styles.btn}
      >
        ↑
      </button>
      <span className={styles.indicator} aria-live="polite">
        {current} / {total}
      </span>
      <button
        type="button"
        onClick={goNext}
        disabled={current === total}
        aria-label="次のスライド"
        className={styles.btn}
      >
        ↓
      </button>
    </div>
  );
}
