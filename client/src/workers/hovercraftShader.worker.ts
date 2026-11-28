// Reused from Jennipher Troup's Shader Gallery spectral.mid.frag and
// glsl-renderer.worker.ts. This route integrates the existing specimen;
// it does not introduce a new shader family.

type InitMessage = {
  type: 'INIT';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  pixelRatio: number;
};

type WorkerMessage =
  | InitMessage
  | { type: 'POINTER'; x: number; y: number }
  | { type: 'RESIZE'; width: number; height: number; pixelRatio: number }
  | { type: 'PAUSE' | 'RESUME' };

type WorkerResponse =
  | { type: 'READY' }
  | { type: 'ERROR'; error: string };

type WorkerScope = {
  postMessage(message: WorkerResponse): void;
  addEventListener(type: 'message', listener: (event: MessageEvent<WorkerMessage>) => void): void;
};

const workerScope = globalThis as unknown as WorkerScope;

const VERTEX_SOURCE = `
attribute vec2 aPosition;
void main(void) {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SOURCE = `
#ifdef GL_ES
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
    #define HIGHP highp
  #else
    precision mediump float;
    precision mediump int;
    #define HIGHP mediump
  #endif
#else
  #define HIGHP
#endif

#define MELODYFIRE_TAU 6.283185307179586

uniform HIGHP float uTime;
uniform HIGHP vec2 uResolution;
uniform HIGHP vec2 uPointer;
uniform HIGHP float uIntensity;
uniform sampler2D uNoiseLut;

HIGHP vec2 melodyUv(void) {
  HIGHP vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
  uv.x *= uResolution.x / max(uResolution.y, 1.0);
  return uv;
}

HIGHP float lutNoise(HIGHP vec2 uv) {
  return texture2D(uNoiseLut, fract(uv)).r;
}

HIGHP float valueNoise(HIGHP vec2 p) {
  HIGHP vec2 i = floor(p);
  HIGHP vec2 f = fract(p);
  HIGHP vec2 u = f * f * (3.0 - 2.0 * f);
  HIGHP float a = lutNoise((i + vec2(0.0, 0.0)) / 256.0);
  HIGHP float b = lutNoise((i + vec2(1.0, 0.0)) / 256.0);
  HIGHP float c = lutNoise((i + vec2(0.0, 1.0)) / 256.0);
  HIGHP float d = lutNoise((i + vec2(1.0, 1.0)) / 256.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

HIGHP float fbm2(HIGHP vec2 p) {
  HIGHP float v = 0.0;
  HIGHP float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * valueNoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

HIGHP float bayer8(HIGHP vec2 fragCoord) {
  HIGHP vec2 p = mod(floor(fragCoord), 8.0);
  HIGHP float x = p.x;
  HIGHP float y = p.y;
  HIGHP float v = 0.0;
  v += mod(x, 2.0) * 32.0;
  v += mod(y, 2.0) * 16.0;
  v += mod(floor(x / 2.0), 2.0) * 8.0;
  v += mod(floor(y / 2.0), 2.0) * 4.0;
  v += mod(floor(x / 4.0), 2.0) * 2.0;
  v += mod(floor(y / 4.0), 2.0);
  return (v / 64.0) - 0.5;
}

HIGHP vec3 applyDither(HIGHP vec3 color) {
  HIGHP float n = bayer8(gl_FragCoord.xy) / 255.0;
  return color + vec3(n);
}

HIGHP vec3 approx3(HIGHP float x) {
  HIGHP vec3 phase = vec3(0.0, 0.35, 0.68);
  return 0.55 + 0.45 * cos(MELODYFIRE_TAU * (x + phase));
}

void main(void) {
  HIGHP vec2 uv = melodyUv();
  HIGHP vec2 center = vec2(0.62, 0.48) + (uPointer - 0.5) * 0.12;
  HIGHP vec2 ray = uv - center;
  HIGHP float dist = length(ray);
  HIGHP float angle = atan(ray.y, ray.x);
  HIGHP float grain = fbm2(uv * 4.0 + uTime * 0.035);
  HIGHP float beams = pow(abs(sin(angle * 8.0 + grain * 2.4 + uTime * 0.28)), 18.0);
  HIGHP float prism = smoothstep(0.88, 0.05, dist) * (0.28 + beams * 0.72);
  HIGHP float split = dist * 1.8 + grain * 0.18 + uTime * 0.03;
  HIGHP vec3 color = approx3(split) * prism;
  color += approx3(split + 0.22) * beams * 0.22;
  color *= 0.58 + uIntensity * 0.32;
  color = applyDither(color);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

type GL = WebGLRenderingContext | WebGL2RenderingContext;

let canvas: OffscreenCanvas | null = null;
let gl: GL | null = null;
let program: WebGLProgram | null = null;
let frameId = 0;
let running = false;
let width = 1;
let height = 1;
let pixelRatio = 1;
let startTime = 0;
let lastInputAt = 0;
let pointerX = 0.5;
let pointerY = 0.5;
let targetX = 0.5;
let targetY = 0.5;
let timeLocation: WebGLUniformLocation | null = null;
let resolutionLocation: WebGLUniformLocation | null = null;
let pointerLocation: WebGLUniformLocation | null = null;
let intensityLocation: WebGLUniformLocation | null = null;

function createShader(context: GL, type: number, source: string): WebGLShader {
  const shader = context.createShader(type);
  if (!shader) throw new Error('Unable to create shader');
  context.shaderSource(shader, source);
  context.compileShader(shader);
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    const error = context.getShaderInfoLog(shader) || 'Unknown shader compile error';
    context.deleteShader(shader);
    throw new Error(error);
  }
  return shader;
}

function createProgram(context: GL): WebGLProgram {
  const vertex = createShader(context, context.VERTEX_SHADER, VERTEX_SOURCE);
  const fragment = createShader(context, context.FRAGMENT_SHADER, FRAGMENT_SOURCE);
  const nextProgram = context.createProgram();
  if (!nextProgram) throw new Error('Unable to create WebGL program');
  context.attachShader(nextProgram, vertex);
  context.attachShader(nextProgram, fragment);
  context.linkProgram(nextProgram);
  context.deleteShader(vertex);
  context.deleteShader(fragment);
  if (!context.getProgramParameter(nextProgram, context.LINK_STATUS)) {
    const error = context.getProgramInfoLog(nextProgram) || 'Unknown program link error';
    context.deleteProgram(nextProgram);
    throw new Error(error);
  }
  return nextProgram;
}

function createNoiseTexture(context: GL): void {
  const texture = context.createTexture();
  if (!texture) throw new Error('Unable to create noise texture');
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const mixed = (x * 37 + y * 61 + 303) & 255;
      pixels[index] = mixed;
      pixels[index + 1] = (mixed * 7 + 31) & 255;
      pixels[index + 2] = (mixed * 13 + 73) & 255;
      pixels[index + 3] = 255;
    }
  }
  context.activeTexture(context.TEXTURE0);
  context.bindTexture(context.TEXTURE_2D, texture);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.REPEAT);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.REPEAT);
  context.texImage2D(
    context.TEXTURE_2D,
    0,
    context.RGBA,
    size,
    size,
    0,
    context.RGBA,
    context.UNSIGNED_BYTE,
    pixels,
  );
}

