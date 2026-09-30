"use client";

import { useEffect, useRef } from "react";
import { useAnimationFrame } from "motion/react";

const SIGNAL_FADE_DISTANCE = 160;
const SIGNAL_MAX_BRIGHTNESS = 1;
const SIGNAL_MAX_LENGTH = 360;
const SIGNAL_MIN_BRIGHTNESS = 0.4;
const SIGNAL_MIN_LENGTH = 120;
const SIGNAL_RESPAWN_DELAY_MAX = 1500;
const SIGNAL_RESPAWN_DELAY_MIN = 260;
const SIGNAL_SPEED = 240;
const SIGNAL_SPEED_SCALE_MAX = 1.3;
const SIGNAL_SPEED_SCALE_MIN = 0.75;

type Ray = { brightness: number; dormantUntil: number; length: number; speedScale: number; width: number; x: number; y: number };

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Rising 1px light streaks snapped to the 8px stripe grid ("up" direction,
// centered grid alignment, staggered initial spawn).
export function SignalRays({
  color,
  count,
  peakOpacity,
  width = 1,
  shouldReduceMotion,
}: {
  color: string;
  count: number;
  peakOpacity: number;
  width?: number;
  shouldReduceMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const rays = useRef<Ray[]>([]);
  const size = useRef({ height: 0, width: 0 });
  const visible = useRef(false);
  const last = useRef(0);

  useEffect(() => {
    const el = root.current;
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

  function spawn(r: Ray, where: "mid" | "edge") {
    const { height: h, width: w } = size.current;
    const cols = Math.max(1, Math.floor(w / 8));
    r.x = ((((w / 2) % 8) + 8) % 8) + 8 * Math.floor(rand(0, cols));
    r.length = rand(SIGNAL_MIN_LENGTH, SIGNAL_MAX_LENGTH);
    r.width = rand(width, width);
    r.brightness = rand(SIGNAL_MIN_BRIGHTNESS, SIGNAL_MAX_BRIGHTNESS);
    r.speedScale = rand(SIGNAL_SPEED_SCALE_MIN, SIGNAL_SPEED_SCALE_MAX);
    r.y = where === "mid" ? rand(-r.length, h) : rand(h, h + 1.5 * r.length);
  }

  function paint(r: Ray, el: HTMLDivElement, opacity: number) {
    const sy = r.length / SIGNAL_MAX_LENGTH;
    el.style.transform = `translate3d(${r.x - r.width / 2}px, ${r.y}px, 0) scaleY(${sy})`;
    el.style.opacity = opacity.toFixed(3);
  }

  useAnimationFrame((t) => {
    const { height: h, width: w } = size.current;
    if (shouldReduceMotion || !visible.current || w === 0 || h === 0) {
      last.current = t;
      return;
    }
    if (rays.current.length === 0) {
      rays.current = Array.from({ length: count }, (_, i) => {
        const r: Ray = { brightness: 1, dormantUntil: 0, length: SIGNAL_MAX_LENGTH, speedScale: 1, width, x: 0, y: 0 };
        const staggered = i > 0;
        spawn(r, staggered ? "edge" : "mid");
        if (staggered) r.dormantUntil = t + rand(SIGNAL_RESPAWN_DELAY_MIN, SIGNAL_RESPAWN_DELAY_MAX);
        return r;
      });
    }
    const dt = Math.min((t - last.current) / 1000, 0.05);
    last.current = t;
    for (let i = 0; i < rays.current.length; i++) {
      const el = els.current[i];
      if (!el) continue;
      const r = rays.current[i];
      if (r.dormantUntil > t) {
        el.style.opacity = "0";
        continue;
      }
      r.y -= SIGNAL_SPEED * r.speedScale * dt;
      if (r.y + r.length < 0) {
        spawn(r, "edge");
        r.dormantUntil = t + rand(SIGNAL_RESPAWN_DELAY_MIN, SIGNAL_RESPAWN_DELAY_MAX);
        el.style.opacity = "0";
        continue;
      }
      const tail = clamp01((size.current.height - r.y) / r.length);
      const head = clamp01((r.y + r.length) / SIGNAL_FADE_DISTANCE);
      paint(r, el, peakOpacity * r.brightness * tail * head);
    }
  });

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {!shouldReduceMotion &&
        Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              els.current[i] = el;
            }}
            style={{
              background: `linear-gradient(to bottom, transparent, ${color} 50%, transparent)`,
              height: SIGNAL_MAX_LENGTH,
              left: 0,
              opacity: 0,
              position: "absolute",
              top: 0,
              transformOrigin: "0 0",
              width,
              willChange: "transform, opacity",
            }}
          />
        ))}
    </div>
  );
}
