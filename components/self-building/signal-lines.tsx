"use client";

import { useEffect, useRef } from "react";
import { useAnimationFrame, useInView } from "motion/react";
import { usePrefersReducedMotion } from "./board";

const LINE_COUNT = 132;
const SIGNAL_COUNT = 5;
const SIGNAL_MAX_LENGTH = 360;
const SIGNAL_MIN_LENGTH = 120;
const SIGNAL_MAX_BRIGHTNESS = 1;
const SIGNAL_MIN_BRIGHTNESS = 0.4;
const SIGNAL_RESPAWN_DELAY_MAX = 1500;
const SIGNAL_RESPAWN_DELAY_MIN = 260;
const SIGNAL_SPEED = 240;
const SIGNAL_SPEED_SCALE_MAX = 1.3;
const SIGNAL_SPEED_SCALE_MIN = 0.75;

const LINES = Array.from({ length: LINE_COUNT }, (_, i) => i);
const SIGNALS = Array.from({ length: SIGNAL_COUNT }, (_, i) => i);
const rand = (min: number, max: number) => min + Math.random() * (max - min);

type Signal = {
  brightness: number;
  dormantUntil: number;
  length: number;
  lineIndex: number;
  speedScale: number;
  y: number;
};

const SIGNAL_STYLE = {
  background: "linear-gradient(to bottom, transparent, var(--color-black-900) 50%, transparent)",
  height: `${SIGNAL_MAX_LENGTH}px`,
  left: "0px",
  opacity: "0",
  position: "absolute",
  top: "0px",
  transformOrigin: "0px 0px",
  width: "1px",
  willChange: "transform, opacity",
} as const;

/** Band of vertical hairlines with faint pulses running down them. */
export function SignalLines() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const seen = useInView(wrapRef, { margin: "0px 0px -30% 0px", once: true });
  const visible = useInView(wrapRef);
  const active = seen && visible;
  const reduced = usePrefersReducedMotion();

  const boxRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const signals = useRef<Signal[]>([]);
  const size = useRef({ height: 0, width: 0 });
  const last = useRef(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) size.current = { height: r.height, width: r.width };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduced]);

  const spawn = (s: Signal, where: "top" | "mid") => {
    s.lineIndex = Math.round(rand(0, LINE_COUNT - 1));
    s.length = rand(SIGNAL_MIN_LENGTH, SIGNAL_MAX_LENGTH);
    s.brightness = rand(SIGNAL_MIN_BRIGHTNESS, SIGNAL_MAX_BRIGHTNESS);
    s.speedScale = rand(SIGNAL_SPEED_SCALE_MIN, SIGNAL_SPEED_SCALE_MAX);
    s.y =
      where === "mid"
        ? rand(-s.length, Math.max(size.current.height - s.length, 0))
        : rand(-(2.5 * s.length), -s.length);
  };

  const tick = (s: Signal, node: HTMLDivElement, now: number, dt: number) => {
    if (s.dormantUntil > now) {
      node.style.opacity = "0";
      return;
    }
    s.y += 0.62 * SIGNAL_SPEED * s.speedScale * dt;
    if (s.y > size.current.height) {
      spawn(s, "top");
      s.dormantUntil = now + rand(SIGNAL_RESPAWN_DELAY_MIN, SIGNAL_RESPAWN_DELAY_MAX);
      node.style.opacity = "0";
      return;
    }
    const x = (s.lineIndex / (LINE_COUNT - 1)) * size.current.width;
    const raw = (s.y + s.length) / 48;
    const fade = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    const scale = s.length / SIGNAL_MAX_LENGTH;
    node.style.transform = `translate3d(${x - 0.5}px, ${s.y}px, 0) scaleY(${scale})`;
    node.style.opacity = (0.6 * s.brightness * fade).toFixed(3);
  };

  useAnimationFrame((now) => {
    if (reduced || !active || size.current.height === 0) {
      last.current = now;
      return;
    }
    if (signals.current.length === 0) {
      signals.current = SIGNALS.map((i) => {
        const s: Signal = {
          brightness: 1,
          dormantUntil: 0,
          length: SIGNAL_MAX_LENGTH,
          lineIndex: 0,
          speedScale: 1,
          y: 0,
        };
        spawn(s, "top");
        if (i > 0) s.dormantUntil = now + rand(SIGNAL_RESPAWN_DELAY_MIN, SIGNAL_RESPAWN_DELAY_MAX);
        return s;
      });
    }
    const dt = Math.min((now - last.current) / 1000, 0.05);
    last.current = now;
    for (let i = 0; i < signals.current.length; i++) {
      const node = nodes.current[i];
      if (node) tick(signals.current[i], node, now, dt);
    }
  });

  return (
    <div ref={wrapRef}>
      <div className="pointer-events-none relative select-none h-[72px] w-full md:h-[112px]" aria-hidden="true">
        <svg
          className="block h-full w-full [mask-image:linear-gradient(to_bottom,transparent,#000)]"
          viewBox="0 0 1048 190"
          preserveAspectRatio="none"
          fill="none"
        >
          {LINES.map((i) => (
            <line key={i} x1={8 * i} y1={0} x2={8 * i} y2={190} stroke="#E6E7EA" strokeOpacity={0.85} strokeWidth={1} />
          ))}
        </svg>
        {!reduced && (
          <div
            ref={boxRef}
            className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000)]"
          >
            {SIGNALS.map((i) => (
              <div
                key={i}
                ref={(el) => {
                  nodes.current[i] = el;
                }}
                style={SIGNAL_STYLE}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
