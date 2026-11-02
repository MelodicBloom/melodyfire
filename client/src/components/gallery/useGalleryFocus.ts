import { useCallback, useRef, useState } from 'react';

/** Focus-theater state: which item is centre-locked, and where focus returns on exit. */
export function useGalleryFocus(count: number) {
  const [active, setActive] = useState<number | null>(null);
  const origin = useRef<HTMLElement | null>(null);

  const open = useCallback((i: number, from?: HTMLElement | null) => {
    origin.current = from ?? (document.activeElement as HTMLElement | null);
    setActive(i);
  }, []);
  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => setActive((i) => (i === null || count === 0 ? i : (i + 1) % count)), [count]);
  const prev = useCallback(() => setActive((i) => (i === null || count === 0 ? i : (i - 1 + count) % count)), [count]);
  /** Call after the exit animation: put focus back on the originating tile. */
  const restoreFocus = useCallback((fallback?: HTMLElement | null) => {
    const el = fallback ?? origin.current;
    el?.focus({ preventScroll: true });
    origin.current = null;
  }, []);

  return { active, setActive, open, close, next, prev, restoreFocus, origin };
}
