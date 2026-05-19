import { useEffect, useRef, CSSProperties } from 'react';
import { MandalaEngine, MandalaOptions } from '../lib/mandala-engine';

interface MandalaCanvasProps extends MandalaOptions {
  className?: string;
  style?: CSSProperties;
}

/**
 * React wrapper around MandalaEngine.
 * Uses IntersectionObserver to only start rendering when visible.
 */
export function MandalaCanvas({
  petals,
  rings,
  speed,
  interactive,
  palette,
  glowIntensity,
  autoRotate,
  className = '',
  style,
}: MandalaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MandalaEngine | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let started = false;

    const options: MandalaOptions = {
      petals,
      rings,
      speed,
      interactive,
      palette,
      glowIntensity,
      autoRotate,
    };

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !started) {
          started = true;
          try {
            engineRef.current = new MandalaEngine(canvas, options);
            engineRef.current.start();
          } catch (err) {
            console.warn('[MandalaCanvas] init error:', err);
          }
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(wrap);

    return () => {
      io.disconnect();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`mandala-canvas-wrap ${interactive ? 'interactive' : ''} ${className}`}
      style={style}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
