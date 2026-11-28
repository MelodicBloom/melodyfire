import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react';
import { LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { FocusTheater } from './FocusTheater';
import { GalleryTile } from './GalleryTile';
import { useGalleryDensity } from './useGalleryDensity';
import { useGalleryFocus } from './useGalleryFocus';
import { useGalleryKeyboard } from './useGalleryKeyboard';
import type { GalleryItem } from './types';
import './densify.css';

export type GalleryGridProps = {
  items: GalleryItem[];
  /** Accessible name for the collection. */
  label: string;
  /** Extra control shown on a tile's hover caption (e.g. "Commission similar"). */
  renderTileAction?: (item: GalleryItem) => ReactNode;
  /** Extra controls shown in the focus theater. */
  renderTheaterActions?: (item: GalleryItem, close: () => void) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
};

export function GalleryGrid({ items, label, renderTileAction, renderTheaterActions, emptyState, className = '' }: GalleryGridProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const focus = useGalleryFocus(items.length);
  const density = useGalleryDensity(shellRef, { disabled: focus.active !== null });
  const keys = useGalleryKeyboard(listRef, items.length);

  const open = useCallback((i: number, el: HTMLElement) => {
    // showModal first so the theater mounts inside an open top-layer dialog (layout measure is correct).
    const d = dialogRef.current;
    if (d && !d.open) {
      if (typeof d.showModal === 'function') d.showModal();
      else d.setAttribute('open', '');
    }
    focus.open(i, el);
  }, [focus]);

  const onExitComplete = useCallback(() => {
    const d = dialogRef.current;
    if (focus.active === null && d?.open) d.close();
    // Return focus to the tile the user is "on" now (may differ after cycling).
    const el = listRef.current?.querySelector<HTMLElement>(`[data-gg-index="${keys.current}"]`);
    focus.restoreFocus(el);
  }, [focus, keys.current]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the roving index in sync with theater cycling so focus returns to the right tile.
  const next = useCallback(() => { focus.next(); keys.setCurrent((c) => (c + 1) % Math.max(1, items.length)); }, [focus, keys, items.length]);
  const prev = useCallback(() => { focus.prev(); keys.setCurrent((c) => (c - 1 + items.length) % Math.max(1, items.length)); }, [focus, keys, items.length]);

  const compact = density.cols >= 4;
  const style = { '--gg-cols': density.cols } as CSSProperties;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={shellRef}
        className={`gg-shell ${className}`}
        data-dense={density.isDense || undefined}
        data-focused={focus.active !== null || undefined}
        style={style}
      >
        <div className="gg-toolbar" role="toolbar" aria-label="Gallery density">
          <span className="gg-hint hidden sm:inline">Pinch or Ctrl/⌘ + scroll to densify</span>
          <button type="button" className="gg-btn h-9 w-9 text-lg" onClick={density.denser} disabled={!density.canDenser} aria-label="Zoom out — more columns">−</button>
          <span className="min-w-[5.5rem] text-center text-xs tabular-nums text-white/60" aria-live="polite">
            {density.cols} {density.cols === 1 ? 'column' : 'columns'}
          </span>
          <button type="button" className="gg-btn h-9 w-9 text-lg" onClick={density.sparser} disabled={!density.canSparser} aria-label="Zoom in — fewer columns">+</button>
        </div>

        {items.length === 0 ? (
          emptyState ?? null
        ) : (
          <LayoutGroup>
            <motion.ul
              ref={listRef}
              className="gg-grid"
              aria-label={label}
              onKeyDown={keys.onKeyDown}
              style={{ scale: density.liveScale }}
            >
              {items.map((item, i) => (
                <GalleryTile
                  key={item.id}
                  item={item}
                  index={i}
                  isActive={focus.active === i}
                  tabIndex={i === keys.current ? 0 : -1}
                  priority={i === 0}
                  compact={compact}
                  onOpen={(idx, el) => { keys.setCurrent(idx); open(idx, el); }}
                  onFocusTile={keys.setCurrent}
                  action={renderTileAction?.(item)}
                />
              ))}
            </motion.ul>
            <FocusTheater
              dialogRef={dialogRef}
              items={items}
              active={focus.active}
              onClose={focus.close}
              onNext={next}
              onPrev={prev}
              onExitComplete={onExitComplete}
              renderActions={renderTheaterActions ? (it) => renderTheaterActions(it, focus.close) : undefined}
            />
          </LayoutGroup>
        )}
      </div>
    </MotionConfig>
  );
}

export type { GalleryItem } from './types';
