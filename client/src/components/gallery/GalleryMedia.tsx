import { forwardRef, useEffect, useRef } from 'react';
import type { GalleryItem } from './types';

type Props = {
  item: GalleryItem;
  className?: string;
  /** Grid: autoplay muted loop. Theater: same, with external mute control. */
  muted?: boolean;
  autoPlay?: boolean;
  priority?: boolean;
  fit?: 'cover' | 'contain';
  /** Pause when scrolled off-screen (grid tiles). */
  pauseOffscreen?: boolean;
};

export const GalleryMedia = forwardRef<HTMLElement, Props>(function GalleryMedia(
  { item, className = '', muted = true, autoPlay = true, priority = false, fit, pauseOffscreen = false },
  _ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const objectFit = (fit ?? item.fit ?? 'cover') === 'contain' ? 'object-contain' : 'object-cover';
  const cls = `gg-media w-full h-full ${objectFit} ${className}`;
  // React 18 doesn't type fetchpriority; pass the lowercase DOM attribute through.
  const prio = priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {};

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (!autoPlay) { v.pause(); return; }
    if (!pauseOffscreen || typeof IntersectionObserver === 'undefined') {
      v.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, [muted, autoPlay, pauseOffscreen, item.src]);

  if (item.kind === 'video') {
    return (
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        muted={muted}
        loop
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        aria-label={item.alt ?? item.title}
        className={cls}
        {...prio}
      />
    );
  }
  return (
    <img
      src={item.src}
      alt={item.alt ?? item.title}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={cls}
      {...prio}
    />
  );
});
