import { useEffect, useRef } from 'react';
import { MandalaEngine, MandalaOptions } from '../lib/mandala-engine';

interface UseMandalaReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  engine: React.MutableRefObject<MandalaEngine | null>;
}

export function useMandala(options: MandalaOptions = {}): UseMandalaReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<MandalaEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      engine.current = new MandalaEngine(canvas, options);
      engine.current.start();
    } catch (err) {
      console.warn('[MandalaEngine] failed to initialize:', err);
    }

    return () => {
      engine.current?.destroy();
      engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { canvasRef, engine };
}
