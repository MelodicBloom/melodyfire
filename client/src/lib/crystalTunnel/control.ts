// Shared control state between the main thread (React) and the render loop.
//
// When the page is cross-origin isolated (COOP same-origin + COEP), the state lives in
// a SharedArrayBuffer: the main thread writes, the worker reads every frame with no
// message round-trip, and the worker writes perf stats back. Integer slots use Atomics;
// float slots are plain Float32 stores (Atomics has no float ops; a torn read of a
// single 32-bit float cannot happen, and a one-frame-stale pointer/time is harmless).
// Without isolation the same struct is mirrored through postMessage.

export const LOOP_SECONDS = 40;

export enum I {
  Paused = 0,      // 1 = paused by user
  Visible = 1,     // 1 = on screen and tab visible
  Quality = 2,     // 0 = auto, 1 = low (AA 1), 2 = high (AA 2)
  Width = 3,       // CSS px
  Height = 4,      // CSS px
  Generation = 5,  // bumped on any change so the worker can wake from Atomics.wait
  SeekReq = 6,     // 1 = apply Float slot SeekTime
  FrameCount = 7,  // written by renderer
}
export enum F {
  Dpr = 0,         // capped device pixel ratio
  MaxScale = 1,    // ceiling for adaptive render scale
  PointerX = 2,    // 0..1, reserved for interactive variants
  PointerY = 3,
  SeekTime = 4,
  Time = 5,        // written by renderer: current loop time (s)
  Fps = 6,         // written by renderer
  Scale = 7,       // written by renderer: current adaptive render scale
}
const INTS = 8;
const FLOATS = 8;
export const SAB_BYTES = (INTS + FLOATS) * 4;

export interface ControlView {
  i: Int32Array;
  f: Float32Array;
}

export function createControl(sab?: SharedArrayBuffer): ControlView {
  const buf: ArrayBufferLike = sab ?? new ArrayBuffer(SAB_BYTES);
  return { i: new Int32Array(buf, 0, INTS), f: new Float32Array(buf, INTS * 4, FLOATS) };
}

export const canShareMemory = (): boolean =>
  typeof SharedArrayBuffer !== 'undefined' &&
  typeof Atomics !== 'undefined' &&
  (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated === true;

export function setInt(c: ControlView, slot: I, v: number) {
  Atomics.store(c.i, slot, v | 0);
  if (slot !== I.Generation) Atomics.add(c.i, I.Generation, 1);
}
export function getInt(c: ControlView, slot: I) {
  return Atomics.load(c.i, slot);
}
