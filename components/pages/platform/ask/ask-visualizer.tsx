"use client";
// Canvas "signal lines" field behind the Ask hero and the Universal Context section.
// Line heights, noise, LFO sweeps, hover bandpass and comets are driven by a rAF loop.
import { useEffect, useRef, useState } from "react";
import { animate, motionValue, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { cn } from "@/components/hero/cn";

type Oklch = { c: number; h: number; l: number };
type Spring = { position: number; target: number; velocity: number };

export type VisualizerState =
  | "a_enter"
  | "b_placeholder"
  | "c_typing"
  | "d_complete"
  | "e_thinking"
  | "f_responding"
  | "g_finished"
  | "h_idle"
  | "i_universalContext";

type Noise = { amount: number; colorIntensity?: number; speed: number };
type Lfo = {
  boostIntensity: number;
  colorIntensity?: number;
  filterQ: number;
  filterType: "bandpass";
  speed: number;
  startPhase?: number;
};
type StateConfig = {
  lfo: Lfo | null;
  noise: Noise | null;
  shape: { amplitude: number; baseHeight: number; type: "flat" | "invertedParabola" };
};

const BAR_COLOR_LIGHT: Oklch = { c: 0.0111, h: 256.749, l: 0.8804 };
const BAR_COLOR_DARK: Oklch = { c: 0.0121, h: 258.386, l: 0.3156 };
const COMET_COLOR_LIGHT: Oklch = { c: 0.0111, h: 256.749, l: 0.8 };
const COMET_COLOR_DARK: Oklch = { c: 0.0121, h: 258.386, l: 0.35 };
const COMET_OPACITY_SPRING = { bounce: 0, visualDuration: 0.25 };
const SHAPES: Record<StateConfig["shape"]["type"], (x: number) => number> = {
  flat: () => 0,
  invertedParabola: (e) => -(1 - e * e),
};
const FILTERS = {
  bandpass: (e: number, t: number, a: number) => {
    const r = Math.abs(e - t);
    return Math.exp(-(r * r) * a);
  },
};
const STATE_CONFIGS: Record<VisualizerState, StateConfig> = {
  a_enter: {
    lfo: null,
    noise: { amount: 0, colorIntensity: 0, speed: 3 },
    shape: { amplitude: 0, baseHeight: 0.5, type: "flat" },
  },
  b_placeholder: { lfo: null, noise: null, shape: { amplitude: 0, baseHeight: 0.5, type: "flat" } },
  c_typing: {
    lfo: null,
    noise: { amount: 0.025, colorIntensity: 0, speed: 2.5 },
    shape: { amplitude: 0, baseHeight: 0.5, type: "flat" },
  },
  d_complete: {
    lfo: null,
    noise: { amount: 0.01, colorIntensity: 0, speed: 2 },
    shape: { amplitude: 0, baseHeight: 0.5, type: "flat" },
  },
  e_thinking: {
    lfo: {
      boostIntensity: 0.1,
      colorIntensity: 1,
      filterQ: 10,
      filterType: "bandpass",
      speed: 0.8333333333333334,
      startPhase: -1,
    },
    noise: { amount: 0, colorIntensity: 0, speed: 4 },
    shape: { amplitude: 0, baseHeight: 0.5, type: "flat" },
  },
  f_responding: { lfo: null, noise: null, shape: { amplitude: 0.2, baseHeight: 0.6, type: "invertedParabola" } },
  g_finished: {
    lfo: null,
    noise: { amount: 0.001, colorIntensity: 0, speed: 2 },
    shape: { amplitude: 0, baseHeight: 0.5, type: "flat" },
  },
  h_idle: { lfo: null, noise: null, shape: { amplitude: 0, baseHeight: 0.5, type: "flat" } },
  i_universalContext: {
    lfo: null,
    noise: null,
    shape: { amplitude: 0.38, baseHeight: 0.8, type: "invertedParabola" },
  },
};
export const THINKING_STATE_DURATION_MS = 2400;
const STATE_KEYS = Object.keys(STATE_CONFIGS) as VisualizerState[];

type Line = {
  curvatureDelay: number;
  dotDelay: number;
  entryStartTime: number | null;
  fadeSpring: Spring;
  hasEntered: boolean;
  heightSpring: Spring;
  index: number;
  leftPercent: number;
  lineDelay: number;
  noisePhase: number;
  normalizedIndex: number;
  shimmerAmount: number;
  shimmerPhase: number;
  shimmerSpeed: number;
  startHeight: number;
  terminatorColor: Oklch;
  terminatorSpring: Spring;
};
type TrailPoint = { time: number; x: number; y: number };
type Comet = {
  acceleration: number;
  color: Oklch;
  currentY: number;
  length: number;
  lineIndex: number;
  opacity: number;
  opacityAnimation: AnimationPlaybackControls;
  opacityValue: MotionValue<number>;
  startY: number;
  velocity: number;
};

function hash(e: number) {
  const t = 1e4 * Math.sin(9999 * e);
  return t - Math.floor(t);
}
function clamp01(e: number) {
  return Math.max(0, Math.min(1, e));
}
function lighten(e: Oklch, t: number): Oklch {
  return { ...e, l: clamp01(e.l + t) };
}
function css(e: Oklch) {
  return `oklch(${e.l.toFixed(4)} ${e.c.toFixed(4)} ${e.h.toFixed(2)})`;
}
function pushTrail(
  points: TrailPoint[],
  cursor: { current: number },
  last: { current: TrailPoint | null },
  p: { x: number; y: number },
  time: number,
  step: number,
) {
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
  const n = Math.max(1, step),
    s = last.current;
  if (!s) {
    const t = { time, x: p.x, y: p.y };
    last.current = t;
    points.push(t);
    return;
  }
  const o = p.x - s.x,
    d = p.y - s.y,
    c = Math.hypot(o, d);
  if (0 === c) return;
  const C = Math.max(1, Math.ceil(c / n)),
    u = (time - s.time) / C;
  for (let t = 1; t <= C; t++) {
    const a = t / C;
    points.push({ time: s.time + u * t, x: s.x + o * a, y: s.y + d * a });
  }
  last.current = { time, x: p.x, y: p.y };
  if (points.length > 120) {
    const a = points.length - 120;
    points.splice(0, a);
    cursor.current = Math.max(0, cursor.current - a);
  }
}
function spring(e: number): Spring {
  return { position: e, target: e, velocity: 0 };
}
function stepSpring(e: Spring, stiffness: number, damping: number, dt: number) {
  const i = e.position - e.target,
    l = -damping * e.velocity;
  e.velocity += (-stiffness * i + l) * dt;
  e.position += e.velocity * dt;
}
function easeOutCubic(e: number) {
  return e <= 0 ? 0 : e >= 1 ? 1 : 1 - (1 - e) ** 3;
}
function makeLines(count: number, delay: number): Line[] {
  const a = Math.floor(count / 2);
  return Array.from({ length: count }, (_, i) => {
    const l = 0.4 + 0.15 * hash(777 * i),
      n = delay + 0.008 * Math.abs(i - a) + (0.5 * hash(i + 100) + 0.5 * hash(7 * i));
    return {
      curvatureDelay: n + 0.25,
      dotDelay: n,
      entryStartTime: null,
      fadeSpring: spring(0),
      hasEntered: false,
      heightSpring: spring(l),
      index: i,
      leftPercent: ((i + 1) / (count + 1)) * 100,
      lineDelay: n + 0.5,
      noisePhase: hash(333 * i) * Math.PI * 2,
      normalizedIndex: 0 === a ? 0 : (i - a) / a,
      shimmerAmount: 0.15 + 0.25 * hash(23 * i),
      shimmerPhase: hash(13 * i) * Math.PI * 2,
      shimmerSpeed: 0.5 + 1.5 * hash(17 * i),
      startHeight: l,
      terminatorColor: COMET_COLOR_LIGHT,
      terminatorSpring: spring(0),
    };
  });
}
function segmentHitsLine(
  e: TrailPoint,
  t: TrailPoint,
  a: number,
  r: number,
  i: number,
) {
  const l = t.x - e.x,
    n = t.y - e.y;
  if (0 === l) {
    if (Math.abs(e.x - a) > 8) return false;
    const lo = Math.min(e.y, t.y);
    return Math.max(e.y, t.y) >= r && lo <= i;
  }
  const s = (a - 8 - e.x) / l,
    o = (a + 8 - e.x) / l,
    d = Math.max(0, Math.min(s, o)),
    c = Math.min(1, Math.max(s, o));
  if (d > c) return false;
  const C = e.y + n * d,
    u = e.y + n * c,
    h = Math.min(C, u);
  return Math.max(C, u) >= r && h <= i;
}
function spawnComets(
  seg: { start: TrailPoint; end: TrailPoint },
  speed: number,
  lines: Line[],
  size: { width: number; height: number },
  now: number,
  comets: Comet[],
  lastSpawn: Map<number, number>,
  orientation: Orientation,
  cometColor: Oklch,
  sign: number,
) {
  const { width: h, height: p } = size,
    { x, y: g } = seg.start,
    { x: M, y } = seg.end;
  if (0 === h || 0 === lines.length) return;
  const w = "bottom-to-top" === orientation,
    E = Math.min(speed / 1200, 2),
    b = 1 + 1.2 * E,
    H = 1 + 0.9 * E,
    A = lighten(cometColor, 0.15 * E * sign);
  for (const e of lines) {
    const t = (e.leftPercent / 100) * h,
      ih = e.heightSpring.position * p,
      l = w ? p - ih : 0,
      d = w ? p : ih,
      c = 8 >= Math.abs(x - t) && g >= l && g <= d,
      u = 8 >= Math.abs(M - t) && y >= l && y <= d;
    if (c || (!u && !segmentHitsLine(seg.start, seg.end, t, l, d))) continue;
    const v = lastSpawn.get(e.index);
    if (v && now - v < 80) continue;
    const V = M - x,
      j = y - g;
    let L = y;
    if (Math.abs(V) > 1e-4) {
      const k = Math.max(0, Math.min(1, (t - x) / V));
      if (8 >= Math.abs(x + V * k - t)) L = g + j * k;
    }
    L = Math.max(l, Math.min(d, L));
    const k = motionValue(0),
      _ = COMET_OPACITY_SPRING.visualDuration / (1 + 0.1 * E),
      S = animate(k, 1, { bounce: COMET_OPACITY_SPRING.bounce, type: "spring", visualDuration: _ });
    comets.push({
      acceleration: 200 * b,
      color: A,
      currentY: L,
      length: 300 * H,
      lineIndex: e.index,
      opacity: 0,
      opacityAnimation: S,
      opacityValue: k,
      startY: L,
      velocity: 100 * b,
    });
    lastSpawn.set(e.index, now);
  }
}
function drawLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  color: Oklch,
  scale: number,
  orientation: Orientation,
  dpr: number,
) {
  if (scale <= 0 || height <= 0) return;
  ctx.fillStyle = css(color);
  const o = +dpr,
    d = height * scale;
  if ("bottom-to-top" === orientation) {
    const i = y + height - d;
    ctx.fillRect(x - o / 2, i, o, d);
  } else ctx.fillRect(x - o / 2, y, o, d);
}
function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  opacity: number,
  bottomToTop: boolean,
  color: Oklch,
  dpr: number,
) {
  if (opacity <= 0) return;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = css(color);
  ctx.beginPath();
  const s = 1.5 * dpr;
  if (bottomToTop) ctx.arc(x, y - s / 2, s, 0, 2 * Math.PI);
  else ctx.arc(x, y + s / 2, s, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;
}

type Orientation = "bottom-to-top" | "top-to-bottom";

function useMaxWidth(px: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${px})`);
    const on = () => setMatch(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, [px]);
  return match;
}

export function AskVisualizer({
  orientation: e = "bottom-to-top",
  state: a = "h_idle",
  lineSpacing: r = 12,
  mouseX: n = -1,
  mouseY: C = -1,
  enableCursorColor: f = true,
  enableComets: x = false,
  animationDelay: M = 0,
  colorMode: L = "light",
  anchorLinesToCenter: k = false,
  className: _,
  onEntryComplete: S,
}: {
  orientation?: Orientation;
  state?: VisualizerState;
  lineSpacing?: number;
  mouseX?: number;
  mouseY?: number;
  enableCursorColor?: boolean;
  enableComets?: boolean;
  animationDelay?: number;
  colorMode?: "light" | "dark";
  anchorLinesToCenter?: boolean;
  className?: string;
  onEntryComplete?: () => void;
}) {
  const N = useMaxWidth("1023.98px"),
    z = useMaxWidth("767.98px") ? 0.4 : N ? 0.7 : 1,
    Z = "dark" === L ? BAR_COLOR_DARK : BAR_COLOR_LIGHT,
    I = "dark" === L ? COMET_COLOR_DARK : COMET_COLOR_LIGHT,
    B = "dark" === L ? 1 : -1,
    O = useRef<HTMLDivElement>(null),
    F = useRef<HTMLCanvasElement>(null),
    R = useRef<Line[]>([]),
    D = useRef<{
      currentState: VisualizerState;
      entryCompleteTime: number | null;
      hoverActiveSpring: Spring;
      hoverCenterSpring: Spring;
      isEntryComplete: boolean;
      lfoPhase: number;
      noiseTime: number;
      stateBlend: Record<VisualizerState, number>;
    } | null>(null);
  if (null === D.current)
    D.current = {
      currentState: a,
      entryCompleteTime: null,
      hoverActiveSpring: spring(0),
      hoverCenterSpring: spring(0),
      isEntryComplete: false,
      lfoPhase: 0,
      noiseTime: 0,
      stateBlend: {
        a_enter: 0,
        b_placeholder: +("b_placeholder" === a),
        c_typing: 0,
        d_complete: 0,
        e_thinking: 0,
        f_responding: 0,
        g_finished: 0,
        h_idle: +("h_idle" === a),
        i_universalContext: +("i_universalContext" === a),
      },
    };
  const P = D.current,
    T = useRef({ dpr: 1, height: 0, width: 0 }),
    X = useRef(false),
    W = useRef({ active: false, x: 0 }),
    U = useRef(n),
    Q = useRef(Z),
    K = useRef(I),
    G = useRef(B),
    q = useRef(x),
    Y = useRef(S),
    J = useRef(false),
    $ = useRef<Comet[]>([]),
    ee = useRef<Map<number, number> | null>(null);
  if (null === ee.current) ee.current = new Map();
  const et = ee.current,
    ea = useRef<TrailPoint[]>([]),
    er = useRef(0),
    ei = useRef<TrailPoint | null>(null),
    el = useRef<TrailPoint[]>([]),
    en = useRef(0),
    es = useRef<TrailPoint | null>(null);

  useEffect(() => {
    P.currentState = a;
    const cfg = STATE_CONFIGS[a];
    if (cfg.lfo) P.lfoPhase = cfg.lfo.startPhase ?? 0;
  }, [a, P]);
  useEffect(() => {
    U.current = n;
  }, [n]);
  useEffect(() => {
    if ("top-to-bottom" === e) {
      if (-1 === n || -1 === C) {
        el.current = [];
        en.current = 0;
        es.current = null;
        return;
      }
      pushTrail(el.current, en, es, { x: n, y: C }, performance.now(), 4);
    }
  }, [n, C, e]);
  useEffect(() => {
    Q.current = Z;
    K.current = I;
    G.current = B;
  }, [Z, I, B]);
  useEffect(() => {
    q.current = x;
  }, [x]);
  useEffect(() => {
    Y.current = S;
  }, [S]);
  useEffect(() => {
    let raf = 0;
    const a = O.current,
      i = F.current;
    if (!a || !i) return;
    const l = i.getContext("2d");
    if (!l) return;
    let n = performance.now();
    const s = () => {
        const rect = a.getBoundingClientRect(),
          t = window.devicePixelRatio || 1;
        i.width = rect.width * t;
        i.height = rect.height * t;
        i.style.width = `${rect.width}px`;
        i.style.height = `${rect.height}px`;
        T.current = { dpr: t, height: rect.height, width: rect.width };
        R.current = (function (prev: Line[], width: number, spacing: number, delay: number, anchor: boolean) {
          if (!anchor) {
            const cnt = Math.max(3, Math.floor(width / spacing));
            return prev.length === cnt ? prev : makeLines(cnt, delay);
          }
          const half = Math.max(1, Math.floor(width / 2 / spacing)),
            cnt = 2 * half + 1,
            out = prev.length === cnt ? prev : makeLines(cnt, delay),
            o = (spacing / width) * 100;
          for (const line of out) line.leftPercent = 50 + (line.index - half) * o;
          return out;
        })(R.current, rect.width, r, M, k);
      },
      o = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !X.current) X.current = true;
        },
        { threshold: 0.25 },
      ),
      d = new ResizeObserver(s),
      c = (t: PointerEvent) => {
        if ("bottom-to-top" !== e) return;
        const rect = a.getBoundingClientRect();
        if (t.clientX >= rect.left && t.clientX <= rect.right && t.clientY >= rect.top && t.clientY <= rect.bottom) {
          const px = t.clientX - rect.left,
            py = t.clientY - rect.top;
          W.current = { active: f, x: px / rect.width };
          pushTrail(ea.current, er, ei, { x: px, y: py }, performance.now(), 4);
        } else {
          W.current.active = false;
          ea.current = [];
          er.current = 0;
          ei.current = null;
        }
      },
      frame = (now: number) => {
        const dt = Math.min((now - n) / 1e3, 0.1);
        n = now;
        const { width: s, height: o, dpr: d } = T.current,
          c = R.current,
          m = X.current;
        if (0 === s || 0 === o || 0 === c.length) {
          raf = requestAnimationFrame(frame);
          return;
        }
        l.clearRect(0, 0, i.width, i.height);
        const cfg = STATE_CONFIGS[P.currentState],
          y = P.stateBlend,
          w = 2 * dt;
        for (const key of STATE_KEYS) {
          const t = +(key === P.currentState);
          y[key] += (t - y[key]) * w;
        }
        if (cfg.lfo) {
          P.lfoPhase += dt * cfg.lfo.speed;
          if (P.lfoPhase > 1) P.lfoPhase -= 2;
        }
        P.noiseTime += dt;
        const H = U.current;
        if ("top-to-bottom" === e && -1 !== H) P.hoverCenterSpring.target = (H / s) * 2 - 1;
        if ("bottom-to-top" === e && W.current.active) P.hoverCenterSpring.target = 2 * W.current.x - 1;
        stepSpring(P.hoverCenterSpring, 150, 25, dt);
        if (m && !P.isEntryComplete) {
          if (null === P.entryCompleteTime) P.entryCompleteTime = now + (M + 3) * 1e3;
          else if (now >= P.entryCompleteTime) {
            P.isEntryComplete = true;
            if (!J.current) {
              J.current = true;
              Y.current?.();
            }
          }
        }
        const hovering = P.isEntryComplete && ("bottom-to-top" === e ? W.current.active && f : -1 !== H);
        P.hoverActiveSpring.target = +!!hovering;
        stepSpring(P.hoverActiveSpring, 80, 30, dt);
        if ("top-to-bottom" === e && q.current && P.isEntryComplete) {
          const t = el.current;
          if (t.length >= 2) {
            const start = Math.min(en.current, t.length - 2);
            for (let j = start; j < t.length - 1; j++) {
              const p0 = t[j],
                p1 = t[j + 1],
                dtMs = Math.max(8, p1.time - p0.time),
                v = Math.hypot(p1.x - p0.x, p1.y - p0.y) / (dtMs / 1e3);
              spawnComets({ end: p1, start: p0 }, v, c, { height: o, width: s }, now, $.current, et, e, K.current, G.current);
            }
            en.current = t.length - 1;
          }
        }
        const byIndex = new Map<number, Line>(),
          scales = new Map<number, number>(),
          S: {
            dotOpacity: number;
            dotY: number;
            isBottomToTop: boolean;
            line: Line;
            lineColor: Oklch;
            lineHeight: number;
            lineScale: number;
            x: number;
            y: number;
          }[] = [],
          N = Q.current,
          Zc = lighten(N, 0.085 * G.current);
        for (let t = 0; t < c.length; t++) {
          const line = c[t];
          byIndex.set(line.index, line);
          let targetHeight: number, targetFade: number;
          {
            let hSum = 0,
              fSum = 0;
            for (const key of STATE_KEYS) {
              const sc = STATE_CONFIGS[key],
                wgt = y[key];
              if (wgt < 0.001) continue;
              const shape = SHAPES[sc.shape.type],
                base = sc.shape.baseHeight + shape(line.normalizedIndex) * sc.shape.amplitude * z;
              let nz = 0,
                nzColor = 0;
              if (sc.noise) {
                const tt = P.noiseTime * sc.noise.speed,
                  rr =
                    0.5 * Math.sin(tt + line.noisePhase) +
                    0.3 * Math.sin(1.7 * tt + 2.3 * line.noisePhase) +
                    0.2 * Math.sin(0.7 * tt + 0.5 * line.noisePhase);
                nz = rr * sc.noise.amount;
                nzColor = Math.abs(rr) * (sc.noise.colorIntensity ?? 0) * 0.04;
              }
              let boost = 0,
                lfoColor = 0;
              if (sc.lfo) {
                const rr = FILTERS[sc.lfo.filterType](line.normalizedIndex, P.lfoPhase, sc.lfo.filterQ);
                boost = rr * sc.lfo.boostIntensity;
                lfoColor = rr * (sc.lfo.colorIntensity ?? 0) * 0.08;
              }
              hSum += (base + nz + boost) * wgt;
              fSum += (lfoColor + nzColor) * wgt;
            }
            targetFade = fSum;
            targetHeight = Math.max(0.1, Math.min(1, hSum));
          }
          const hoverAmt = P.hoverActiveSpring.position;
          if (hoverAmt > 0.001) {
            const center = P.hoverCenterSpring.position,
              ii = -2 * FILTERS.bandpass(line.normalizedIndex, center, 8);
            let shimmer = 0;
            if (ii > 0.01)
              shimmer = Math.sin(P.noiseTime * line.shimmerSpeed + line.shimmerPhase) * line.shimmerAmount * ii * 0.3;
            const hv = 0.12 * Math.max(0, Math.min(1, ii + shimmer));
            targetFade += (hv - targetFade) * hoverAmt;
          }
          let dotOpacity = 0,
            lineScale = 0,
            heightProgress = 0;
          if (m) {
            if (null === line.entryStartTime) line.entryStartTime = now;
            const el2 = (now - line.entryStartTime) / 1e3,
              di = Math.max(0, (el2 - line.dotDelay) / 0.4),
              li = Math.max(0, (el2 - line.lineDelay) / 0.8),
              ci = Math.max(0, (el2 - line.curvatureDelay) / 1.2);
            dotOpacity = easeOutCubic(Math.min(1, di));
            heightProgress = easeOutCubic(Math.min(1, ci));
            lineScale = easeOutCubic(Math.min(1, li));
          }
          scales.set(line.index, lineScale);
          if (heightProgress >= 1 && !line.hasEntered) line.hasEntered = true;
          if (line.hasEntered) {
            line.heightSpring.target = targetHeight;
            stepSpring(line.heightSpring, 150, 25, dt);
          } else {
            line.heightSpring.position = line.startHeight + (targetHeight - line.startHeight) * heightProgress;
          }
          line.fadeSpring.target = Math.min(1, Math.max(0, targetFade));
          stepSpring(line.fadeSpring, 80, 30, dt);
          const X2 = (line.leftPercent / 100) * s * d,
            wH = line.heightSpring.position * o * d,
            col = lighten(N, line.fadeSpring.position * G.current),
            A = "bottom-to-top" === e,
            V = A ? o * d - wH : 0,
            j = A ? V : wH * lineScale;
          S.push({
            dotOpacity,
            dotY: j,
            isBottomToTop: A,
            line,
            lineColor: col,
            lineHeight: wH,
            lineScale,
            x: X2,
            y: V,
          });
        }
        if ("bottom-to-top" === e && P.isEntryComplete) {
          const t = ea.current;
          if (t.length >= 2) {
            const start = Math.min(er.current, t.length - 2);
            for (let j = start; j < t.length - 1; j++) {
              const p0 = t[j],
                p1 = t[j + 1],
                dtMs = Math.max(8, p1.time - p0.time),
                v = Math.hypot(p1.x - p0.x, p1.y - p0.y) / (dtMs / 1e3);
              spawnComets({ end: p1, start: p0 }, v, c, { height: o, width: s }, now, $.current, et, e, K.current, G.current);
            }
            er.current = t.length - 1;
          }
        }
        if ("bottom-to-top" === e || q.current) {
          const alive: Comet[] = [],
            hits = new Map<number, { color: Oklch; weight: number }>(),
            trails: {
              clipHeight: number;
              clipTop: number;
              color: Oklch;
              headY: number;
              opacity: number;
              tailY: number;
              x: number;
            }[] = [];
          for (const cm of $.current) {
            const line = byIndex.get(cm.lineIndex);
            if (!line) {
              cm.opacityAnimation.stop();
              continue;
            }
            const up = "bottom-to-top" === e,
              sc = scales.get(line.index) ?? 1,
              u = line.heightSpring.position * o * sc,
              h = up ? o - u : u;
            cm.velocity += cm.acceleration * dt;
            cm.currentY += (up ? -1 : 1) * cm.velocity * dt;
            const tail = up ? Math.min(cm.currentY + cm.length, cm.startY) : Math.max(cm.currentY - cm.length, cm.startY),
              dist = up ? tail - h : h - tail,
              fade = dist < 50 ? Math.max(0, dist / 50) : 1,
              ov = Math.max(0, Math.min(1, cm.opacityValue.get()));
            cm.opacity = Math.min(fade, ov);
            if (up ? cm.currentY <= h && tail >= h : tail <= h && cm.currentY >= h) {
              const prev = hits.get(line.index);
              if (!prev || cm.opacity > prev.weight) hits.set(line.index, { color: cm.color, weight: cm.opacity });
            }
            if (fade <= 0 || (up ? tail <= h : tail >= h)) {
              cm.opacityAnimation.stop();
              continue;
            }
            alive.push(cm);
            const gx = (line.leftPercent / 100) * s * d,
              hy = cm.currentY * d,
              ty = tail * d;
            if ((up && ty > hy) || (!up && hy > ty)) {
              const top = up ? h * d : 0,
                ch = (up ? o * d : h * d) - top;
              if (ch > 0)
                trails.push({ clipHeight: ch, clipTop: top, color: cm.color, headY: hy, opacity: cm.opacity, tailY: ty, x: gx });
            }
          }
          $.current = alive;
          for (const t of S) {
            const hit = hits.get(t.line.index);
            t.line.terminatorSpring.target = +!!hit;
            stepSpring(t.line.terminatorSpring, 200, 35, dt);
            if (hit) t.line.terminatorColor = hit.color;
            const mix = (function (from: Oklch, to: Oklch, amt: number): Oklch {
              const k2 = Math.max(0, Math.min(1, amt));
              return {
                c: from.c + (to.c - from.c) * k2,
                h: from.h + (((to.h - from.h + 180) % 360) - 180) * k2,
                l: clamp01(from.l + (to.l - from.l) * k2),
              };
            })(Zc, t.line.terminatorColor, t.line.terminatorSpring.position);
            drawLine(l, t.x, t.y, t.lineHeight, t.lineColor, t.lineScale, e, d);
            if (t.dotOpacity > 0) drawDot(l, t.x, t.dotY, t.dotOpacity, t.isBottomToTop, mix, d);
          }
          for (const tr of trails) {
            l.save();
            l.beginPath();
            l.rect(0, tr.clipTop, s * d, tr.clipHeight);
            l.clip();
            if (tr.opacity > 0) {
              const w2 = +d,
                grad = l.createLinearGradient(tr.x, tr.headY, tr.x, tr.tailY),
                c0 = `oklch(${tr.color.l} ${tr.color.c} ${tr.color.h} / 0)`,
                c1 = `oklch(${tr.color.l} ${tr.color.c} ${tr.color.h} / ${tr.opacity})`;
              grad.addColorStop(0, c0);
              grad.addColorStop(0.05, c1);
              grad.addColorStop(1, c0);
              l.fillStyle = grad;
              l.fillRect(tr.x - w2 / 2, tr.headY, w2, tr.tailY - tr.headY);
            }
            l.restore();
          }
        } else
          for (const t of S) {
            t.line.terminatorSpring.target = 0;
            stepSpring(t.line.terminatorSpring, 200, 35, dt);
            drawLine(l, t.x, t.y, t.lineHeight, t.lineColor, t.lineScale, e, d);
            if (t.dotOpacity > 0) drawDot(l, t.x, t.dotY, t.dotOpacity, t.isBottomToTop, Zc, d);
          }
        raf = requestAnimationFrame(frame);
      };
    s();
    o.observe(a);
    d.observe(a);
    window.addEventListener("pointermove", c);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      o.disconnect();
      d.disconnect();
      window.removeEventListener("pointermove", c);
    };
  }, [e, r, M, f, z, k, P, et]);

  return (
    <div
      ref={O}
      className={
        // A caller className replaces the default placement (the merged class list the reference renders).
        _
          ? cn("pointer-events-auto overflow-hidden", _)
          : cn(
              "pointer-events-auto absolute overflow-hidden",
              "bottom-to-top" === e ? "inset-0 -inset-x-[0.5px]" : "inset-x-0 top-0 h-[85%]",
            )
      }
      aria-hidden="true"
    >
      <canvas
        ref={F}
        className={cn("absolute", "bottom-to-top" === e ? "inset-0 -right-[0.5px]" : "inset-x-0 top-0 -left-[0.5px] h-full")}
      />
    </div>
  );
}
