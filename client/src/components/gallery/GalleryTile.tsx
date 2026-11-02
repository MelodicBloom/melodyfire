import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GalleryMedia } from './GalleryMedia';
import { tileLayoutId, type GalleryItem } from './types';

type Props = {
  item: GalleryItem;
  index: number;
  isActive: boolean;
  tabIndex: number;
  priority: boolean;
  compact: boolean;
  onOpen: (index: number, el: HTMLElement) => void;
  onFocusTile: (index: number) => void;
  action?: ReactNode;
};

const spring = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 } as const;

export function GalleryTile({ item, index, isActive, tabIndex, priority, compact, onOpen, onFocusTile, action }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduce || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <motion.li
      layout={reduce ? false : 'position'}
      transition={spring}
      className="gg-cell"
      data-active={isActive || undefined}
      style={{ aspectRatio: item.aspectRatio ?? '1/1' }}
    >
      <div
        ref={ref}
        className="gg-tile mf-tilt group relative h-full w-full overflow-hidden rounded-xl"
        data-kind={item.kind}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <button
          type="button"
          className="gg-open absolute inset-0 h-full w-full cursor-zoom-in rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          data-gg-index={index}
          tabIndex={tabIndex}
          aria-label={`Open ${item.title}${item.kind === 'video' ? ' (video)' : ''}`}
          aria-haspopup="dialog"
          onFocus={() => onFocusTile(index)}
          onClick={(e) => onOpen(index, e.currentTarget)}
        >
          {/* The media morphs into the theater via a shared layoutId; hide it here while it's centre-locked. */}
          {!isActive && (
            <motion.div layoutId={reduce ? undefined : tileLayoutId(item.id)} transition={spring} className="h-full w-full bg-[hsl(var(--card))]">
              <GalleryMedia
                item={item}
                priority={priority}
                pauseOffscreen
                autoPlay={!reduce}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          )}
        </button>
        {item.kind === 'video' && !compact && (
          <span aria-hidden className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur">
            Motion
          </span>
        )}
        <div aria-hidden className="mf-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {!compact && (
          <div
            className="gg-caption pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
          >
            <p className="mb-1 translate-y-2 font-display text-base font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
              {item.title}
            </p>
            <div className="flex translate-y-2 items-center justify-between gap-2 transition-transform delay-75 duration-300 group-hover:translate-y-0">
              {item.label && (
                <span className="rounded-full border border-violet-500/30 bg-violet-500/30 px-2 py-0.5 text-xs text-violet-200">{item.label}</span>
              )}
              {action && <span className="pointer-events-auto">{action}</span>}
            </div>
          </div>
        )}
      </div>
    </motion.li>
  );
}
