"use client";

import { useEffect, useRef, useState } from "react";

// Hero artwork for the engineering blog: five noisy slabs drawn with WebGL, then
// resampled into a grid of text glyphs. Plain WebGL, same scene, shaders and
// glyph ramp as the original canvas; the WebGL canvas itself stays invisible.

export type ArtworkConfig = {
  scene: { position: [number, number, number]; rotation: [number, number, number] };
  shader: { distort: number; distortSpeed: number; noiseScale: number; noiseSpeed: number; noiseWeight: number };
};

export const DEFAULT_ARTWORK: ArtworkConfig = {
  scene: { position: [-8, -20, 0], rotation: [0.5, 2.45, 0] },
  shader: { distort: 0.2, distortSpeed: 2, noiseScale: 18, noiseSpeed: 0.12, noiseWeight: 2 },
};

const LIGHTNESS = [0.56, 0.74, 0.24, 0.02, 0.72];
const GLYPHS = " .,:;-=+*CRM#%@".split("");
const FG = "#CFD4DC";

const VERT = `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float distort;
uniform float distortSpeed;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i); float b = hash(i + vec2(1.0, 0.0)); float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
void main() {
  vUv = uv;
  float updateTime = time / 50.0 * distortSpeed;
  float noiseValue = noise(position.xy / 2.0 + updateTime * 5.0);
  vec3 distortedPosition = position * (noiseValue * pow(distort, 2.0) + 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(distortedPosition, 1.0);
}`;

const FRAG = `
precision highp float;
uniform float time;
uniform float lightness;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float noiseWeight;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i); float b = hash(i + vec2(1.0, 0.0)); float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
void main() {
  vec2 uv = vUv;
  vec2 noiseCoord = uv * noiseScale + time * noiseSpeed;
  float noiseValue = noise(noiseCoord);
  float finalValue = lightness + (noiseValue - 0.5) * noiseWeight;
  finalValue = clamp(finalValue, 0.0, 1.0);
  gl_FragColor = vec4(vec3(finalValue), 1.0);
}`;

