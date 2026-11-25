// Off-main-thread renderer: owns an OffscreenCanvas transferred from the page.
// Control state arrives via SharedArrayBuffer (cross-origin isolated) or postMessage.
import { CrystalRenderer } from './renderer';
import { ControlView, createControl, I, F, setInt } from './control';

export type ToWorker =
  | { type: 'init'; canvas: OffscreenCanvas; sab?: SharedArrayBuffer; ints: number[]; floats: number[] }
  | { type: 'ctl'; ints?: Record<number, number>; floats?: Record<number, number> }
  | { type: 'poke' }
  | { type: 'dispose' };

export type FromWorker =
  | { type: 'ready'; hdr: boolean; renderer: string; shared: boolean }
  | { type: 'first-frame' }
  | { type: 'stats'; fps: number; scale: number; time: number }
  | { type: 'error'; message: string }
  | { type: 'too-slow' };

interface Scope { postMessage(m: FromWorker): void; onmessage: ((e: MessageEvent<ToWorker>) => void) | null; close(): void }
const scope = globalThis as unknown as Scope;

let ctl: ControlView | null = null;
let r: CrystalRenderer | null = null;
let shared = false;
let statsTimer = 0;

scope.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'init') {
    shared = !!m.sab;
    ctl = createControl(m.sab);
    if (!shared) { m.ints.forEach((v, k) => (ctl!.i[k] = v)); m.floats.forEach((v, k) => (ctl!.f[k] = v)); }
    r = new CrystalRenderer(m.canvas, ctl, {
      onReady: (info) => scope.postMessage({ type: 'ready', ...info, shared }),
      onError: (message) => scope.postMessage({ type: 'error', message }),
      onFirstFrame: () => scope.postMessage({ type: 'first-frame' }),
      onTooSlow: () => scope.postMessage({ type: 'too-slow' }),
    });
    if (r.start() && !shared) {
      // Without shared memory the page cannot read stats directly; report them twice a second.
      statsTimer = setInterval(() => ctl && scope.postMessage({ type: 'stats', fps: ctl.f[F.Fps], scale: ctl.f[F.Scale], time: ctl.f[F.Time] }), 500) as unknown as number;
    }
  } else if (m.type === 'ctl' && ctl) {
    for (const [k, v] of Object.entries(m.ints ?? {})) setInt(ctl, Number(k) as I, v);
    for (const [k, v] of Object.entries(m.floats ?? {})) ctl.f[Number(k)] = v;
    r?.poke();
  } else if (m.type === 'poke') {
    r?.poke();
  } else if (m.type === 'dispose') {
    clearInterval(statsTimer); r?.dispose(); r = null; scope.close();
  }
};
