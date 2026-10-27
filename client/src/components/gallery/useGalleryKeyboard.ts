import { useCallback, useState, type KeyboardEvent, type RefObject } from 'react';

const SELECTOR = '[data-gg-index]';

/**
 * Roving tabindex + spatial arrow navigation by *visual* position (works for any column count
 * and mixed aspect ratios). Enter/Space open is handled by the tile button itself.
 */
export function useGalleryKeyboard(root: RefObject<HTMLElement>, count: number) {
  const [current, setCurrent] = useState(0);

  const focusIndex = useCallback((i: number) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-gg-index="${i}"]`);
    if (!el) return;
    setCurrent(i);
    el.focus();
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [root]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>(SELECTOR);
    if (!target || !root.current) return;
    const i = Number(target.dataset.ggIndex);
    let nextI: number | null = null;
    switch (e.key) {
      case 'ArrowRight': nextI = Math.min(count - 1, i + 1); break;
      case 'ArrowLeft': nextI = Math.max(0, i - 1); break;
      case 'Home': nextI = 0; break;
      case 'End': nextI = count - 1; break;
      case 'ArrowDown':
      case 'ArrowUp': {
        const down = e.key === 'ArrowDown';
        const from = target.getBoundingClientRect();
        const cx = from.left + from.width / 2;
        let best: { i: number; score: number } | null = null;
        root.current.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
          const r = el.getBoundingClientRect();
          const dy = down ? r.top - from.bottom : from.top - r.bottom;
          if (dy < -2) return; // not in the requested direction
          const dx = Math.abs(r.left + r.width / 2 - cx);
          const score = dy + dx * 2; // prefer same column
          if (!best || score < best.score) best = { i: Number(el.dataset.ggIndex), score };
        });
        nextI = best ? (best as { i: number }).i : null;
        break;
      }
      default: return;
    }
    e.preventDefault();
    if (nextI !== null && nextI !== i) focusIndex(nextI);
  }, [root, count, focusIndex]);

  return { current: Math.min(current, Math.max(0, count - 1)), setCurrent, onKeyDown, focusIndex };
}