function resize(nextWidth: number, nextHeight: number, nextPixelRatio: number): void {
  width = Math.max(1, Math.floor(nextWidth));
  height = Math.max(1, Math.floor(nextHeight));
  pixelRatio = Math.min(Math.max(nextPixelRatio, 1), 1.5);
  if (canvas) {
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
  }
}

function draw(now: number): void {
  if (!running || !gl || !program) return;

  const elapsed = (now - startTime) / 1000;
  const isIdle = now - lastInputAt > 1400;
  const idleX = 0.5 + Math.sin(elapsed * 0.23) * 0.12;
  const idleY = 0.5 + Math.cos(elapsed * 0.19) * 0.08;
  const nextX = isIdle ? idleX : targetX;
  const nextY = isIdle ? idleY : targetY;
  pointerX += (nextX - pointerX) * 0.075;
  pointerY += (nextY - pointerY) * 0.075;

  gl.viewport(0, 0, Math.floor(width * pixelRatio), Math.floor(height * pixelRatio));
  gl.useProgram(program);
  gl.uniform1f(timeLocation, elapsed);
  gl.uniform2f(resolutionLocation, width * pixelRatio, height * pixelRatio);
  gl.uniform2f(pointerLocation, pointerX, pointerY);
  gl.uniform1f(intensityLocation, 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  frameId = requestAnimationFrame(draw);
}

function initialize(message: InitMessage): void {
  canvas = message.canvas;
  resize(message.width, message.height, message.pixelRatio);
  gl = (canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false })
    || canvas.getContext('webgl', { alpha: false, antialias: false, depth: false })) as GL | null;
  if (!gl) throw new Error('WebGL context unavailable');

  program = createProgram(gl);
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  if (!buffer) throw new Error('Unable to create geometry buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  createNoiseTexture(gl);
  const sampler = gl.getUniformLocation(program, 'uNoiseLut');
  gl.uniform1i(sampler, 0);
  timeLocation = gl.getUniformLocation(program, 'uTime');
  resolutionLocation = gl.getUniformLocation(program, 'uResolution');
  pointerLocation = gl.getUniformLocation(program, 'uPointer');
  intensityLocation = gl.getUniformLocation(program, 'uIntensity');

  startTime = performance.now();
  running = true;
  draw(startTime);
  workerScope.postMessage({ type: 'READY' });
}

workerScope.addEventListener('message', (event) => {
  try {
    const message = event.data;
    if (message.type === 'INIT') initialize(message);
    if (message.type === 'POINTER') {
      targetX = message.x;
      targetY = message.y;
      lastInputAt = performance.now();
    }
    if (message.type === 'RESIZE') resize(message.width, message.height, message.pixelRatio);
    if (message.type === 'PAUSE') {
      running = false;
      cancelAnimationFrame(frameId);
    }
    if (message.type === 'RESUME' && !running) {
      running = true;
      frameId = requestAnimationFrame(draw);
    }
  } catch (error) {
    workerScope.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown WebGL worker error',
    });
  }
});

export {};
