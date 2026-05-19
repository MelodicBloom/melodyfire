// ================================================================
//  MandalaEngine — TypeScript Canvas Renderer
//  Draws rotating sacred geometry: petals, rings, core glow
//  Mouse/touch interaction: speed burst + glow pulse
// ================================================================

export interface MandalaOptions {
  petals?: number;
  rings?: number;
  speed?: number;
  palette?: string[];
  interactive?: boolean;
  glowIntensity?: number;
  autoRotate?: boolean;
}

const DEFAULT_PALETTE = ['#7c3aed', '#f43f5e', '#06b6d4', '#f59e0b'];

export class MandalaEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: Required<MandalaOptions>;
  private raf: number = 0;
  private rotation = 0;
  private hoverGlow = 0;
  private speedBurst = 0;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private resizeObs: ResizeObserver;
  private dpr = window.devicePixelRatio || 1;

  constructor(canvas: HTMLCanvasElement, options: MandalaOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.ctx = ctx;

    this.opts = {
      petals: options.petals ?? 8,
      rings: options.rings ?? 5,
      speed: options.speed ?? 0.3,
      palette: options.palette ?? DEFAULT_PALETTE,
      interactive: options.interactive ?? true,
      glowIntensity: options.glowIntensity ?? 0.7,
      autoRotate: options.autoRotate ?? true,
    };

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(canvas);
    this.resize();

    if (this.opts.interactive) {
      this.bindEvents();
    }
  }

  private resize() {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  private bindEvents() {
    const onMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / rect.width;
      this.mouseY = (e.clientY - rect.top) / rect.height;
      this.speedBurst = Math.min(this.speedBurst + 0.04, 1.5);
      this.hoverGlow = Math.min(this.hoverGlow + 0.08, 1);
    };
    const onTouch = (e: TouchEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const t = e.touches[0];
      this.mouseX = (t.clientX - rect.left) / rect.width;
      this.mouseY = (t.clientY - rect.top) / rect.height;
      this.speedBurst = Math.min(this.speedBurst + 0.06, 2);
      this.hoverGlow = Math.min(this.hoverGlow + 0.1, 1);
    };
    const onLeave = () => {
      this.speedBurst = 0;
    };

    this.canvas.addEventListener('mousemove', onMove);
    this.canvas.addEventListener('touchmove', onTouch, { passive: true });
    this.canvas.addEventListener('mouseleave', onLeave);
  }

  private draw() {
    const { petals, rings, speed, palette, glowIntensity } = this.opts;
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(cx, cy) * 0.92;

    this.ctx.clearRect(0, 0, w, h);

    // ---- Glow pulse decay ----
    this.hoverGlow *= 0.95;
    this.speedBurst *= 0.97;

    const effectiveSpeed = speed + this.speedBurst * speed * 2;
    if (this.opts.autoRotate) {
      this.rotation += (effectiveSpeed * Math.PI) / 180;
    }

    // ---- Background aura ----
    const glowR = maxR * (0.4 + this.hoverGlow * 0.25) * glowIntensity;
    const aura = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    aura.addColorStop(0, `rgba(124,58,237,${0.08 + this.hoverGlow * 0.12})`);
    aura.addColorStop(0.5, `rgba(244,63,94,${0.04 + this.hoverGlow * 0.06})`);
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = aura;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, glowR * 1.5, 0, Math.PI * 2);
    this.ctx.fill();

    // ---- Rings ----
    for (let r = 0; r < rings; r++) {
      const ringR = maxR * ((r + 1) / rings);
      const color = palette[r % palette.length];
      const alpha = 0.12 + (r / rings) * 0.08 + this.hoverGlow * 0.08;

      this.ctx.save();
      this.ctx.strokeStyle = this.hexToRgba(color, alpha);
      this.ctx.lineWidth = 1 + (r === rings - 1 ? 1 : 0);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      this.ctx.stroke();

      // Ring tick marks
      const ticks = petals * 2;
      for (let t = 0; t < ticks; t++) {
        const angle = (t / ticks) * Math.PI * 2 + this.rotation * (r % 2 === 0 ? 1 : -1) * 0.3;
        const x1 = cx + Math.cos(angle) * (ringR - 4);
        const y1 = cy + Math.sin(angle) * (ringR - 4);
        const x2 = cx + Math.cos(angle) * (ringR + 4);
        const y2 = cy + Math.sin(angle) * (ringR + 4);
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    // ---- Petals (outer layer) ----
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.rotation);

    for (let p = 0; p < petals; p++) {
      const angle = (p / petals) * Math.PI * 2;
      this.ctx.save();
      this.ctx.rotate(angle);

      const color = palette[p % palette.length];
      const petalLen = maxR * 0.78;
      const petalW = (maxR * 0.22) / petals * 2.4;

      const grad = this.ctx.createLinearGradient(0, 0, 0, petalLen);
      grad.addColorStop(0, this.hexToRgba(color, 0.5 + this.hoverGlow * 0.2));
      grad.addColorStop(0.5, this.hexToRgba(color, 0.18));
      grad.addColorStop(1, this.hexToRgba(color, 0.02));

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(petalW, petalLen * 0.3, petalW, petalLen * 0.7, 0, petalLen);
      this.ctx.bezierCurveTo(-petalW, petalLen * 0.7, -petalW, petalLen * 0.3, 0, 0);
      this.ctx.fill();
      this.ctx.restore();
    }
    this.ctx.restore();

    // ---- Inner petals (counter-rotate) ----
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(-this.rotation * 0.6);

    const innerPetals = petals * 2;
    for (let p = 0; p < innerPetals; p++) {
      const angle = (p / innerPetals) * Math.PI * 2;
      this.ctx.save();
      this.ctx.rotate(angle);

      const color = palette[(p + 1) % palette.length];
      const petalLen = maxR * 0.42;
      const petalW = (maxR * 0.12) / innerPetals * 3;

      const grad = this.ctx.createLinearGradient(0, 0, 0, petalLen);
      grad.addColorStop(0, this.hexToRgba(color, 0.4 + this.hoverGlow * 0.3));
      grad.addColorStop(1, this.hexToRgba(color, 0.01));

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(petalW, petalLen * 0.35, petalW, petalLen * 0.65, 0, petalLen);
      this.ctx.bezierCurveTo(-petalW, petalLen * 0.65, -petalW, petalLen * 0.35, 0, 0);
      this.ctx.fill();
      this.ctx.restore();
    }
    this.ctx.restore();

    // ---- Geometric star lines ----
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.rotation * 0.4);
    this.ctx.strokeStyle = this.hexToRgba(palette[2] ?? '#06b6d4', 0.15 + this.hoverGlow * 0.15);
    this.ctx.lineWidth = 0.5;

    for (let p = 0; p < petals; p++) {
      const a1 = (p / petals) * Math.PI * 2;
      const a2 = ((p + Math.floor(petals / 2)) / petals) * Math.PI * 2;
      const r1 = maxR * 0.6;
      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
      this.ctx.lineTo(Math.cos(a2) * r1, Math.sin(a2) * r1);
      this.ctx.stroke();
    }
    this.ctx.restore();

    // ---- Core glow ----
    const coreR = maxR * (0.12 + this.hoverGlow * 0.06);
    const coreGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
    coreGrad.addColorStop(0, `rgba(255,255,255,${0.55 + this.hoverGlow * 0.3})`);
    coreGrad.addColorStop(0.3, `rgba(124,58,237,${0.45 + this.hoverGlow * 0.25})`);
    coreGrad.addColorStop(0.7, `rgba(244,63,94,${0.2})`);
    coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    this.ctx.fillStyle = coreGrad;
    this.ctx.fill();

    // ---- Mouse-following parallax dot ----
    if (this.opts.interactive && this.hoverGlow > 0.05) {
      const dotX = cx + (this.mouseX - 0.5) * maxR * 0.3;
      const dotY = cy + (this.mouseY - 0.5) * maxR * 0.3;
      const dotGrad = this.ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 24);
      dotGrad.addColorStop(0, `rgba(6,182,212,${this.hoverGlow * 0.7})`);
      dotGrad.addColorStop(1, 'rgba(6,182,212,0)');
      this.ctx.beginPath();
      this.ctx.arc(dotX, dotY, 24, 0, Math.PI * 2);
      this.ctx.fillStyle = dotGrad;
      this.ctx.fill();
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  private tick = () => {
    this.draw();
    this.raf = requestAnimationFrame(this.tick);
  };

  start() {
    if (!this.raf) {
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  stop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  destroy() {
    this.stop();
    this.resizeObs.disconnect();
  }
}
