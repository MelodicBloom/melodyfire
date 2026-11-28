import { useEffect, useRef, useState } from 'react';
import abaloneStill from '@assets/img/shadergallery-abalone.png';

type ProofStatus = 'booting' | 'ready' | 'fallback';

type ShaderWorkerResponse =
  | { type: 'READY' }
  | { type: 'ERROR'; error: string };

const POINTER_STEP = 0.08;

function supportsWebGl(): boolean {
  const probe = document.createElement('canvas');
  return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
}

export function HovercraftShaderProof() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const [status, setStatus] = useState<ProofStatus>('booting');
  const [fallbackReason, setFallbackReason] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const forcedFallback = new URLSearchParams(window.location.search).get('shader') === 'fallback';
    const transferableCanvas = canvas as HTMLCanvasElement & {
      transferControlToOffscreen?: () => OffscreenCanvas;
    };

    if (forcedFallback || reducedMotion || !supportsWebGl() || !transferableCanvas.transferControlToOffscreen) {
      setFallbackReason(
        forcedFallback
          ? 'Fallback preview requested.'
          : reducedMotion
            ? 'Reduced motion is enabled.'
            : 'WebGL worker rendering is unavailable.',
      );
      setStatus('fallback');
      return;
    }

    let mounted = true;
    const worker = new Worker(new URL('../../workers/hovercraftShader.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    const sendSize = () => {
      const rect = frame.getBoundingClientRect();
      worker.postMessage({
        type: 'RESIZE',
        width: rect.width,
        height: rect.height,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    };

    worker.addEventListener('message', (event: MessageEvent<ShaderWorkerResponse>) => {
      if (!mounted) return;
      if (event.data.type === 'READY') setStatus('ready');
      if (event.data.type === 'ERROR') {
        setFallbackReason('The live shader could not start.');
        setStatus('fallback');
        worker.terminate();
        workerRef.current = null;
      }
    });

    const rect = frame.getBoundingClientRect();
    const offscreen = transferableCanvas.transferControlToOffscreen();
    worker.postMessage(
      {
        type: 'INIT',
        canvas: offscreen,
        width: rect.width,
        height: rect.height,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      },
      [offscreen],
    );

    const resizeObserver = new ResizeObserver(sendSize);
    resizeObserver.observe(frame);
    const onVisibilityChange = () => {
      worker.postMessage({ type: document.hidden ? 'PAUSE' : 'RESUME' });
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      mounted = false;
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const sendPointer = (x: number, y: number) => {
    const next = {
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    };
    pointerRef.current = next;
    workerRef.current?.postMessage({ type: 'POINTER', ...next });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    sendPointer(
      (event.clientX - rect.left) / Math.max(rect.width, 1),
      1 - (event.clientY - rect.top) / Math.max(rect.height, 1),
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    const next = { ...pointerRef.current };
    if (event.key === 'ArrowLeft') next.x -= POINTER_STEP;
    else if (event.key === 'ArrowRight') next.x += POINTER_STEP;
    else if (event.key === 'ArrowUp') next.y += POINTER_STEP;
    else if (event.key === 'ArrowDown') next.y -= POINTER_STEP;
    else return;
    event.preventDefault();
    sendPointer(next.x, next.y);
  };

  return (
    <div className="hovercraft-proof-frame" ref={frameRef}>
      {status !== 'fallback' ? (
        <canvas
          ref={canvasRef}
          className="hovercraft-proof-canvas"
          tabIndex={0}
          aria-label="Interactive spectral GLSL field. Move the pointer, touch, or use arrow keys to shift its center."
          aria-describedby="hovercraft-proof-help"
          onPointerMove={handlePointerMove}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <img
          className="hovercraft-proof-still"
          src={abaloneStill}
          alt="Static abalone shader specimen from Jennipher Troup's Shader Gallery"
        />
      )}

      <div className="hovercraft-proof-status" aria-live="polite">
        <span className={`hovercraft-status-dot is-${status}`} aria-hidden="true" />
        {status === 'booting' && 'Loading live WebGL specimen'}
        {status === 'ready' && 'Live WebGL · worker-owned · DPR ≤ 1.5'}
        {status === 'fallback' && `Static fallback · ${fallbackReason}`}
      </div>
      <p id="hovercraft-proof-help" className="hovercraft-proof-help">
        Pointer, touch, or arrow keys move the spectral center. Leave it idle and the field returns to a slow drift.
      </p>
    </div>
  );
}
