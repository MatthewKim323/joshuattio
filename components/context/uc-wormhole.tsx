"use client";
import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/*
 * Funnel / wormhole scene for the Signals block: a 2D canvas that projects a
 * 3D funnel (fills, rings, spokes, particles) through a scroll-free camera
 * rig driven by the `progress` motion value (0 = context, 0.5 = agents,
 * 1 = ecosystem). All constants are the tuned originals.
 */

type Vec3 = [number, number, number];
type Pt = { fade: number; x: number; y: number; z: number };
type Item =
  | { kind: "fill"; alpha: number; depth: number; pts: [Pt, Pt, Pt, Pt] }
  | { kind: "line"; a: Pt; b: Pt; alpha: number; depth: number; rgb: string }
  | { kind: "particle"; aHead: number; angle: number; depth: number; head: Pt; opacity: number };

type CameraConfig = {
  alphaEnd: number;
  alphaReach: number;
  alphaStart: number;
  alphaTop: number;
  distEnd: number;
  distEnd3: number;
  distHold: number;
  distRest: number;
  distStart: number;
  distTop: number;
  diveEnd: number;
  focusEnd: number;
  focusStart: number;
  rollEnd: number;
  stage3Start: number;
};

const cross = (e: Vec3, t: Vec3): Vec3 => [
  e[1] * t[2] - e[2] * t[1],
  e[2] * t[0] - e[0] * t[2],
  e[0] * t[1] - e[1] * t[0],
];
const norm = (e: Vec3): Vec3 => {
  const t = Math.hypot(e[0], e[1], e[2]) || 1;
  return [e[0] / t, e[1] / t, e[2] / t];
};
const clamp = (e: number, t: number, a: number) => (e < t ? t : e > a ? a : e);
const lerp = (e: number, t: number, a: number) => e + (t - e) * a;
function smooth(e: number, t: number, a: number) {
  const s = clamp((a - e) / (t - e || 1), 0, 1);
  return s * s * (3 - 2 * s);
}
const TAU = 2 * Math.PI;
const funnelRadius = (e: number) => 3.2 * (1 - Math.min(e, 1)) ** 3.2;
const funnelPoint = (e: number, t: number): Vec3 => {
  const a = funnelRadius(e);
  return [a * Math.cos(t), -(7.5 * clamp(e, 0, 1) ** 2.2), a * Math.sin(t)];
};
const ringFade = (e: number) => smooth(-0.2, 0.28, e);
const spokeFade = (e: number) => smooth(-0.26, 0, e);
const spokeEase = (e: number) => -0.2 + 1.2 * (1 - (1 - e) * (1 - e));
const RINGS = [-0.2, -0.12, -0.05, 0.04, 0.12, 0.22, 0.33, 0.45, 0.57, 0.68, 0.78, 0.87, 0.94];
const PULSE_RINGS = [0.66, 1.69, 2.72, 3.75];
const DASH_RGB = "35,37,41";
const pulse = (e: number) =>
  e <= 0 || e >= 1 ? 0 : e < 0.3 ? Math.sin(((e / 0.3) * Math.PI) / 2) : 1 - smooth(0, 1, (e - 0.3) / 0.7);
const ORBITS = [0.66, 1.4, 2.3, 3.2, 4.1, 5];
const ORBIT_ANGLE = (135 * Math.PI) / 180;
const HUB: Vec3 = [ORBITS[3] * Math.cos(ORBIT_ANGLE), -7.5, ORBITS[3] * Math.sin(ORBIT_ANGLE)];
const SATELLITES = [
  { phase: 0.4, ring: 1 },
  { phase: 2.6, ring: 1 },
  { phase: 1.2, ring: 2 },
  { phase: 3.9, ring: 2 },
  { phase: 0.2, ring: 4 },
  { phase: 2.9, ring: 4 },
  { phase: 1.7, ring: 5 },
  { phase: 5.1, ring: 5 },
];
const DEFAULT_CAMERA: CameraConfig = {
  alphaEnd: 56,
  alphaReach: 0.5,
  alphaStart: 52,
  alphaTop: 0,
  distEnd: 3.7,
  distEnd3: 10.5,
  distHold: 3.7,
  distRest: 9,
  distStart: 6.6,
  distTop: 12,
  diveEnd: 0.25,
  focusEnd: 7.5,
  focusStart: 1.2,
  rollEnd: 12,
  stage3Start: 0.7,
};
const parallax = (e: number) => 1 / (1 + 0.28 * e);
const LINE_RGB = "143,153,168";
const GLOW_RGB = "194,214,255";
const WHITE_RGB = "255,255,255";

