// <CrystalTunnel/> — Crystal Tunnel v2 rendered live on the GPU.
//
// Path selection (best first):
//   1. Worker + OffscreenCanvas (rendering off the main thread). Control state shared via
//      SharedArrayBuffer + Atomics when the page is crossOriginIsolated, else postMessage.
//   2. Main-thread WebGL2 (no OffscreenCanvas support, e.g. older Safari).
//   3. Autoplay muted loop video (no WebGL2 / shader compile failure).
//   4. Static poster (prefers-reduced-motion, or the video also fails).
import { useCallback, useEffect, useRef, useState } from 'react';
import posterUrl from '../assets/crystal-tunnel/crystal-tunnel-poster.jpg';
import videoUrl from '../assets/crystal-tunnel/crystal-tunnel-loop.mp4';
import { ControlView, createControl, canShareMemory, F, I, SAB_BYTES, setInt, getInt } from '../lib/crystalTunnel/control';
import type { FromWorker, ToWorker } from '../lib/crystalTunnel/crystalTunnel.worker';

type Mode = 'gpu' | 'video' | 'poster';
export type CrystalQuality = 'auto' | 'low' | 'high';

export interface CrystalTunnelStats {
  path: 'worker+sab' | 'worker+postMessage' | 'main-thread' | 'video' | 'poster';
  fps: number; scale: number; time: number; renderer?: string; hdr?: boolean; isolated: boolean;
}

interface Props {
  className?: string;
  quality?: CrystalQuality;
  paused?: boolean;
  /** Upper bound on devicePixelRatio used for the canvas (default 1.5, 1.0 on touch devices). */
  maxDpr?: number;
  onStats?: (s: CrystalTunnelStats) => void;
  label?: string;
}

const QMAP: Record<CrystalQuality, number> = { auto: 0, low: 1, high: 2 };

function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch { return false; }
}

