// Crystal Tunnel v2 — two-pass WebGL2 renderer (Shadertoy Buffer A -> Image).
// Runs unchanged on the main thread (HTMLCanvasElement) or in a worker (OffscreenCanvas).
//   Pass 1: scene.glsl -> RGBA16F HDR target (alpha = circle of confusion), mipmapped.
//   Pass 2: post.glsl  -> DOF (mip taps), bloom, ACES tonemap, grain -> default framebuffer.
// Time is wrapped to the 40 s loop so the animation repeats exactly.
import sceneSrc from './shaders/scene.glsl?raw';
import postSrc from './shaders/post.glsl?raw';
import { ControlView, F, I, LOOP_SECONDS, getInt } from './control';

type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;

const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const header = (defs: string) => `#version 300 es
precision highp float; precision highp int;
${defs}
uniform vec3 iResolution; uniform float iTime; uniform float iTimeDelta; uniform int iFrame;
uniform sampler2D iChannel0;
out vec4 outColor;
`;
const FOOTER = `\nvoid main(){ vec4 c; mainImage(c, gl_FragCoord.xy); outColor = c; }`;

const QUALITY_DEFS: Record<1 | 2, string> = { 1: '#define AA 1\n#define LOWQ\n', 2: '#define AA 2\n' };

interface Prog { p: WebGLProgram; res: WebGLUniformLocation | null; t: WebGLUniformLocation | null; dt: WebGLUniformLocation | null; fr: WebGLUniformLocation | null; ch: WebGLUniformLocation | null }

export interface RendererEvents {
  onReady(info: { hdr: boolean; renderer: string }): void;
  onError(msg: string): void;
  onFirstFrame(): void;
  /** Sustained <20 fps even at the minimum render scale: host should fall back to video. */
  onTooSlow?(): void;
}