export function UcWormhole({
  className,
  progress,
  cameraConfig,
}: {
  className?: string;
  progress: MotionValue<number>;
  cameraConfig?: CameraConfig;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const cameraRef = useRef<CameraConfig>(cameraConfig ?? DEFAULT_CAMERA);

  useEffect(() => {
    progressRef.current = progress;
    cameraRef.current = cameraConfig ?? DEFAULT_CAMERA;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let hostRect: DOMRect | null = null;
    const resize = () => {
      const r = host.getBoundingClientRect();
      hostRect = r;
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const probe = document.createElement("canvas").getContext("2d");
    const toRgb = (color: string): string | null => {
      if (!probe) return null;
      probe.fillStyle = "#000";
      probe.fillStyle = color;
      const t = String(probe.fillStyle);
      if (t.startsWith("#")) {
        const e = parseInt(t.slice(1), 16);
        return `${(e >> 16) & 255},${(e >> 8) & 255},${255 & e}`;
      }
      const a = t.match(/[\d.]+/g);
      return a && a.length >= 4 && +a[3] > 0
        ? `${Math.round(+a[0])},${Math.round(+a[1])},${Math.round(+a[2])}`
        : null;
    };
    const bgRgb = (() => {
      let el: HTMLElement | null = host;
      while (el) {
        const t = toRgb(getComputedStyle(el).backgroundColor);
        if (t) return t;
        el = el.parentElement;
      }
      return "16,16,16";
    })();
    const lineParts = LINE_RGB.split(",").map(Number);
    const bgParts = bgRgb.split(",").map(Number);
    const shades = Array.from({ length: 33 }, (_e, t) => {
      const a = (t / 32) * 0.9;
      return lineParts.map((e, i) => Math.round(lerp(e, bgParts[i], a))).join(",");
    });
    const shadeAt = (e: number) => shades[Math.round(32 * smooth(0.15, 0.75, e))];

    // camera
    let focal = 1;
    let cx = 0;
    let cy = 0;
    let right: Vec3 = [1, 0, 0];
    let up: Vec3 = [0, 1, 0];
    let fwd: Vec3 = [0, 0, 1];
    let eye: Vec3 = [0, 0, 0];
    let fadeNear = 1.4;
    let fadeFar = 15;
    // pointer
    let pointerOn = false;
    let px = 0;
    let py = 0;
    let pActive = 0;
    let sx = 0;
    let sy = 0;
    let sActive = 0;
    let tilt = 0;
    const ringScale = PULSE_RINGS.map(() => 1);
    let offX = 0;
    let offZ = 0;
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPointer = () => {
      pointerOn = hoverMq.matches && !reduceMq.matches;
      if (!pointerOn) {
        px = 0;
        py = 0;
        pActive = 0;
      }
    };
    syncPointer();
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerOn) return;
      if (!hostRect) hostRect = host.getBoundingClientRect();
      const a = hostRect;
      px = clamp((e.clientX - a.left - a.width / 2) / (a.width / 2), -1, 1);
      py = clamp((e.clientY - a.top - a.height / 2) / (a.height / 2), -1, 1);
      pActive = 1;
    };
    const onPointerLeave = () => {
      px = 0;
      py = 0;
      pActive = 0;
    };
    let dropProgress = 0;
    let dropLanded = -1e3;

    const project = (e: Vec3): Pt | null => {
      const t = e[0] - eye[0];
      const a = e[1] - eye[1];
      const s = e[2] - eye[2];
      const r = t * fwd[0] + a * fwd[1] + s * fwd[2];
      if (r <= 0.05) return null;
      const i = t * right[0] + a * right[1] + s * right[2];
      const n = t * up[0] + a * up[1] + s * up[2];
      const l = focal / r;
      return { fade: 0.1 + 0.9 * (1 - smooth(fadeNear, fadeFar, r)), x: cx + i * l, y: cy - n * l, z: r };
    };
    const tracePath = (e: Pt[]) => {
      ctx.beginPath();
      ctx.moveTo(e[0].x, e[0].y);
      for (let t = 1; t < e.length; t++) ctx.lineTo(e[t].x, e[t].y);
    };
    const glow = (x: number, y: number, radius: number, rgb: string, alpha: number) => {
      if (alpha <= 0.004 || radius <= 0) return;
      const n = ctx.createRadialGradient(x, y, 0, x, y, radius);
      n.addColorStop(0, `rgba(${rgb},${alpha})`);
      n.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = n;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
    };
    const polyline = (pts: (Pt | null)[], rgb: string, alpha: number, width = 1) => {
      if (alpha <= 0.004) return;
      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      let open = false;
      for (const p of pts)
        if (p) {
          if (open) ctx.lineTo(p.x, p.y);
          else {
            ctx.moveTo(p.x, p.y);
            open = true;
          }
        } else open = false;
      ctx.stroke();
    };
    const ringAt = (e: number) => {
      const t: (Pt | null)[] = [];
      for (let a = 0; a <= 48; a++) t.push(project(funnelPoint(e, (a / 48) * TAU)));
      return t;
    };
    const pushFills = (items: Item[], t: (Pt | null)[], a: (Pt | null)[], s: number) => {
      for (let r = 0; r < 48; r++) {
        const i = t[r];
        const n = a[r];
        const l = a[r + 1];
        const o = t[r + 1];
        if (i && n && l && o) {
          const d = (i.z + n.z + l.z + o.z) / 4;
          items.push({ alpha: s, depth: d, kind: "fill", pts: [i, n, l, o] });
        }
      }
    };
    const pushLine = (items: Item[], t: Pt | null, a: Pt | null, s: number, rgb: string) => {
      if (t && a && s > 0.004) items.push({ a: t, alpha: s, b: a, depth: (t.z + a.z) / 2 - 0.6, kind: "line", rgb });
    };
    const items: Item[] = [];
    const cache = { lastFill: "", lastStroke: "" };
    const drawItem = (e: Item, fill: string) => {
      if (e.kind === "particle") {
        ctx.globalCompositeOperation = "lighter";
        const angle = e.angle;
        const aHead = e.aHead;
        const opacity = e.opacity;
        const trail: Pt[] = [];
        for (let s = 0; s <= 10; s++) {
          const r = aHead - (s / 10) * 0.13;
          if (r <= 0) break;
          const i = project(funnelPoint(r, angle));
          if (!i) break;
          trail.push(i);
        }
        if (trail.length >= 2) {
          const r = trail.length - 1;
          const g = ctx.createLinearGradient(trail[0].x, trail[0].y, trail[r].x, trail[r].y);
          for (let a = 0; a <= r; a++) {
            const k = 1 - a / r;
            g.addColorStop(a / r, `rgba(${GLOW_RGB},${0.6 * k * k * trail[a].fade * opacity})`);
          }
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          tracePath(trail);
          ctx.stroke();
        }
        const n = e.head.fade * e.opacity;
        const l = 1 - 0.5 * e.aHead;
        const o = 1 - 0.9 * e.aHead * e.aHead * e.aHead;
        glow(e.head.x, e.head.y, 5 * l, GLOW_RGB, 0.13 * o * n);
        glow(e.head.x, e.head.y, 2.4 * l, WHITE_RGB, 0.95 * n);
        ctx.globalCompositeOperation = "source-over";
        cache.lastFill = "";
        cache.lastStroke = "";
        return;
      }
      ctx.beginPath();
      if (e.kind === "fill") {
        if (fill !== cache.lastFill) {
          ctx.fillStyle = fill;
          cache.lastFill = fill;
        }
        ctx.moveTo(e.pts[0].x, e.pts[0].y);
        ctx.lineTo(e.pts[1].x, e.pts[1].y);
        ctx.lineTo(e.pts[2].x, e.pts[2].y);
        ctx.lineTo(e.pts[3].x, e.pts[3].y);
        ctx.closePath();
        ctx.fill();
        return;
      }
      const n = `rgba(${e.rgb},${e.alpha.toFixed(3)})`;
      if (n !== cache.lastStroke) {
        ctx.strokeStyle = n;
        cache.lastStroke = n;
      }
      ctx.lineWidth = 1;
      ctx.moveTo(e.a.x, e.a.y);
      ctx.lineTo(e.b.x, e.b.y);
      ctx.stroke();
    };
    const pulseRing = (idx: number, alpha: number, scale = 1) => {
      const r = PULSE_RINGS[idx] * ringScale[idx] * scale;
      const pts: (Pt | null)[] = [];
      for (let e = 0; e <= 80; e++) {
        const t = (e / 80) * TAU;
        pts.push(project([r * Math.cos(t), -7.5, r * Math.sin(t)]));
      }
      polyline(pts, LINE_RGB, 0.2 * alpha);
    };
    const hubRing = (radius: number, ox = 0, oz = 0) => {
      const s: (Pt | null)[] = [];
      for (let r = 0; r <= 128; r++) {
        const i = (r / 128) * TAU;
        s.push(project([HUB[0] + ox + radius * Math.cos(i), -7.5, HUB[2] + oz + radius * Math.sin(i)]));
      }
      return s;
    };
    const hubPoint = (radius: number, angle: number, ox = 0, oz = 0) =>
      project([HUB[0] + ox + radius * Math.cos(angle), -7.5, HUB[2] + oz + radius * Math.sin(angle)]);
    const fadedStroke = (pts: (Pt | null)[], rgb: string, alpha: number) => {
      if (alpha <= 0.004) return;
      const r = pts.filter((e): e is Pt => e !== null);
      if (r.length < 2) return;
      const i = [...r].sort((e, t) => e.y - t.y);
      const top = i[0].y;
      const span = i[i.length - 1].y - top || 1;
      const g = ctx.createLinearGradient(0, top, 0, top + span);
      [0, 0.25, 0.5, 0.75, 1].forEach((e) => {
        const p = i[Math.round(e * (i.length - 1))];
        g.addColorStop(clamp((p.y - top) / span, 0, 1), `rgba(${rgb},${alpha * p.fade})`);
      });
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      tracePath(r);
      ctx.stroke();
    };

    let raf = 0;
    let running = false;
    let visible = false;
    let smoothed = -1;
    let last = 0;
    let orbit = 0;
    const orbitSpeed = 0.34 * (ORBITS[0] / ORBITS[3]);

    const camera = (e: number) => {
      focal = 0.92 * H;
      cx = 0.5 * W;
      const d = cameraRef.current;
      cy = H * (0.5 + -0.05 * smooth(d.stage3Start, 1, e));
      const c =
        ((lerp(d.alphaStart, d.alphaTop, smooth(0, d.alphaReach, smooth(0, d.diveEnd, e))) +
          (d.alphaEnd - d.alphaTop) * smooth(0.5, 0.92, e) +
          tilt) *
          Math.PI) /
        180;
      const t = smooth(0, d.diveEnd, e);
      const a = lerp(d.distStart, d.distEnd, t) + (d.distTop - (d.distStart + d.distEnd) / 2) * Math.sin(Math.PI * t);
      const r = smooth(d.diveEnd, 0.5, e);
      const i = a + (d.distRest - d.distEnd) * r;
      const o = smooth(0.5, 0.66, e);
      const x = i + (d.distHold - d.distRest) * o + (d.distEnd3 - d.distHold) * smooth(d.stage3Start, 1, e);
      const p = lerp(d.focusStart, d.focusEnd, smooth(0, d.diveEnd, e));
      fadeNear = 0.32 * x;
      fadeFar = x + 9.3;
      const u = smooth(d.stage3Start, 1, e);
      const g = HUB[0] * u;
      const h = HUB[2] * u;
      const m: Vec3 = [g, -p, h];
      eye = [g, -p + x * Math.cos(c), h + x * Math.sin(c)];
      fwd = norm([m[0] - eye[0], m[1] - eye[1], m[2] - eye[2]]);
      right = norm(cross(fwd, [0, 0, 1]));
      up = cross(fwd, right);
      const roll = ((d.rollEnd * Math.PI) / 180) * smooth(0.5, 0.92, e);
      if (roll) {
        const cs = Math.cos(roll);
        const sn = Math.sin(roll);
        const a0 = right;
        right = [cs * a0[0] - sn * up[0], cs * a0[1] - sn * up[1], cs * a0[2] - sn * up[2]];
        up = [sn * a0[0] + cs * up[0], sn * a0[1] + cs * up[1], sn * a0[2] + cs * up[2]];
      }
    };

    const draw = (time: number, prog: number, orb: number, dt: number) => {
      const o = clamp(prog, 0, 1);
      tilt = 3.5 * sy * (1 - smooth(0.005, 0.03, o)) * sActive;
      {
        const a =
          -(0.05 * smooth(0.5, 0, clamp(Math.hypot(sx, sy), 0, 1))) *
          (smooth(0.47, 0.495, o) * (1 - smooth(0.505, 0.53, o))) *
          sActive;
        const s = ringScale.length - 1;
        for (let e = 0; e < ringScale.length; e++) {
          const r = 1 + a * (1 + (s - e) * 0.55);
          const i = 0.18 + 0.07 * e;
          ringScale[e] += (r - ringScale[e]) * (1 - Math.exp(-dt / i));
        }
      }
      camera(o);
      const d = smooth(0.97, 0.995, o) * sActive;
      offX = d > 0.001 ? (sx * right[0] - sy * up[0]) * 0.42 * d : 0;
      offZ = d > 0.001 ? (sx * right[2] - sy * up[2]) * 0.42 * d : 0;
      const funnelA = 1 - smooth(0.2, 0.26, o);
      const particleA = 1 - smooth(0.2, 0.25, o);
      const orbitDotA = smooth(0.23, 0.32, o);
      const diamA = smooth(0.3, 0.4, o);
      const dropA = smooth(0.32, 0.42, o);
      const pulseA = smooth(0.33, 0.49, o);
      const k = smooth(0.5, 0.74, o);
      const arcA = smooth(0.5, 0.88, o);
      const hubRingsA = smooth(0.7, 0.87, o);
      const satA = smooth(0.74, 0.89, o);
      const hubA = smooth(0.72, 0.88, o);
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      if (funnelA > 0.01) {
        const alpha = funnelA;
        items.length = 0;
        let prev: (Pt | null)[] | null = null;
        for (let s = 0; s < 24; s++) {
          const r = spokeEase(s / 24);
          if (funnelRadius(r) < 0.02) break;
          const i = spokeEase((s + 1) / 24);
          const n = prev ?? ringAt(r);
          const l = ringAt(i);
          pushFills(items, n, l, alpha);
          prev = l;
        }
        for (const a of RINGS) {
          const s = 0.5 * alpha * ringFade(a);
          const rgb = shadeAt(a);
          let i = project(funnelPoint(a, 0));
          for (let t = 1; t <= 96; t++) {
            const n = project(funnelPoint(a, (t / 96) * TAU));
            if (i && n) pushLine(items, i, n, s * ((i.fade + n.fade) / 2), rgb);
            i = n;
          }
        }
        for (let a = 0; a < 16; a++) {
          const s = (a / 16) * TAU;
          let r = spokeEase(0);
          let i = project(funnelPoint(r, s));
          let n = spokeFade(r);
          for (let b = 1; b <= 56; b++) {
            const l = spokeEase(b / 56);
            const p = project(funnelPoint(l, s));
            const f = spokeFade(l);
            if (i && p) {
              const avg = (i.fade * n + p.fade * f) / 2;
              pushLine(items, i, p, 0.42 * alpha * avg, shadeAt((r + l) / 2));
            }
            i = p;
            r = l;
            n = f;
          }
        }
        if (particleA > 0.01) {
          for (let s = 0; s < 12; s++) {
            const r = (((5 * s) % 16) / 16) * TAU;
            const i = (0.07 * time + s / 12) % 1;
            const n = project(funnelPoint(i, r));
            if (n) items.push({ aHead: i, angle: r, depth: n.z - 0.6, head: n, kind: "particle", opacity: particleA });
          }
        }
        items.sort((e, t) => t.depth - e.depth);
        ctx.lineCap = "butt";
        const fill = `rgba(${bgRgb},${alpha.toFixed(3)})`;
        cache.lastFill = "";
        cache.lastStroke = "";
        for (const it of items) drawItem(it, fill);
        ctx.lineCap = "round";
        ctx.globalCompositeOperation = "source-over";
      }

      if (diamA > 0.01) {
        ctx.setLineDash([3, 6]);
        for (let a = 0; a < 4; a++) {
          const s = (a / 4) * Math.PI;
          const r = 6 * Math.cos(s);
          const i = 6 * Math.sin(s);
          const n = clamp(5 * k - a, 0, 1);
          polyline([project([-r, -7.5, -i]), project([r, -7.5, i])], DASH_RGB, diamA * (1 - n));
        }
        ctx.setLineDash([]);
      }

      if (pulseA > 0.001) {
        const s = PULSE_RINGS.length;
        const r = time - dropLanded;
        for (let i = 0; i < s; i++) {
          const n = clamp(pulseA * s - i, 0, 1);
          const l = (1 - clamp(k * s - i, 0, 1)) * n;
          if (l <= 0.004) continue;
          const p = pulse((r - 0.12 * i) / 0.55);
          pulseRing(i, l * (1 + 2 * p), 1 + 0.045 * p);
        }
      }

      if (arcA > 0.004) {
        const t = parallax(3);
        const a = ORBIT_ANGLE + Math.PI + 2;
        const s = Math.max(2, Math.ceil(128 * arcA));
        const pts: (Pt | null)[] = [];
        for (let i = 0; i <= s; i++) {
          const n = a - (i / s) * TAU * arcA;
          pts.push(hubPoint(ORBITS[3], n, offX * t, offZ * t));
        }
        fadedStroke(pts, LINE_RGB, 0.42);
      }

      if (hubRingsA > 0.01) {
        const t = ORBITS.length;
        for (let a = 1; a < t - 1; a++) {
          if (a === 3) continue;
          const p = parallax(a);
          fadedStroke(hubRing(ORBITS[a], offX * p, offZ * p), LINE_RGB, 0.42 * hubRingsA);
        }
        const s = parallax(t - 1);
        ctx.setLineDash([4, 7]);
        fadedStroke(hubRing(ORBITS[t - 1], offX * s, offZ * s), LINE_RGB, 0.42 * hubRingsA);
        ctx.setLineDash([]);
      }

      if (!(satA <= 0.01)) {
        ctx.fillStyle = `rgba(${WHITE_RGB},${satA.toFixed(3)})`;
        for (const t of SATELLITES) {
          const s = ORBITS[t.ring];
          const r = parallax(t.ring);
          const i = hubPoint(s, t.phase + 0.34 * time * (ORBITS[0] / s), offX * r, offZ * r);
          if (i) {
            ctx.beginPath();
            ctx.arc(i.x, i.y, 1.4, 0, TAU);
            ctx.fill();
          }
        }
      }

      if (hubA > 0.01) {
        const t = project([HUB[0] + offX, HUB[1], HUB[2] + offZ]);
        if (t) {
          const s = (0.72 * focal) / t.z;
          ctx.fillStyle = `rgba(${bgRgb},${hubA.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, s, 0, TAU);
          ctx.fill();
          ctx.strokeStyle = `rgba(${LINE_RGB},${0.85 * hubA})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      drop: {
        const r = dropA * (1 - clamp((k - 0.25) / 0.6, 0, 1));
        if (r <= 0.01) break drop;
        const i = project([0, -7.5, 0]);
        if (!i) break drop;
        const n = 0.46 * H;
        const top = i.y - n;
        polyline(
          [
            { fade: 1, x: i.x, y: top, z: 1 },
            { fade: 1, x: i.x, y: i.y, z: 1 },
          ],
          DASH_RGB,
          r,
          1,
        );
        const cyc = time % 3;
        const c = Math.min(cyc / 2.2, 1);
        if (dropProgress < 1 && c >= 1) dropLanded = time;
        dropProgress = c;
        let x = r;
        if (cyc >= 2.2) {
          const e = clamp((cyc - 2.2) / 0.4, 0, 1);
          if (e >= 1) break drop;
          x = r * (1 - e);
        }
        const p = top + c * n;
        const u = Math.max(top, p - 0.5 * n);
        if (p - u > 0.5) {
          const g = ctx.createLinearGradient(i.x, u, i.x, p);
          g.addColorStop(0, `rgba(${WHITE_RGB},0)`);
          g.addColorStop(1, `rgba(${WHITE_RGB},${x.toFixed(3)})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(i.x, u);
          ctx.lineTo(i.x, p);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${WHITE_RGB},${x.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(i.x, p, 1.5, 0, TAU);
        ctx.fill();
      }

      if (orbitDotA > 0.01) {
        const rr = ORBITS[3];
        const i = ORBIT_ANGLE + Math.PI + orb;
        const n = parallax(3);
        const l = project([HUB[0] + offX * n + rr * Math.cos(i), -7.5, HUB[2] + offZ * n + rr * Math.sin(i)]);
        if (l) {
          const size = lerp(7, 1.4, smooth(0.7, 0.84, o));
          ctx.fillStyle = `rgba(${WHITE_RGB},${orbitDotA.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(l.x, l.y, size, 0, TAU);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "destination-in";
      const T = ctx.createLinearGradient(0, 0, 0, H);
      T.addColorStop(0, "rgba(0,0,0,0)");
      T.addColorStop(0.2, "rgba(0,0,0,1)");
      T.addColorStop(0.9, "rgba(0,0,0,1)");
      T.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = T;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1e3) : 0.016;
      last = now;
      const target = clamp(progressRef.current?.get() ?? 1, 0, 1);
      if (smoothed < 0) smoothed = target;
      smoothed += (target - smoothed) * (1 - Math.exp(-dt / 0.1));
      const d = 1 - Math.exp(-dt / 0.18);
      sx += (px - sx) * d;
      sy += (py - sy) * d;
      sActive += (pActive - sActive) * d;
      const c = cameraRef.current;
      if (smoothed < c.stage3Start) orbit = 0;
      orbit += dt * orbitSpeed * smooth(0.98, 1, smooth(c.stage3Start, 1, smoothed));
      draw(now / 1e3, smoothed, orbit, dt);
      if (running) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(host);
    const onScroll = () => {
      hostRect = null;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    hoverMq.addEventListener("change", syncPointer);
    reduceMq.addEventListener("change", syncPointer);
    const sync = () => {
      const on = visible && !document.hidden;
      if (on && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!on && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "100px" },
    );
    io.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      hoverMq.removeEventListener("change", syncPointer);
      reduceMq.removeEventListener("change", syncPointer);
    };
  }, []);

  return (
    <div className={className ? `relative h-full w-full ${className}` : "relative h-full w-full"}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
