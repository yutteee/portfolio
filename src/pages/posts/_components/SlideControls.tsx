import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SlideControls.module.css";

interface Props {
  total: number;
}

const SELECTOR = ".slide-deck svg[data-marpit-svg]";

function getSlides(): Element[] {
  return Array.from(document.querySelectorAll(SELECTOR));
}

// why not「各スライドについて、ビューポートと重なっている縦方向の長さ (visibleHeight) を
// 計算し、それが最大になるスライドを current とする」:
// スマホで複数枚が完全に画面に収まると visibleHeight が同値で並び、先頭の1枚が常に
// current になってしまう。ビューポート中心との距離で判定すれば常に一意に決まる
function computeCurrentIndex({ slides }: { slides: Element[] }): number {
  const viewportCenter = window.innerHeight / 2;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < slides.length; i++) {
    const rect = slides[i].getBoundingClientRect();
    const slideCenter = rect.top + rect.height / 2;
    const distance = Math.abs(slideCenter - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  return bestIndex;
}

export function SlideControls({ total }: Props) {
  const [index, setIndex] = useState(0);
  // ユーザー意図上の現在位置。クリック時に即座に進めることで smooth scroll 中の
  // 連打にも対応する。programmatic scroll 中は scroll 由来の更新で上書きしない
  const indexRef = useRef(0);
  const programmaticRef = useRef(false);
  // marp の出力は post 描画後に変化しないため、最初に取得した DOM をキャプチャして再利用
  const slidesRef = useRef<Element[]>([]);

  useEffect(() => {
    slidesRef.current = getSlides();
    if (slidesRef.current.length === 0) return;

    indexRef.current = computeCurrentIndex({ slides: slidesRef.current });
    setIndex(indexRef.current);

    let frame = 0;
    const update = () => {
      frame = 0;
      const i = computeCurrentIndex({ slides: slidesRef.current });
      setIndex(i);
      if (!programmaticRef.current) {
        indexRef.current = i;
      }
    };
    const onScroll = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(update);
    };
    const onScrollEnd = () => {
      programmaticRef.current = false;
      indexRef.current = computeCurrentIndex({ slides: slidesRef.current });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, []);

  const scrollToSlide = useCallback(({ target }: { target: number }) => {
    const slide = slidesRef.current[target];
    if (!slide) return;
    const rect = slide.getBoundingClientRect();
    const targetY =
      rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  const goPrev = useCallback(() => {
    const next = indexRef.current - 1;
    if (next < 0) return;
    indexRef.current = next;
    programmaticRef.current = true;
    scrollToSlide({ target: next });
  }, [scrollToSlide]);

  const goNext = useCallback(() => {
    const next = indexRef.current + 1;
    if (next >= total) return;
    indexRef.current = next;
    programmaticRef.current = true;
    scrollToSlide({ target: next });
  }, [total, scrollToSlide]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown"
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
      role="toolbar"
      aria-orientation="horizontal"
      aria-label="スライドコントロール"
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={index === 0}
        aria-label="前のスライド"
        className={styles.btn}
      >
        ↑
      </button>
      <span className={styles.indicator} aria-live="polite">
        {index + 1} / {total}
      </span>
      <button
        type="button"
        onClick={goNext}
        disabled={index === total - 1}
        aria-label="次のスライド"
        className={styles.btn}
      >
        ↓
      </button>
    </div>
  );
}