// ---------- column-major 4x4 matrices ----------
type M4 = Float32Array;
const ident = (): M4 => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
function mul(a: M4, b: M4): M4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}
const translate = (x: number, y: number, z: number): M4 => {
  const m = ident();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
};
const scale = (s: number): M4 => {
  const m = ident();
  m[0] = m[5] = m[10] = s;
  return m;
};
function rotXYZ([x, y, z]: [number, number, number]): M4 {
  const cx = Math.cos(x), sx = Math.sin(x), cy = Math.cos(y), sy = Math.sin(y), cz = Math.cos(z), sz = Math.sin(z);
  const rx = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
  const ry = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]);
  const rz = new Float32Array([cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  return mul(mul(rx, ry), rz);
}
function perspective(fovDeg: number, aspect: number, near: number, far: number): M4 {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

// Box with one segment per side, faces and uvs laid out like the usual box geometry helper.
function boxGeometry(width: number, height: number, depth: number) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const size = { x: width, y: height, z: depth };
  const plane = (u: "x" | "y" | "z", v: "x" | "y" | "z", w: "x" | "y" | "z", udir: number, vdir: number, pw: number, ph: number, pd: number) => {
    const base = pos.length / 3;
    for (let iy = 0; iy < 2; iy++)
      for (let ix = 0; ix < 2; ix++) {
        const vec = { x: 0, y: 0, z: 0 };
        vec[u] = (ix * pw - pw / 2) * udir;
        vec[v] = (iy * ph - ph / 2) * vdir;
        vec[w] = pd / 2;
        pos.push(vec.x, vec.y, vec.z);
        uv.push(ix, 1 - iy);
      }
    const a = base, b = base + 2, c = base + 3, d = base + 1;
    idx.push(a, b, d, b, c, d);
  };
  plane("z", "y", "x", -1, -1, size.z, size.y, size.x);
  plane("z", "y", "x", 1, -1, size.z, size.y, -size.x);
  plane("x", "z", "y", 1, 1, size.x, size.z, size.y);
  plane("x", "z", "y", 1, -1, size.x, size.z, -size.y);
  plane("x", "y", "z", 1, -1, size.x, size.y, size.z);
  plane("x", "y", "z", -1, -1, size.x, size.y, -size.z);
  return { pos: new Float32Array(pos), uv: new Float32Array(uv), idx: new Uint16Array(idx) };
}

function useMaxWidth(q: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${q})`);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}

function Artwork({ config, isMobile }: { config: ArtworkConfig; isMobile: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const [ready, setReady] = useState(false);
  const resolution = isMobile ? 0.15 : 0.11;
  const cameraZ = isMobile ? 200 : 110;

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const tb = table.current;
    if (!el || !cv || !tb) return;
    const gl = cv.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) return;
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const geo = boxGeometry(800, 400, 16);
    const buf = (data: Float32Array, name: string, size: number) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    buf(geo.pos, "position", 3);
    buf(geo.uv, "uv", 2);
    const ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.idx, gl.STATIC_DRAW);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uProj = U("projectionMatrix"), uMV = U("modelViewMatrix"), uTime = U("time"), uLight = U("lightness");
    const uNW = U("noiseWeight");
    gl.uniform1f(U("distort"), config.shader.distort);
    gl.uniform1f(U("distortSpeed"), config.shader.distortSpeed);
    gl.uniform1f(U("noiseScale"), config.shader.noiseScale);
    gl.uniform1f(U("noiseSpeed"), config.shader.noiseSpeed);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const outer = mul(translate(...config.scene.position), rotXYZ(config.scene.rotation));
    const models = LIGHTNESS.map((_, n) => mul(outer, mul(translate(0, 4 * n, 8 * n), scale(0.1))));
    const view = translate(0, 0, -cameraZ);
    // each slab eases its lightness from 1 and its noise weight from 0, a fixed step per frame
    const light = LIGHTNESS.map(() => 1);
    const weight = LIGHTNESS.map(() => 0);

    const small = document.createElement("canvas");
    const sctx = small.getContext("2d", { willReadFrequently: true });
    let w = 0, h = 0, a = 0, s = 0;
    const fontPx = 2 / resolution;
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.floor(w * dpr));
      cv.height = Math.max(1, Math.floor(h * dpr));
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      a = Math.floor(w * resolution);
      s = Math.floor(h * resolution);
      small.width = a;
      small.height = s;
      Object.assign(tb.style, {
        whiteSpace: "pre",
        margin: "0px",
        padding: "0px",
        letterSpacing: "-1px",
        fontFamily: "courier new, monospace",
        fontSize: `${fontPx}px`,
        lineHeight: `${fontPx}px`,
        textAlign: "left",
        textDecoration: "none",
      });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const start = performance.now();
    let raf = 0;
    let frames = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!w || !h || !sctx) return;
      const t = (performance.now() - start) / 1e3;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uProj, false, perspective(10, w / h, 1, 1e3));
      gl.uniform1f(uTime, t);
      models.forEach((m, n) => {
        const dl = LIGHTNESS[n] - light[n];
        light[n] = Math.abs(dl) > 0.01 ? light[n] + 0.008 * dl : LIGHTNESS[n];
        const dw = config.shader.noiseWeight - weight[n];
        weight[n] = Math.abs(dw) > 0.01 ? weight[n] + 0.008 * dw : config.shader.noiseWeight;
        gl.uniformMatrix4fv(uMV, false, mul(view, m));
        gl.uniform1f(uLight, light[n]);
        gl.uniform1f(uNW, weight[n]);
        gl.drawElements(gl.TRIANGLES, geo.idx.length, gl.UNSIGNED_SHORT, 0);
      });
      // resample into glyphs: every other row, one glyph per column
      sctx.clearRect(0, 0, a, s);
      sctx.drawImage(cv, 0, 0, a, s);
      const d = sctx.getImageData(0, 0, a, s).data;
      let out = "";
      for (let y = 0; y < s; y += 2) {
        for (let x = 0; x < a; x++) {
          const o = (y * a + x) * 4;
          let br = (0.3 * d[o] + 0.59 * d[o + 1] + 0.11 * d[o + 2]) / 255;
          if (d[o + 3] === 0) br = 1;
          const g = GLYPHS[Math.floor((1 - br) * (GLYPHS.length - 1))];
          out += g === undefined || g === " " ? "&nbsp;" : g;
        }
        out += "<br/>";
      }
      tb.innerHTML = `<tr><td style="display:block;width:${w}px;height:${h}px;overflow:hidden">${out}</td></tr>`;
      if (++frames === 3) setReady(true);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [config, resolution, cameraZ]);

  return (
    <div ref={wrap} className="size-full" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "auto", opacity: ready ? 1 : 0 }}>
      <div style={{ width: "100%", height: "100%" }}>
        <canvas ref={canvas} style={{ display: "block", opacity: 0 }} />
        <div style={{ cursor: "default", position: "absolute", top: "0px", left: "0px", pointerEvents: "none", color: FG, backgroundColor: "transparent" }}>
          <table ref={table} cellSpacing={0} cellPadding={0} />
        </div>
      </div>
    </div>
  );
}

/** Client-only artwork (the server renders the empty placeholder the lazy loader shows). */
export function AsciiArtwork({ config = DEFAULT_ARTWORK }: { config?: ArtworkConfig }) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMaxWidth("992px");
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="size-full" />;
  return <Artwork key={isMobile ? "mobile" : "desktop"} config={config} isMobile={isMobile} />;
}
