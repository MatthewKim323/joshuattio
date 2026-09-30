"use client";
import { useAnimationFrame } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Ray constants.
const FADE_DISTANCE = 160;
const MAX_BRIGHTNESS = 1;
const MAX_LENGTH = 360;
const MIN_BRIGHTNESS = 0.4;
const MIN_LENGTH = 120;
const RESPAWN_DELAY_MAX = 1500;
const RESPAWN_DELAY_MIN = 260;
const SPEED = 240;
const SPEED_SCALE_MAX = 1.3;
const SPEED_SCALE_MIN = 0.75;
export const SIGNAL_MAX_WIDTH = 2;
export const SIGNAL_MIN_WIDTH = 1;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

type Ray = { brightness: number; dormantUntil: number; length: number; speedScale: number; width: number; x: number; y: number };

type Props = {
  color: string;
  count: number;
  direction: "up" | "down";
  easeDistance: number;
  gridAlignment: "start" | "center";
  initialSpawn: "distributed" | "staggered";
  maxWidth: number;
  minSpeedFactor: number;
  minWidth: number;
  peakOpacity: number;
  terminusFromBottom: number;
  /** Inline background string for each ray (defaults to a vertical fade through `color`). */
  background?: string;
};

function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Thin light streaks on the 8px stripe grid that travel up or down and respawn. */
export function SignalRays({ color, count, direction, easeDistance, gridAlignment, initialSpawn, maxWidth, minSpeedFactor, minWidth, peakOpacity, terminusFromBottom, background }: Props) {
  const reduced = useReducedMotionPref();
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const rays = useRef<Ray[]>([]);
  const size = useRef({ height: 0, width: 0 });
  const visible = useRef(false);
  const last = useRef(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) size.current = { height: r.height, width: r.width };
    });
    ro.observe(el);
    const io = new IntersectionObserver((entries) => { visible.current = entries[0]?.isIntersecting ?? false; }, { rootMargin: "200px" });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  function spawn(ray: Ray, where: "mid" | "edge") {
    const { height, width } = size.current;
    const cols = Math.max(1, Math.floor(width / 8));
    ray.x = gridAlignment === "center" ? (((width / 2) % 8) + 8) % 8 + 8 * Math.floor(rand(0, cols)) : 8 * Math.round(rand(0, cols));
    ray.length = rand(MIN_LENGTH, MAX_LENGTH);
    ray.width = rand(minWidth, maxWidth);
    ray.brightness = rand(MIN_BRIGHTNESS, MAX_BRIGHTNESS);
    ray.speedScale = rand(SPEED_SCALE_MIN, SPEED_SCALE_MAX);
    if (direction === "down") {
      ray.y = where === "mid" ? rand(-ray.length, height - terminusFromBottom) : rand(-(2.5 * ray.length), -ray.length);
      return;
    }
    ray.y = where === "mid" ? rand(-ray.length, height) : rand(height, height + 1.5 * ray.length);
  }

  function paint(ray: Ray, el: HTMLDivElement, opacity: number) {
    const scaleY = ray.length / MAX_LENGTH;
    const t = `translate3d(${ray.x - ray.width / 2}px, ${ray.y}px, 0)`;
    el.style.transform = minWidth === maxWidth ? `${t} scaleY(${scaleY})` : `${t} scaleX(${ray.width / maxWidth}) scaleY(${scaleY})`;
    el.style.opacity = opacity.toFixed(3);
  }

  useAnimationFrame((time) => {
    const { height, width } = size.current;
    if (reduced || !visible.current || width === 0 || height === 0) {
      last.current = time;
      return;
    }
    if (rays.current.length === 0) {
      rays.current = Array.from({ length: count }, (_, i) => {
        const ray: Ray = { brightness: 1, dormantUntil: 0, length: MAX_LENGTH, speedScale: 1, width: maxWidth, x: 0, y: 0 };
        const staggered = initialSpawn === "staggered" && i > 0;
        spawn(ray, staggered ? "edge" : "mid");
        if (staggered) ray.dormantUntil = time + rand(RESPAWN_DELAY_MIN, RESPAWN_DELAY_MAX);
        return ray;
      });
    }
    const dt = Math.min((time - last.current) / 1000, 0.05);
    last.current = time;
    for (let i = 0; i < rays.current.length; i++) {
      const el = els.current[i];
      const ray = rays.current[i];
      if (!el || !ray) continue;
      if (ray.dormantUntil > time) {
        el.style.opacity = "0";
        continue;
      }
      if (direction === "down") {
        const end = size.current.height - terminusFromBottom;
        const k = easeDistance > 0 ? clamp01((end - ray.y) / easeDistance) : 1;
        ray.y += SPEED * ray.speedScale * (minSpeedFactor + k * k * (3 - 2 * k) * (1 - minSpeedFactor)) * dt;
        if (ray.y > end) {
          spawn(ray, "edge");
          ray.dormantUntil = time + rand(RESPAWN_DELAY_MIN, RESPAWN_DELAY_MAX);
          el.style.opacity = "0";
          continue;
        }
        const enter = clamp01((ray.y + ray.length) / ray.length);
        const exit = clamp01((end - ray.y) / FADE_DISTANCE);
        paint(ray, el, peakOpacity * ray.brightness * enter * exit);
        continue;
      }
      ray.y -= SPEED * ray.speedScale * dt;
      if (ray.y + ray.length < 0) {
        spawn(ray, "edge");
        ray.dormantUntil = time + rand(RESPAWN_DELAY_MIN, RESPAWN_DELAY_MAX);
        el.style.opacity = "0";
        continue;
      }
      const enter = clamp01((size.current.height - ray.y) / ray.length);
      const exit = clamp01((ray.y + ray.length) / FADE_DISTANCE);
      paint(ray, el, peakOpacity * ray.brightness * enter * exit);
    }
  });

  return (
    <div ref={boxRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {!reduced && Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          ref={(el) => { els.current[i] = el; }}
          style={{
            background: background ?? `linear-gradient(to bottom, transparent, ${color} 50%, transparent)`,
            height: `${MAX_LENGTH}px`,
            left: "0px",
            opacity: "0",
            position: "absolute",
            top: "0px",
            transformOrigin: "0px 0px",
            width: `${maxWidth}px`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
