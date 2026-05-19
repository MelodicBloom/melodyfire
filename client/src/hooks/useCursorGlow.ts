import { useEffect } from 'react';

/**
 * Creates a .cursor-glow div that follows the cursor with lerp animation.
 * Only active on non-touch devices. Cleans up on unmount.
 */
export function useCursorGlow(): void {
  useEffect(() => {
    // Skip on touch-primary devices
    if (window.matchMedia('(hover: none)').matches) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.opacity = '0';
    document.body.appendChild(glow);

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let visible = false;
    let raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        currentX = targetX;
        currentY = targetY;
        visible = true;
        glow.style.opacity = '1';
      }
    };

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);
      glow.style.transform = `translate(${currentX - 20}px, ${currentY - 20}px)`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      if (glow.parentNode) glow.parentNode.removeChild(glow);
    };
  }, []);
}