export class CrystalRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private progs: Partial<Record<1 | 2, Prog>> = {};
  private post: Prog | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private tex: WebGLTexture | null = null;
  private fbo: WebGLFramebuffer | null = null;
  private W = 0; private H = 0;
  private hdr = true;
  private raf = 0;
  private running = false;
  private lost = false;
  private t = 0; private last = 0; private frame = 0;
  private scale: number;
  private ftAcc = 0; private ftN = 0; private fpsAcc = 0; private fpsN = 0;
  private settle = 0;
  private firstFrameSent = false;
  private slowStrikes = 0;

  constructor(private canvas: AnyCanvas, private ctl: ControlView, private ev: RendererEvents) {
    this.scale = ctl.f[F.MaxScale] || 0.75;
    canvas.addEventListener('webglcontextlost', this.onLost as EventListener, false);
    canvas.addEventListener('webglcontextrestored', this.onRestored as EventListener, false);
  }

  start(): boolean {
    if (!this.init()) return false;
    this.running = true;
    this.last = performance.now();
    this.schedule();
    return true;
  }

  dispose() {
    this.running = false;
    this.cancel();
    this.canvas.removeEventListener('webglcontextlost', this.onLost as EventListener);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored as EventListener);
    const lose = this.gl?.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    this.gl = null;
  }

  /** Re-check control state; called by the host when it knows something changed. */
  poke() { if (this.running && !this.raf) this.schedule(); }

  // ---------------------------------------------------------------- setup
  private init(): boolean {
    const gl = this.canvas.getContext('webgl2', {
      antialias: false, alpha: false, depth: false, stencil: false,
      premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'high-performance',
    }) as WebGL2RenderingContext | null;
    if (!gl) { this.ev.onError('WebGL2 unavailable'); return false; }
    this.gl = gl;
    this.hdr = !!gl.getExtension('EXT_color_buffer_float') || !!gl.getExtension('EXT_color_buffer_half_float');
    gl.getExtension('OES_texture_float_linear');
    try {
      this.post = this.compile(header('') + postSrc + FOOTER);
      this.sceneFor(this.qualityLevel());
    } catch (e) {
      this.ev.onError(String((e as Error).message || e));
      return false;
    }
    const vb = gl.createBuffer();
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.W = this.H = 0;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
    this.ev.onReady({ hdr: this.hdr, renderer });
    return true;
  }

  private compile(fsrc: string): Prog {
    const gl = this.gl!;
    const mk = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS) && !gl.isContextLost())
        throw new Error('shader compile failed: ' + gl.getShaderInfoLog(sh));
      return sh;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fsrc));
    gl.bindAttribLocation(p, 0, 'p');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost())
      throw new Error('program link failed: ' + gl.getProgramInfoLog(p));
    const u = (n: string) => gl.getUniformLocation(p, n);
    return { p, res: u('iResolution'), t: u('iTime'), dt: u('iTimeDelta'), fr: u('iFrame'), ch: u('iChannel0') };
  }

  private qualityLevel(): 1 | 2 { return getInt(this.ctl, I.Quality) === 2 ? 2 : 1; }

  private sceneFor(q: 1 | 2): Prog {
    if (!this.progs[q]) this.progs[q] = this.compile(header(QUALITY_DEFS[q]) + sceneSrc + FOOTER);
    return this.progs[q]!;
  }

  private ensureTarget(): boolean {
    const gl = this.gl!;
    const cssW = Math.max(1, getInt(this.ctl, I.Width));
    const cssH = Math.max(1, getInt(this.ctl, I.Height));
    const s = this.scale * (this.ctl.f[F.Dpr] || 1);
    const w = Math.max(16, Math.round(cssW * s)), h = Math.max(16, Math.round(cssH * s));
    if (w === this.W && h === this.H && this.tex) return true;
    this.W = w; this.H = h;
    this.canvas.width = w; this.canvas.height = h;
    if (this.tex) { gl.deleteTexture(this.tex); gl.deleteFramebuffer(this.fbo); }
    const levels = Math.floor(Math.log2(Math.max(w, h))) + 1;
    const mkTarget = (fmt: number) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texStorage2D(gl.TEXTURE_2D, levels, fmt, w, h);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      if (!ok) { gl.deleteTexture(tex); gl.deleteFramebuffer(fbo); return null; }
      return { tex, fbo };
    };
    // Half-float HDR when renderable, otherwise LDR RGBA8 (bloom/highlights clip but it still renders).
    const tgt = (this.hdr && mkTarget(gl.RGBA16F)) || mkTarget(gl.RGBA8);
    if (!tgt) { this.ev.onError('no renderable target'); return false; }
    this.tex = tgt.tex; this.fbo = tgt.fbo;
    return true;
  }

  // ---------------------------------------------------------------- loop
  private schedule() {
    const g = globalThis as unknown as { requestAnimationFrame?: (cb: (t: number) => void) => number };
    this.raf = g.requestAnimationFrame ? g.requestAnimationFrame(this.tick) : (setTimeout(() => this.tick(performance.now()), 16) as unknown as number);
  }
  private cancel() {
    const g = globalThis as unknown as { cancelAnimationFrame?: (id: number) => void };
    if (this.raf) { g.cancelAnimationFrame ? g.cancelAnimationFrame(this.raf) : clearTimeout(this.raf); }
    this.raf = 0;
  }

  private tick = (now: number) => {
    this.raf = 0;
    if (!this.running || this.lost || !this.gl) return;
    const c = this.ctl;
    const dtRaw = (now - this.last) / 1000; this.last = now;
    const dt = Math.min(dtRaw, 0.1);
    if (getInt(c, I.SeekReq)) { this.t = c.f[F.SeekTime] % LOOP_SECONDS; Atomics.store(c.i, I.SeekReq, 0); }
    const visible = getInt(c, I.Visible) === 1;
    if (!visible) { this.idle(); return; }          // offscreen / hidden tab: stop drawing entirely
    const paused = getInt(c, I.Paused) === 1;
    if (!paused) this.t = (this.t + dt) % LOOP_SECONDS;

    if (!this.ensureTarget()) return;
    const gl = this.gl;
    let scene: Prog;
    try { scene = this.sceneFor(this.qualityLevel()); } catch (e) { this.ev.onError(String(e)); return; }

    gl.bindVertexArray(this.vao);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.W, this.H);
    this.draw(scene, dt);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.W, this.H);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    this.draw(this.post!, dt);
    this.frame++;
    Atomics.store(c.i, I.FrameCount, this.frame);
    c.f[F.Time] = this.t;
    if (!this.firstFrameSent) { this.firstFrameSent = true; this.ev.onFirstFrame(); }

    if (!paused) this.adapt(dtRaw);
    this.schedule();
  };

  private draw(pr: Prog, dt: number) {
    const gl = this.gl!;
    gl.useProgram(pr.p);
    gl.uniform3f(pr.res, this.W, this.H, 1);
    gl.uniform1f(pr.t, this.t);
    gl.uniform1f(pr.dt, dt);
    gl.uniform1i(pr.fr, this.frame);
    gl.uniform1i(pr.ch, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /** Adaptive resolution: hold ~45-60 fps by scaling the render target from frame timing. */
  private adapt(dtRaw: number) {
    const c = this.ctl;
    this.fpsAcc += dtRaw; this.fpsN++;
    if (this.fpsAcc >= 0.5) { c.f[F.Fps] = this.fpsN / this.fpsAcc; this.fpsAcc = 0; this.fpsN = 0; }
    if (this.settle > 0) { this.settle--; return; }
    this.ftAcc += Math.min(dtRaw, 0.25); this.ftN++;   // clamp single stalls (GC, compile) so they can't dominate
    if (this.ftN < (this.ftAcc > 1.5 ? 4 : 20)) return; // very slow GPUs: react after a few frames, not 20
    const avg = this.ftAcc / this.ftN; this.ftAcc = 0; this.ftN = 0;
    const max = c.f[F.MaxScale] || 1, min = 0.3;
    let next = this.scale;
    if (avg > 1 / 40) next = Math.max(min, this.scale * Math.sqrt((1 / 50) / avg)); // too slow: shrink proportionally
    else if (avg < 1 / 57) next = Math.min(max, this.scale * 1.08);                   // vsync-bound: grow gently
    if (this.scale <= min + 1e-3 && avg > 1 / 20) {
      if (++this.slowStrikes >= 3) { this.slowStrikes = -1e9; this.ev.onTooSlow?.(); }
    } else if (this.slowStrikes > 0) this.slowStrikes = 0;
    if (Math.abs(next - this.scale) > 0.02) { this.scale = next; this.settle = 10; }
    c.f[F.Scale] = this.scale;
  }

  private idle() {
    // Poll cheaply while hidden; the host also calls poke() when visibility returns.
    setTimeout(() => { if (this.running && !this.raf) { this.last = performance.now(); this.settle = 5; this.schedule(); } }, 250);
  }

  private onLost = (e: Event) => {
    e.preventDefault();               // allow restoration
    this.lost = true; this.cancel();
  };
  private onRestored = () => {
    this.lost = false; this.progs = {}; this.post = null; this.tex = null; this.fbo = null;
    if (this.init()) { this.last = performance.now(); this.schedule(); }
  };
}
