import { useEffect } from 'react';

/**
 * Scroll reveal system.
 *
 * Strategy:
 * 1. Content is VISIBLE by default (opacity:1, no transform) — no flash of hidden content.
 * 2. Once this hook runs, it adds .js-anim-ready to <html>, which via CSS hides
 *    un-revealed .reveal elements. This only happens AFTER JS loads.
 * 3. Elements already in viewport get .revealed immediately (no animation for above-fold).
 * 4. Off-screen elements animate in as they enter the viewport.
 *
 * Result: content is ALWAYS visible regardless of JS / observer state.
 */
export function useScrollReveal(): void {
  useEffect(() => {
    const html = document.documentElement;

    const run = () => {
      const els = document.querySelectorAll<HTMLElement>(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, [data-reveal]'
      );
      if (!els.length) return;

      // Mark as animation-ready ONLY AFTER we've pre-revealed in-viewport elements
      // so there's zero flash of invisible content
      const alreadyInViewport: HTMLElement[] = [];
      const toObserve: HTMLElement[] = [];

      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight + 50 && rect.bottom > -50;
        if (inViewport) {
          alreadyInViewport.push(el);
        } else {
          toObserve.push(el);
        }
      });

      // Pre-mark in-viewport elements as revealed before adding js-anim-ready
      alreadyInViewport.forEach((el) => el.classList.add('revealed'));

      // NOW enable the animation system — off-screen items will be hidden by CSS
      html.classList.add('js-anim-ready');

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
            if (delay) {
              setTimeout(() => el.classList.add('revealed'), delay);
            } else {
              el.classList.add('revealed');
            }
            io.unobserve(el);
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -10px 0px' }
      );

      toObserve.forEach((el) => io.observe(el));

      return () => {
        io.disconnect();
        html.classList.remove('js-anim-ready');
      };
    };

    // Run after paint so getBoundingClientRect is accurate
    const frame = requestAnimationFrame(() => {
      const cleanup = run();
      return cleanup;
    });

    return () => cancelAnimationFrame(frame);
  }, []);
}
