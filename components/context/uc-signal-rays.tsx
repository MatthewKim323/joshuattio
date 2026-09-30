"use client";
import { useEffect, useMemo, useRef } from "react";
import { useAnimationFrame } from "motion/react";

export const SIGNAL_FADE_DISTANCE = 160;
export const SIGNAL_MAX_BRIGHTNESS = 1;
export const SIGNAL_MAX_LENGTH = 360;
export const SIGNAL_MAX_WIDTH = 2;
export const SIGNAL_MIN_BRIGHTNESS = 0.4;
export const SIGNAL_MIN_LENGTH = 120;
export const SIGNAL_MIN_WIDTH = 1;
export const SIGNAL_RESPAWN_DELAY_MAX = 1500;
export const SIGNAL_RESPAWN_DELAY_MIN = 260;
export const SIGNAL_SPEED = 240;
export const SIGNAL_SPEED_SCALE_MAX = 1.3;
export const SIGNAL_SPEED_SCALE_MIN = 0.75;

type Ray = {
  brightness: number;
  dormantUntil: number;
  length: number;
  speedScale: number;
  width: number;
  x: number;
  y: number;
};

const clamp01 = (e: number) => (e < 0 ? 0 : e > 1 ? 1 : e);
const rand = (e: number, t: number) => e + Math.random() * (t - e);

/** Falling hairline light streaks snapped to the 8px stripe grid. */
export function UcSignalRays({
  color,
  count,
  direction,
  easeDistance,
  gridAlignment,
  initialSpawn,
  maxWidth,
  minSpeedFactor,
  minWidth,
  peakOpacity,
  shouldReduceMotion,
  terminusFromBottom,
}: {
  color: string;
  count: number;
  direction: "down" | "up";
  easeDistance: number;
  gridAlignment: "start" | "center";
  initialSpawn: "distributed" | "staggered";
  maxWidth: number;
  minSpeedFactor: number;
  minWidth: number;
  peakOpacity: number;
  shouldReduceMotion?: boolean | null;
  terminusFromBottom: number;
}) {
  const reduce = shouldReduceMotion === true;
  const ids = useMemo(() => Array.from({ length: count }, (_e, t) => t), [count]);
  const rootRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const rays = useRef<Ray[]>([]);
  const size = useRef({ height: 0, width: 0 });
  const visible = useRef(false);
  const lastT = useRef(0);
  const terminus = useRef(terminusFromBottom);
  useEffect(() => {
    terminus.current = terminusFromBottom;
  }, [terminusFromBottom]);

  const spawn = (e: Ray, where: "mid" | "edge") => {
    const { height: a, width: i } = size.current;
    const l = Math.max(1, Math.floor(i / 8));
    e.x = gridAlignment === "center" ? ((((i / 2) % 8) + 8) % 8) + 8 * Math.floor(rand(0, l)) : 8 * Math.round(rand(0, l));
    e.length = rand(SIGNAL_MIN_LENGTH, SIGNAL_MAX_LENGTH);
    e.width = rand(minWidth, maxWidth);
    e.brightness = rand(SIGNAL_MIN_BRIGHTNESS, SIGNAL_MAX_BRIGHTNESS);
    e.speedScale = rand(SIGNAL_SPEED_SCALE_MIN, SIGNAL_SPEED_SCALE_MAX);
    if (direction === "down") {
      e.y = where === "mid" ? rand(-e.length, a - terminus.current) : rand(-(2.5 * e.length), -e.length);
      return;
    }
    e.y = where === "mid" ? rand(-e.length, a) : rand(a, a + 1.5 * e.length);
  };
  const paint = (e: Ray, node: HTMLDivElement, opacity: number) => {
    const r = e.length / SIGNAL_MAX_LENGTH;
    const i = `translate3d(${e.x - e.width / 2}px, ${e.y}px, 0)`;
    node.style.transform = minWidth === maxWidth ? `${i} scaleY(${r})` : `${i} scaleX(${e.width / maxWidth}) scaleY(${r})`;
    node.style.opacity = opacity.toFixed(3);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) size.current = { height: r.height, width: r.width };
    });
    ro.observe(el);
    const io = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useAnimationFrame((now) => {
    const { height: H, width: W } = size.current;
    if (reduce || !visible.current || W === 0 || H === 0) {
      lastT.current = now;
      return;
    }
    if (rays.current.length === 0) {
      rays.current = ids.map((t) => {
        const a: Ray = {
          brightness: 1,
          dormantUntil: 0,
          length: SIGNAL_MAX_LENGTH,
          speedScale: 1,
          width: maxWidth,
          x: 0,
          y: 0,
        };
        const staggered = initialSpawn === "staggered" && t > 0;
        spawn(a, staggered ? "edge" : "mid");
        if (staggered) a.dormantUntil = now + rand(SIGNAL_RESPAWN_DELAY_MIN, SIGNAL_RESPAWN_DELAY_MAX);
        return a;
      });
    }
    const dt = Math.min((now - lastT.current) / 1e3, 0.05);
    lastT.current = now;
    for (let t = 0; t < rays.current.length; t++) {
      const node = nodes.current[t];
      if (!node) continue;
      const e = rays.current[t];
      if (e.dormantUntil > now) {
        node.style.opacity = "0";
        continue;
      }
      if (direction === "down") {
        const end = size.current.height - terminus.current;
        const l = easeDistance > 0 ? clamp01((end - e.y) / easeDistance) : 1;
        e.y += SIGNAL_SPEED * e.speedScale * (minSpeedFactor + l * l * (3 - 2 * l) * (1 - minSpeedFactor)) * dt;
        if (e.y > end) {
          spawn(e, "edge");
          e.dormantUntil = now + rand(SIGNAL_RESPAWN_DELAY_MIN, SIGNAL_RESPAWN_DELAY_MAX);
          node.style.opacity = "0";
          continue;
        }
        const c = clamp01((e.y + e.length) / e.length);
        const f = clamp01((end - e.y) / SIGNAL_FADE_DISTANCE);
        paint(e, node, peakOpacity * e.brightness * c * f);
        continue;
      }
      e.y -= SIGNAL_SPEED * e.speedScale * dt;
      if (e.y + e.length < 0) {
        spawn(e, "edge");
        e.dormantUntil = now + rand(SIGNAL_RESPAWN_DELAY_MIN, SIGNAL_RESPAWN_DELAY_MAX);
        node.style.opacity = "0";
        continue;
      }
      const l = clamp01((size.current.height - e.y) / e.length);
      const c = clamp01((e.y + e.length) / SIGNAL_FADE_DISTANCE);
      paint(e, node, peakOpacity * e.brightness * l * c);
    }
  });

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {!reduce &&
        ids.map((a) => (
          <div
            key={a}
            ref={(el) => {
              nodes.current[a] = el;
            }}
            style={{
              background: `linear-gradient(to bottom, transparent, ${color} 50%, transparent)`,
              height: SIGNAL_MAX_LENGTH,
              left: 0,
              opacity: 0,
              position: "absolute",
              top: 0,
              transformOrigin: "0 0",
              width: maxWidth,
              willChange: "transform, opacity",
            }}
          />
        ))}
    </div>
  );
}
