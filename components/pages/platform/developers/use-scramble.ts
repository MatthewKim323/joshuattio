"use client";

import { useCallback, useEffect, useRef } from "react";

// Text scramble hook: reveals `text` character by character, cycling random
// glyphs in front of the cursor. Same algorithm and defaults as the site's
// scramble helper, driven by rAF and writing straight into the ref's innerHTML.

export type ScrambleOptions = {
  playOnMount?: boolean;
  text?: string;
  speed?: number;
  seed?: number;
  step?: number;
  tick?: number;
  scramble?: number;
  chance?: number;
  overflow?: boolean;
  range?: number[];
  overdrive?: boolean | number;
  onAnimationStart?: () => void;
  onAnimationFrame?: (s: string) => void;
  onAnimationEnd?: () => void;
  ignore?: string[];
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function useScramble<T extends HTMLElement = HTMLElement>(opts: ScrambleOptions) {
  const {
    playOnMount = true,
    text = "",
    speed = 1,
    seed = 1,
    tick = 1,
    scramble = 1,
    overflow = true,
    range = [65, 125],
    onAnimationStart,
    onAnimationFrame,
    onAnimationEnd,
    ignore = [" "],
  } = opts;
  let { step = 1, chance = 1, overdrive = true } = opts;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    step = text.length;
    chance = 0;
    overdrive = false;
  }

  const ref = useRef<T | null>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const interval = 1000 / (60 * speed);
  const frame = useRef(0);
  const cursor = useRef(0);
  const control = useRef<(string | number | null | undefined)[]>([]);
  const odCursor = useRef(0);

  const keep = (ch: string | number | null | undefined, fallback: string | number | null) =>
    ignore.includes(`${ch}`) ? ch : fallback;

  const seedForward = () => {
    if (cursor.current === text.length) return;
    for (let i = 0; i < seed; i++) {
      const idx = rand(cursor.current, control.current.length);
      if (typeof control.current[idx] !== "number" && control.current[idx] !== undefined) {
        control.current[idx] = keep(control.current[idx], rand(0, 10) >= (1 - chance) * 10 ? scramble || seed : 0);
      }
    }
  };
  const stepForward = () => {
    for (let i = 0; i < step; i++) {
      if (cursor.current < text.length) {
        const idx = cursor.current;
        const on = rand(0, 10) >= (1 - chance) * 10;
        control.current[idx] = keep(text[cursor.current], on ? scramble + rand(0, Math.ceil(scramble / 2)) : 0);
        cursor.current++;
      }
    }
  };
  const resize = () => {
    if (text.length < control.current.length) {
      control.current.pop();
      control.current.splice(text.length, step);
    }
    for (let i = 0; i < step; i++) {
      if (control.current.length < text.length) control.current.push(keep(text[control.current.length + 1], null));
    }
  };
  const overdriveStep = () => {
    if (!overdrive) return;
    for (let i = 0; i < step; i++) {
      const max = Math.max(control.current.length, text.length);
      if (odCursor.current < max) {
        control.current[odCursor.current] = keep(
          text[odCursor.current],
          String.fromCharCode(typeof overdrive === "boolean" ? 95 : overdrive),
        );
        odCursor.current++;
      }
    }
  };
  const tickAll = () => {
    stepForward();
    resize();
    seedForward();
  };
  const glyph = (r: number[]) => String.fromCharCode(r.length === 2 ? rand(r[0], r[1]) : r[rand(0, r.length - 1)]);
  const draw = () => {
    if (!ref.current) return;
    let out = "";
    for (let t = 0; t < control.current.length; t++) {
      const a = control.current[t];
      switch (true) {
        case typeof a === "number" && a > 0:
          out += glyph(range);
          if (t <= cursor.current) control.current[t] = (control.current[t] as number) - 1;
          break;
        case typeof a === "string" && (t >= text.length || t >= cursor.current):
          out += a;
          break;
        case a === text[t] && t < cursor.current:
          out += text[t];
          break;
        case a === 0 && t < text.length:
          out += text[t];
          control.current[t] = text[t];
          break;
        default:
          out += "";
      }
    }
    ref.current.innerHTML = out;
    onAnimationFrame?.(out);
    if (out === text) {
      control.current.splice(text.length, control.current.length);
      onAnimationEnd?.();
      cancelAnimationFrame(raf.current);
    }
    frame.current++;
  };
  const loop = (now: number) => {
    if (!speed) return;
    raf.current = requestAnimationFrame(loop);
    overdriveStep();
    if (now - last.current > interval) {
      last.current = now;
      if (frame.current % tick === 0) tickAll();
      draw();
    }
  };
  const reset = () => {
    frame.current = 0;
    cursor.current = 0;
    odCursor.current = 0;
    if (!overflow) control.current = new Array(text.length);
  };

  // Keep the latest closures reachable from stable callbacks.
  const loopRef = useRef(loop);
  const resetRef = useRef(reset);
  const startRef = useRef(onAnimationStart);
  useEffect(() => {
    loopRef.current = loop;
    resetRef.current = reset;
    startRef.current = onAnimationStart;
  });
  const run = useCallback((t: number) => loopRef.current(t), []);

  // The loop (re)starts whenever the text changes, so new text animates in too.
  const mounted = useRef(false);
  useEffect(() => {
    resetRef.current();
    if (!mounted.current) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(run);
  }, [text, run]);

  useEffect(() => {
    mounted.current = true;
    if (!playOnMount) {
      control.current = text.split("");
      frame.current = text.length;
      cursor.current = text.length;
      odCursor.current = text.length;
      draw();
      return;
    }
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const replay = useCallback(() => {
    cancelAnimationFrame(raf.current);
    resetRef.current();
    startRef.current?.();
    raf.current = requestAnimationFrame(run);
  }, [run]);

  return { ref, replay };
}
