import { useEffect } from "react";
import type { RefObject } from "react";

export function useFocusTrap(ref: RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const container = ref.current;
    if (!container) return;
    const handleTrapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handleTrapFocus);
    return () => {
      document.removeEventListener("keydown", handleTrapFocus);
    };
  }, [ref, enabled]);
}
