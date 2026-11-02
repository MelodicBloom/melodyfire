import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { GalleryMedia } from './GalleryMedia';
import { tileLayoutId, type GalleryItem } from './types';

type Props = {
  dialogRef: RefObject<HTMLDialogElement>;
  items: GalleryItem[];
  active: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExitComplete: () => void;
  renderActions?: (item: GalleryItem) => ReactNode;
};

function ratio(ar?: string) {
  const [w, h] = (ar ?? '1/1').split('/').map(Number);
  return w > 0 && h > 0 ? w / h : 1;
}

const spring = { type: 'spring', stiffness: 300, damping: 32, mass: 0.9 } as const;

/**
 * Native <dialog> opened with showModal() (top layer, inert background, Esc) — the grid stays
 * visible behind a transparent ::backdrop so siblings can blur + shrink in place.
 */
export function FocusTheater({ dialogRef, items, active, onClose, onNext, onPrev, onExitComplete, renderActions }: Props) {
  const item = active !== null ? items[active] : null;
  const reduce = useReducedMotion();
  const titleId = useId();
  const [muted, setMuted] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  // Esc → our close (so the exit animation runs) instead of the instant native close.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    d.addEventListener('cancel', onCancel);
    return () => d.removeEventListener('cancel', onCancel);
  }, [dialogRef, onClose]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
    };
    const d = dialogRef.current;
    d?.addEventListener('keydown', onKey);
    return () => d?.removeEventListener('keydown', onKey);
  }, [item, onNext, onPrev, dialogRef]);

  // Swipe ←/→ cycles, swipe ↓ exits.
  useDrag(
    ({ swipe: [sx, sy] }) => {
      if (sx === -1) onNext();
      else if (sx === 1) onPrev();
      else if (sy === 1) onClose();
    },
    { target: stageRef, filterTaps: true, swipe: { distance: [50, 70], velocity: [0.3, 0.3] }, pointer: { touch: true } },
  );

  return (
    <dialog
      ref={dialogRef}
      className="gg-theater"
      aria-labelledby={titleId}
      aria-modal="true"
      // Light dismiss: a click that lands on the dialog itself (the void), not its content.
      onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.ggVoid) onClose(); }}
    >
      <AnimatePresence onExitComplete={onExitComplete}>
        {item && (
          <motion.div
            key="theater"
            className="gg-theater-inner"
            data-gg-void="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <button type="button" autoFocus onClick={onClose} aria-label="Close" className="gg-btn absolute right-4 top-4 z-10 h-10 w-10 text-xl">×</button>
            {items.length > 1 && (
              <>
                <button type="button" onClick={onPrev} aria-label="Previous" className="gg-btn absolute left-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 text-2xl">‹</button>
                <button type="button" onClick={onNext} aria-label="Next" className="gg-btn absolute right-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 text-2xl">›</button>
              </>
            )}
            <div ref={stageRef} className="gg-stage" data-gg-void="true">
              <motion.div
                key={item.id}
                layoutId={reduce ? undefined : tileLayoutId(item.id)}
                transition={spring}
                className="gg-stage-media"
                style={{ aspectRatio: item.aspectRatio ?? '1/1', width: `min(86vw, calc(80vh * ${ratio(item.aspectRatio)}))` }}
              >
                <GalleryMedia item={item} fit="contain" muted={muted} priority />
              </motion.div>
            </div>
            <div className="absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-2 px-6 text-center">
              <h2 id={titleId} className="font-display text-lg font-bold text-white">{item.title}</h2>
              <span className="text-sm text-white/55" aria-live="polite">
                {item.label ? `${item.label} · ` : ''}{active! + 1} / {items.length}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {item.kind === 'video' && (
                  <button type="button" className="gg-btn px-3 py-1 text-xs" aria-pressed={!muted} onClick={() => setMuted((m) => !m)}>
                    {muted ? 'Unmute' : 'Mute'}
                  </button>
                )}
                {renderActions?.(item)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
