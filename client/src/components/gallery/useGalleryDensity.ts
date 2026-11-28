import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useGesture } from '@use-gesture/react';
import { useReducedMotion, useSpring, type MotionValue } from 'framer-motion';
import { DENSITY_STOPS_MD, DENSITY_STOPS_SM, type DensityStop } from './types';

const MD_QUERY = '(min-width: 768px)';
/** Pinch ratio past which a release snaps to the next stop. */
const SNAP_OUT = 0.86;
const SNAP_IN = 1.16;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const on = () => setMatches(mql.matches);
    on();
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export type GalleryDensity = {
  cols: DensityStop;
  stops: DensityStop[];
  index: number;
  /** True when denser than the base stop → void backdrop. */
  isDense: boolean;
  canDenser: boolean;
  canSparser: boolean;
  denser: () => void;
  sparser: () => void;
  /** Live, springy scale applied while pinching (snaps back to 1 on release). */
  liveScale: MotionValue<number>;
};

/**
 * Discrete column density driven by pinch (touch + trackpad), Ctrl/⌘+wheel and ± buttons.
 * Continuous scale feedback between stops, spring-snap on release.
 */
export function useGalleryDensity(target: RefObject<HTMLElement>, opts: { disabled?: boolean } = {}): GalleryDensity {
  const isMd = useMediaQuery(MD_QUERY);
  const stops = isMd ? DENSITY_STOPS_MD : DENSITY_STOPS_SM;
  const baseIndex = isMd ? 1 : 0; // md: 3 cols, sm: 1 col
  const [index, setIndex] = useState(baseIndex);
  const reduce = useReducedMotion();
  const liveScale = useSpring(1, reduce ? { duration: 0 } : { stiffness: 420, damping: 32 });
  const wheelAcc = useRef(0);

  useEffect(() => setIndex(baseIndex), [baseIndex]);

  const clamp = (i: number) => Math.max(0, Math.min(stops.length - 1, i));
  const denser = useCallback(() => setIndex((i) => clamp(i + 1)), [stops.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const sparser = useCallback(() => setIndex((i) => clamp(i - 1)), [stops.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useGesture(
    {
      onPinch: ({ offset: [s], event, last, memo }) => {
        event.preventDefault?.();
        const start = (memo as number | undefined) ?? s;
        const ratio = s / start;
        if (last) {
          if (ratio < SNAP_OUT) denser();
          else if (ratio > SNAP_IN) sparser();
          liveScale.set(1);
          return undefined;
        }
        // Rubber-band the visual scale so it feels tactile, not literal.
        liveScale.set(1 + (ratio - 1) * 0.35);
        return start;
      },
      onWheel: ({ event, delta: [, dy], last }) => {
        // Plain wheel scrolls the page; Ctrl/⌘ + wheel densifies (trackpad pinch arrives as ctrl+wheel and is handled by onPinch).
        const e = event as WheelEvent;
        if (!(e.ctrlKey || e.metaKey) || last) {
          wheelAcc.current = 0;
          return;
        }
        e.preventDefault();
        wheelAcc.current += dy;
        if (wheelAcc.current > 60) { denser(); wheelAcc.current = 0; }
        else if (wheelAcc.current < -60) { sparser(); wheelAcc.current = 0; }
      },
    },
    {
      target,
      enabled: !opts.disabled,
      eventOptions: { passive: false },
      pinch: { scaleBounds: { min: 0.25, max: 4 }, rubberband: true },
    },
  );

  const safe = clamp(index);
  return {
    cols: stops[safe],
    stops,
    index: safe,
    isDense: safe > baseIndex,
    canDenser: safe < stops.length - 1,
    canSparser: safe > 0,
    denser,
    sparser,
    liveScale,
  };
}