export function CrystalTunnel({ className = '', quality = 'auto', paused = false, maxDpr, onStats, label = 'Crystal Tunnel — live raymarched GLSL shader' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('gpu');
  const [drawn, setDrawn] = useState(false);
  const ctlRef = useRef<ControlView | null>(null);
  const sendRef = useRef<(ints?: Record<number, number>, floats?: Record<number, number>) => void>(() => {});
  const statsRef = useRef<CrystalTunnelStats>({ path: 'poster', fps: 0, scale: 0, time: 0, isolated: false });
  const onStatsRef = useRef(onStats); onStatsRef.current = onStats;

  const fail = useCallback((why: string) => {
    console.warn('[CrystalTunnel] falling back to video:', why);
    statsRef.current.path = 'video';
    setMode((m) => (m === 'gpu' ? 'video' : m));
  }, []);

  // ---- mount renderer --------------------------------------------------------------
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setMode('poster'); statsRef.current.path = 'poster'; return; }
    if (!hasWebGL2()) { setMode('video'); statsRef.current.path = 'video'; return; }

    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr ?? (coarse ? 1.0 : 1.5));
    const maxScale = coarse ? 0.6 : 0.75;
    const isolated = canShareMemory();
    // ?gpu=force keeps the live renderer even on very slow GPUs (debug / headless checks).
    const allowSlow = new URLSearchParams(location.search).get('gpu') === 'force';
    statsRef.current.isolated = isolated;

    // The canvas is created imperatively: transferControlToOffscreen() may only be called
    // once per element, and React StrictMode mounts effects twice in development.
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full block';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(canvas);
    const rect = host.getBoundingClientRect();

    const sab = isolated ? new SharedArrayBuffer(SAB_BYTES) : undefined;
    const ctl = createControl(sab);
    ctlRef.current = ctl;
    ctl.i[I.Width] = Math.round(rect.width); ctl.i[I.Height] = Math.round(rect.height);
    ctl.i[I.Visible] = 0; ctl.i[I.Paused] = paused ? 1 : 0; ctl.i[I.Quality] = QMAP[quality];
    ctl.f[F.Dpr] = dpr; ctl.f[F.MaxScale] = maxScale;

    let worker: Worker | null = null;
    let disposeMain: (() => void) | null = null;
    let disposed = false;

    const useWorker = 'transferControlToOffscreen' in canvas && typeof Worker !== 'undefined';
    if (useWorker) {
      try {
        worker = new Worker(new URL('../lib/crystalTunnel/crystalTunnel.worker.ts', import.meta.url), { type: 'module' });
        const off = canvas.transferControlToOffscreen();
        statsRef.current.path = sab ? 'worker+sab' : 'worker+postMessage';
        worker.onmessage = (e: MessageEvent<FromWorker>) => {
          const m = e.data;
          if (m.type === 'ready') { statsRef.current.renderer = m.renderer; statsRef.current.hdr = m.hdr; }
          else if (m.type === 'first-frame') setDrawn(true);
          else if (m.type === 'stats') Object.assign(statsRef.current, { fps: m.fps, scale: m.scale, time: m.time });
          else if (m.type === 'error') fail(m.message);
          else if (m.type === 'too-slow' && !allowSlow) { fail('GPU too slow (<20 fps at minimum scale)'); worker?.postMessage({ type: 'dispose' } satisfies ToWorker); }
        };
        worker.onerror = (e) => fail(e.message || 'worker error');
        const init: ToWorker = { type: 'init', canvas: off, sab, ints: Array.from(ctl.i), floats: Array.from(ctl.f) };
        worker.postMessage(init, [off]);
        sendRef.current = sab
          ? () => worker?.postMessage({ type: 'poke' } satisfies ToWorker)   // memory already written; just wake the loop
          : (ints, floats) => worker?.postMessage({ type: 'ctl', ints, floats } satisfies ToWorker);
      } catch (err) {
        worker?.terminate(); worker = null;
        fail(String(err));
      }
    } else {
      statsRef.current.path = 'main-thread';
      import('../lib/crystalTunnel/renderer').then(({ CrystalRenderer }) => {
        if (disposed) return;
        const r = new CrystalRenderer(canvas, ctl, {
          onReady: (info) => { statsRef.current.renderer = info.renderer; statsRef.current.hdr = info.hdr; },
          onError: fail,
          onFirstFrame: () => setDrawn(true),
          onTooSlow: () => { if (!allowSlow) { fail('GPU too slow'); r.dispose(); } },
        });
        if (r.start()) { disposeMain = () => r.dispose(); sendRef.current = () => r.poke(); }
      }).catch((e) => fail(String(e)));
    }

    // Writes go straight into the (possibly shared) control block; the worker is told
    // via postMessage only when memory is not shared.
    const write = (ints?: Record<number, number>, floats?: Record<number, number>) => {
      for (const [k, v] of Object.entries(ints ?? {})) setInt(ctl, Number(k) as I, v);
      for (const [k, v] of Object.entries(floats ?? {})) ctl.f[Number(k)] = v;
      sendRef.current(ints, floats);
    };

    let onScreen = false;
    const syncVisible = () => write({ [I.Visible]: onScreen && !document.hidden ? 1 : 0 });
    const io = new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; syncVisible(); }, { rootMargin: '100px' });
    io.observe(host);
    document.addEventListener('visibilitychange', syncVisible);
    const ro = new ResizeObserver(([en]) => {
      const { width, height } = en.contentRect;
      write({ [I.Width]: Math.round(width), [I.Height]: Math.round(height) });
    });
    ro.observe(host);
    const onPointer = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      ctl.f[F.PointerX] = (e.clientX - b.left) / b.width; ctl.f[F.PointerY] = (e.clientY - b.top) / b.height;
      if (!sab) sendRef.current(undefined, { [F.PointerX]: ctl.f[F.PointerX], [F.PointerY]: ctl.f[F.PointerY] });
    };
    host.addEventListener('pointermove', onPointer, { passive: true });

    const statsTimer = window.setInterval(() => {
      if (sab) Object.assign(statsRef.current, { fps: ctl.f[F.Fps], scale: ctl.f[F.Scale], time: ctl.f[F.Time] });
      else if (!worker) Object.assign(statsRef.current, { fps: ctl.f[F.Fps], scale: ctl.f[F.Scale], time: ctl.f[F.Time] });
      onStatsRef.current?.({ ...statsRef.current });
      (window as unknown as { __crystalTunnel?: CrystalTunnelStats }).__crystalTunnel = { ...statsRef.current };
    }, 500);

    return () => {
      disposed = true;
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', syncVisible);
      host.removeEventListener('pointermove', onPointer);
      clearInterval(statsTimer);
      if (worker) { worker.postMessage({ type: 'dispose' } satisfies ToWorker); setTimeout(() => worker?.terminate(), 200); }
      disposeMain?.();
      canvas.remove();
      ctlRef.current = null;
      sendRef.current = () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fail, maxDpr]);

  // ---- live prop updates ---------------------------------------------------------------
  useEffect(() => {
    const ctl = ctlRef.current; if (!ctl) return;
    if (getInt(ctl, I.Quality) !== QMAP[quality]) { setInt(ctl, I.Quality, QMAP[quality]); sendRef.current({ [I.Quality]: QMAP[quality] }); }
  }, [quality]);
  useEffect(() => {
    const ctl = ctlRef.current; if (!ctl) return;
    setInt(ctl, I.Paused, paused ? 1 : 0); sendRef.current({ [I.Paused]: paused ? 1 : 0 });
  }, [paused]);

  return (
    <div ref={hostRef} role="img" aria-label={label} className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative '}overflow-hidden bg-black ${className}`}>
      {mode === 'gpu' && (
        <img src={posterUrl} alt="" aria-hidden="true" decoding="async"
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${drawn ? 'opacity-0' : 'opacity-100'}`} />
      )}
      {mode === 'video' && (
        <video src={videoUrl} poster={posterUrl} autoPlay muted loop playsInline preload="metadata"
          onError={() => setMode('poster')}
          className="absolute inset-0 w-full h-full object-cover" />
      )}
      {mode === 'poster' && (
        <img src={posterUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  );
}

export default CrystalTunnel;
