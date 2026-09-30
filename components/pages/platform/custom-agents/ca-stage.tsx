"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  animate,
  motion,
  motionValue,
  useInView,
  useMotionValueEvent,
  useSpring,
  type AnimationPlaybackControls,
  type AnimationPlaybackControlsWithThen,
  type MotionValue,
} from "motion/react";
import { HeartIcon, NoteIcon, ReportIcon, TurnRightIcon } from "./ca-icons";

// Agents hero: four draggable workflow cards wired by rounded connector paths.
// On entry the dotted grid opens, cards fade in one by one and the connectors draw;
// then a green run travels card to card (travel, running, done), rests, fades and loops.

type Tone = "blue" | "cyan" | "pink" | "yellow";
type Agent = { icon: ReactNode; prompt: string; title: string; tone: Tone };
type Status = "ready" | "running" | "complete";
type Point = { x: number; y: number };
type Phase = "travel" | "running" | "done" | "rest" | "reset" | "idle";

const TONES: Record<Tone, string> = {
  blue: "border-[oklch(0.9187_0.0390_261.52)] bg-[oklch(0.9474_0.0249_263.33)] text-[oklch(0.4975_0.1752_261.14)]",
  cyan: "border-[oklch(0.9322_0.0342_215.02)] bg-[oklch(0.9597_0.0292_218.18)] text-[oklch(0.4936_0.0908_223.27)]",
  pink: "border-[oklch(0.9276_0.0391_351.42)] bg-[oklch(0.9593_0.0215_351.90)] text-[oklch(0.5158_0.1918_3.00)]",
  yellow: "border-[oklch(0.9272_0.0936_90.21)] bg-[oklch(0.9638_0.0522_92.93)] text-[oklch(0.4784_0.1089_63.21)]",
};

const AGENTS: Agent[] = [
  { icon: <ReportIcon />, prompt: "Find your next best customer.", title: "Lead scoring agent", tone: "blue" },
  { icon: <TurnRightIcon />, prompt: "Get every lead to the right person.", title: "Lead routing agent", tone: "cyan" },
  { icon: <NoteIcon />, prompt: "Walk into every call with context.", title: "Meeting prep agent", tone: "yellow" },
  { icon: <HeartIcon />, prompt: "Spot the signals. Stay a step ahead.", title: "Customer health agent", tone: "pink" },
];

const SPRING = { damping: 38, mass: 0.7, stiffness: 550 };

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function CompletedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
      <path className="stroke-[oklch(0.5854_0.1336_158.40)]" strokeLinecap="round" strokeLinejoin="round" d="M3 5.7 3.7 7c.5.7.7 1 1 1.2h.8c.3-.1.5-.5 1-1.2L9 3" />
    </svg>
  );
}

function Port({ className }: { className: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="4.8" fill="var(--color-primary-background)" strokeWidth="1" className="stroke-blue-500" />
      <circle cx="6" cy="6" r="4.8" fill="var(--color-primary-background)" strokeWidth="1" className="custom-agents-port-active stroke-green-500 opacity-0" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="4.5" className="stroke-default-stroke" />
      <path className="stroke-tertiary-foreground" strokeLinecap="round" d="M6 10.5a4.5 4.5 0 0 0 0-9" />
    </svg>
  );
}

function WorkflowCard({ className, agent }: { className: string; agent: Agent }) {
  const border = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const el = border.current;
    if (!el) return;
    const draw = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.querySelector("path")?.setAttribute(
        "d",
        `M ${w / 2} .5 H ${w - 12} A 11.5 11.5 0 0 1 ${w - 0.5} 12 V ${h - 12} A 11.5 11.5 0 0 1 ${w - 12} ${h - 0.5} H 12 A 11.5 11.5 0 0 1 .5 ${h - 12} V 12 A 11.5 11.5 0 0 1 12 .5 Z`,
      );
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={cx("relative flex items-center justify-center rounded-xl bg-surface shadow-xs", className)}>
      <svg ref={border} className="custom-agents-border" aria-hidden="true">
        <path pathLength="1" />
      </svg>
      <div className="custom-agents-status-running absolute right-0 flex items-center gap-x-1 rounded-lg border border-subtle-stroke bg-surface-subtle px-1.25 py-px opacity-0">
        <SpinnerIcon className="animate-spin" />
        <span className="text-tertiary-foreground text-xs">{"Running"}</span>
      </div>
      <div className="custom-agents-status-completed absolute right-0 flex items-center gap-x-1 rounded-lg border border-[oklch(0.9267_0.0643_153.23)] bg-[oklch(0.9561_0.0404_153.14)] px-1.25 py-px opacity-0">
        <CompletedIcon />
        <span className="text-[oklch(0.5854_0.1336_158.40)] text-xs">{"Completed"}</span>
      </div>
      <div className="relative h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-[11px] bg-primary-background px-3.25 pt-3.25 pb-2.75">
        <div className="flex items-center gap-2 pb-1.75">
          <div className={cx("flex size-6 shrink-0 items-center justify-center rounded-[7px] border", TONES[agent.tone])}>{agent.icon}</div>
          <span className="flex-1 truncate text-primary-foreground text-sm">{agent.title}</span>
        </div>
        <p className="truncate text-[13px] text-black-800">{agent.prompt}</p>
      </div>
      <Port className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5.5px]" />
      <Port className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5.5px]" />
    </div>
  );
}

type HandleProps = {
  "aria-describedby": string;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onLostPointerCapture: () => void;
  onPointerCancel: () => void;
  onPointerDown: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
  tabIndex: number;
};

function AgentCard({ agent, status, selected, handleProps }: { agent: Agent; status: Status; selected: boolean; handleProps: HandleProps }) {
  return (
    <div className="custom-agents-card" data-status={status} data-selected={selected}>
      <WorkflowCard agent={agent} className={cx("custom-agents-workflow", status !== "ready" && "custom-agents-workflow-active")} />
      <button type="button" className="custom-agents-handle" aria-label={`Move ${agent.title}`} aria-pressed={selected} {...handleProps} />
    </div>
  );
}

function AgentPosition({
  children,
  index,
  lifted,
  selected,
  reducedMotion,
  target,
  onMove,
  ref,
}: {
  children: ReactNode;
  index: number;
  lifted: boolean;
  selected: boolean;
  reducedMotion: boolean;
  target: { x: MotionValue<number>; y: MotionValue<number> };
  onMove: (index: number, p: Point) => void;
  ref: Ref<HTMLDivElement>;
}) {
  const sx = useSpring(target.x, SPRING);
  const sy = useSpring(target.y, SPRING);
  const x = reducedMotion ? target.x : sx;
  const y = reducedMotion ? target.y : sy;
  const report = () => onMove(index, { x: x.get(), y: y.get() });
  useMotionValueEvent(x, "change", report);
  useMotionValueEvent(y, "change", report);
  return (
    <motion.div ref={ref} data-agent-card data-agent-index={index} data-selected={selected || lifted} className="custom-agents-position" style={{ x, y }}>
      <motion.div animate={{ scale: lifted && !reducedMotion ? 1.025 : 1 }} transition={reducedMotion ? { duration: 0 } : { type: "spring", ...SPRING }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// Rounded orthogonal path through points (corner radius up to 20).
function roundedPath(points: Point[]) {
  const first = points[0];
  if (!first) return "";
  let d = `M ${first.x} ${first.y}`;
  for (let t = 1; t < points.length - 1; t++) {
    const r = points[t - 1];
    const i = points[t];
    const l = points[t + 1];
    const n = Math.hypot(i.x - r.x, i.y - r.y);
    const s = Math.hypot(l.x - i.x, l.y - i.y);
    const o = Math.min(20, n / 2, s / 2);
    if (!n || !s) continue;
    const a = { x: i.x + ((r.x - i.x) * o) / n, y: i.y + ((r.y - i.y) * o) / n };
    const c = { x: i.x + ((l.x - i.x) * o) / s, y: i.y + ((l.y - i.y) * o) / s };
    d += ` L ${a.x} ${a.y} Q ${i.x} ${i.y} ${c.x} ${c.y}`;
  }
  const last = points.at(-1);
  if (last) d += ` L ${last.x} ${last.y}`;
  return d;
}

type Segment = {
  animation: AnimationPlaybackControlsWithThen | null;
  fill: number;
  frozen: boolean;
  progress: number;
  start: number;
  version: number;
};

function useResolvedReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function CustomAgentsStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const settled = useRef(false);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const progressPaths = useRef<(SVGPathElement | null)[]>([]);
  const lengths = useRef<number[]>([]);
  const loop = useRef<{ duration: number; elapsed: number; index: number; phase: Phase }>({
    duration: 700,
    elapsed: 0,
    index: 0,
    phase: "travel",
  });
  const connPaths = useRef<(SVGPathElement | null)[]>([]);
  const offsets = useRef<Point[]>(AGENTS.map(() => ({ x: 0, y: 0 })));
  const lastFree = useRef<Point[]>(AGENTS.map(() => ({ x: 0, y: 0 })));
  const drag = useRef<{ index: number; offset: Point; start: Point } | null>(null);
  const moved = useRef(false);
  const [targets] = useState(() => AGENTS.map(() => ({ x: motionValue(0), y: motionValue(0) })));
  const segments = useRef<Segment[]>(
    Array.from({ length: AGENTS.length + 1 }, () => ({ animation: null, fill: 0, frozen: false, progress: 0, start: 0, version: 0 })),
  );
  const [lifted, setLifted] = useState<number | null>(null);
  const describedBy = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [step, setStep] = useState<{ index: number; phase: Phase }>({ index: 0, phase: "travel" });
  const reduced = useResolvedReducedMotion();
  const inView = useInView(stage, { amount: 0.15 });

  const paint = useCallback((e: number) => {
    const t = segments.current[e];
    const a = connPaths.current[e];
    const r = progressPaths.current[e];
    if (!a || !r) return;
    a.style.strokeDasharray = `${t.progress} 1`;
    a.style.strokeDashoffset = `${-t.start}`;
    const i = Math.max(0, Math.min(t.start + t.progress, t.fill) - t.start);
    r.style.strokeDasharray = `${i} 1`;
    r.style.strokeDashoffset = `${-t.start}`;
  }, []);

  const route = useCallback(() => {
    const el = stage.current;
    if (!el) return;
    const boxes = cards.current.map((c, t) => {
      if (!c) return { bottom: 0, top: 0, x: 0 };
      const o = offsets.current[t];
      return { bottom: c.offsetTop + o.y + c.offsetHeight, top: c.offsetTop + o.y, x: c.offsetLeft + o.x + c.offsetWidth / 2 };
    });
    const [a, r, i, l] = boxes;
    if (!a || !r || !i || !l) return;
    const n = (a.bottom + r.top) / 2;
    const o = (i.top + l.bottom) / 2;
    const d = Math.min(el.clientHeight - 20, Math.max(r.bottom, i.bottom) + 40);
    const lines: Point[][] = [
      [{ x: a.x, y: -100 }, { x: a.x, y: a.top }],
      [{ x: a.x, y: a.bottom }, { x: a.x, y: n }, { x: r.x, y: n }, { x: r.x, y: r.top }],
      [{ x: r.x, y: r.bottom }, { x: r.x, y: d }, { x: i.x, y: d }, { x: i.x, y: i.bottom }],
      [{ x: i.x, y: i.top }, { x: i.x, y: o }, { x: l.x, y: o }, { x: l.x, y: l.bottom }],
      [{ x: l.x, y: l.top }, { x: l.x, y: -100 }],
    ];
    lines.forEach((pts, t) => {
      const p = connPaths.current[t];
      if (!p || segments.current[t].frozen) return;
      const dd = roundedPath(pts);
      p.setAttribute("d", dd);
      lengths.current[t] = p.getTotalLength();
      progressPaths.current[t]?.setAttribute("d", dd);
    });
  }, []);

  const place = useCallback(
    (e: number, t: Point) => {
      const el = stage.current;
      const card = cards.current[e];
      if (!el || !card) return;
      const i = Math.max(12 - card.offsetLeft, Math.min(el.clientWidth - card.offsetLeft - card.offsetWidth - 12, t.x));
      const l = Math.max(16 - card.offsetTop, Math.min(el.clientHeight - card.offsetTop - card.offsetHeight - 24, t.y));
      const blockers = copy.current?.firstElementChild?.children;
      const box = el.getBoundingClientRect();
      const left = box.left + card.offsetLeft + i;
      const top = box.top + card.offsetTop + l;
      const hit = Array.from(blockers ?? []).some((b) => {
        const r = b.getBoundingClientRect();
        return left < r.right + 12 && left + card.offsetWidth > r.left - 12 && top < r.bottom + 12 && top + card.offsetHeight > r.top - 12;
      });
      if (!hit) lastFree.current[e] = { x: i, y: l };
      const p = hit && drag.current?.index !== e ? lastFree.current[e] : { x: i, y: l };
      targets[e].x.set(p.x);
      targets[e].y.set(p.y);
    },
    [targets],
  );

  const onMove = useCallback(
    (e: number, t: Point) => {
      offsets.current[e] = t;
      route();
    },
    [route],
  );

  // Hide (retract) or restore one connector while its card is lifted.
  function morph(e: number, t: number, restore: boolean) {
    const seg = segments.current[t];
    if (!connPaths.current[t]) return;
    const version = ++seg.version;
    const n = +(!restore && t !== e);
    const s = restore ? 1 : n;
    const duration = restore ? 0.45 : 0.65;
    const run = () => {
      if (version !== seg.version) return;
      seg.animation?.stop();
      seg.frozen = !restore;
      route();
      const from = seg.start;
      const to = from + seg.progress;
      const step = (a: number) => {
        seg.start = from + (n - from) * a;
        seg.progress = to + (s - to) * a - seg.start;
        paint(t);
      };
      if (reduced) step(1);
      else seg.animation = animate(0, 1, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: step });
    };
    if (restore && seg.animation && seg.frozen) seg.animation.then(run);
    else run();
  }

  function morphPair(e: number, restore: boolean) {
    morph(e, e, restore);
    morph(e, e + 1, restore);
  }

  function release(e: number) {
    if (drag.current?.index !== e) return;
    drag.current = null;
    place(e, { x: targets[e].x.get(), y: targets[e].y.get() });
    setLifted(null);
    morphPair(e, true);
    if (moved.current) setSelected(null);
  }

  const reset = useCallback(() => {
    offsets.current = AGENTS.map(() => ({ x: 0, y: 0 }));
    lastFree.current = AGENTS.map(() => ({ x: 0, y: 0 }));
    for (const t of targets) {
      t.x.set(0);
      t.y.set(0);
    }
    segments.current.forEach((seg, t) => {
      seg.version += 1;
      seg.animation?.stop();
      seg.frozen = false;
      seg.start = 0;
      if (settled.current) seg.progress = 1;
      paint(t);
    });
    drag.current = null;
    setLifted(null);
    setSelected(null);
    route();
  }, [route, targets, paint]);

  useEffect(() => {
    const segs = segments.current;
    return () => {
      for (const s of segs) {
        s.version += 1;
        s.animation?.stop();
      }
    };
  }, []);

  useLayoutEffect(() => {
    reset();
    setReady(true);
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(reset);
    ro.observe(el);
    for (const c of cards.current) if (c) ro.observe(c);
    return () => ro.disconnect();
  }, [reset]);

  // Entry: wait for the copy to finish animating in, open the grid, fade cards in, draw connectors.
  useEffect(() => {
    if (!ready || !inView || entered) return;
    if (reduced) {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      grid.current?.style.removeProperty("--custom-agents-grid-radius");
      for (const c of cards.current) c?.style.removeProperty("opacity");
      stage.current?.style.setProperty("--custom-agents-connections-opacity", "1");
      segments.current.forEach((seg, t) => {
        seg.progress = 1;
        paint(t);
      });
      settled.current = true;
      setEntered(true);
      return;
    }
    let cancelled = false;
    let current: AnimationPlaybackControls | null = null;
    function tween(duration: number, onUpdate: (v: number) => void, ease: "easeOut" | "linear" = "easeOut") {
      if (cancelled) return Promise.resolve();
      current = animate(0, 1, { duration, ease, onUpdate });
      return current;
    }
    const pending = (copy.current?.getAnimations({ subtree: true }) ?? []).filter(
      (a) => a.effect?.getComputedTiming().iterations !== Infinity,
    );
    const list = cards.current.filter((c): c is HTMLDivElement => c !== null);
    async function run() {
      await Promise.allSettled(pending.map((a) => a.finished));
      if (cancelled) return;
      await tween(0.3, (v) => {
        grid.current?.style.setProperty("--custom-agents-grid-radius", `${150 * v}%`);
      });
      for (const c of list)
        await tween(0.12, (v) => {
          c.style.opacity = `${v}`;
        });
      stage.current?.style.setProperty("--custom-agents-connections-opacity", "1");
      for (const [t, seg] of segments.current.entries())
        await tween(
          Math.max(0.18, Math.min(0.45, (lengths.current[t] ?? 0) / 2400)),
          (v) => {
            seg.progress = v;
            paint(t);
          },
          "linear",
        );
      if (!cancelled) {
        settled.current = true;
        setEntered(true);
      }
    }
    stage.current?.style.setProperty("--custom-agents-connections-opacity", "0");
    grid.current?.style.setProperty("--custom-agents-grid-radius", "0%");
    for (const c of list) c.style.opacity = "0";
    segments.current.forEach((seg, t) => {
      seg.progress = 0;
      paint(t);
    });
    run().catch((err) => {
      if (!cancelled) throw err;
    });
    return () => {
      cancelled = true;
      current?.stop();
    };
  }, [ready, inView, entered, reduced, paint]);

  // Run loop: travel along a connector, run the card, complete, next; rest, fade, idle, repeat.
  useEffect(() => {
    if (!ready || !entered || !inView || lifted !== null) return;
    let raf = 0;
    let last: number | null = null;
    function onVisibility() {
      last = null;
      stage.current?.setAttribute("data-paused", `${document.hidden || !inView || lifted !== null}`);
    }
    function advance() {
      const s = loop.current;
      switch (s.phase) {
        case "travel":
          s.phase = s.index === AGENTS.length ? "rest" : "running";
          s.duration = ({ rest: 3e3, running: 2500 } as Record<string, number>)[s.phase];
          break;
        case "running":
          s.phase = "done";
          s.duration = 450;
          break;
        case "done":
          s.phase = "travel";
          s.index += 1;
          s.duration = Math.max(650, Math.min(1400, (lengths.current[s.index] ?? 0) / 0.7));
          break;
        case "rest":
          s.phase = "reset";
          s.duration = 700;
          break;
        case "reset":
          s.phase = "idle";
          s.duration = 200;
          segments.current.forEach((seg, t) => {
            seg.fill = 0;
            paint(t);
          });
          break;
        case "idle":
          s.phase = "travel";
          s.index = 0;
          s.duration = 700;
          stage.current?.style.setProperty("--workflow-color-opacity", "1");
      }
      s.elapsed = 0;
      setStep({ index: s.index, phase: s.phase });
    }
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(function tick(now) {
      const s = loop.current;
      const waiting = s.phase === "travel" && segments.current[s.index].progress < 1;
      if (document.hidden || waiting) {
        last = null;
        raf = requestAnimationFrame(tick);
        return;
      }
      if (last !== null) s.elapsed += now - last;
      last = now;
      const o = Math.min(1, s.elapsed / s.duration);
      if (s.phase === "travel") {
        segments.current[s.index].fill = o;
        paint(s.index);
      }
      if (s.phase === "reset") stage.current?.style.setProperty("--workflow-color-opacity", `${1 - o * o * (3 - 2 * o)}`);
      if (o === 1) advance();
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, entered, inView, lifted, paint]);

  return (
    <div
      ref={stage}
      data-agents-hero
      data-ready={ready}
      data-entered={entered}
      data-reduced-motion={reduced}
      data-paused={!inView || lifted !== null}
      className="custom-agents-stage"
      onClick={(e) => {
        if (selected === null || !(e.target instanceof Element) || e.target.closest("button, a, header, [data-agent-card]")) return;
        const card = cards.current[selected];
        if (!card) return;
        const box = e.currentTarget.getBoundingClientRect();
        place(selected, {
          x: e.clientX - box.left - card.offsetLeft - card.offsetWidth / 2,
          y: e.clientY - box.top - card.offsetTop - card.offsetHeight / 2,
        });
        setSelected(null);
      }}
    >
      <div ref={grid} aria-hidden="true" className="custom-agents-grid" />
      <div ref={copy} className="custom-agents-copy">
        {children}
      </div>
      <div className="custom-agents-artwork">
        <svg className="custom-agents-connections" aria-hidden="true">
          {Array.from({ length: AGENTS.length + 1 }, (_, a) => (
            <path
              key={a}
              ref={(el) => {
                connPaths.current[a] = el;
              }}
              fill="none"
              pathLength={1}
              className="custom-agents-connection"
            />
          ))}
          <g className="custom-agents-progress">
            {Array.from({ length: AGENTS.length + 1 }, (_, a) => (
              <path
                key={a}
                ref={(el) => {
                  progressPaths.current[a] = el;
                }}
                fill="none"
                pathLength={1}
                className="custom-agents-connection-progress"
              />
            ))}
          </g>
        </svg>
        {AGENTS.map((agent, a) => (
          <AgentPosition
            key={agent.title}
            ref={(el) => {
              cards.current[a] = el;
            }}
            index={a}
            selected={selected === a}
            lifted={lifted === a}
            reducedMotion={reduced}
            target={targets[a]}
            onMove={onMove}
          >
            <AgentCard
              agent={agent}
              status={
                step.phase === "idle"
                  ? "ready"
                  : a < step.index || (a === step.index && step.phase === "done")
                    ? "complete"
                    : a === step.index && step.phase === "running"
                      ? "running"
                      : "ready"
              }
              selected={selected === a}
              handleProps={{
                "aria-describedby": describedBy,
                onClick: () => {
                  if (!moved.current) setSelected((s) => (s === a ? null : a));
                  moved.current = false;
                },
                onKeyDown: (e) => {
                  if (e.key === "Escape") {
                    setSelected(null);
                    return;
                  }
                  if (e.key === "Home") {
                    e.preventDefault();
                    place(a, { x: 0, y: 0 });
                    return;
                  }
                  const dir = ({
                    ArrowDown: { x: 0, y: 1 },
                    ArrowLeft: { x: -1, y: 0 },
                    ArrowRight: { x: 1, y: 0 },
                    ArrowUp: { x: 0, y: -1 },
                  } as Record<string, Point | undefined>)[e.key];
                  if (!dir) return;
                  e.preventDefault();
                  const stepPx = e.shiftKey ? 32 : 16;
                  const cur = offsets.current[a];
                  place(a, { x: cur.x + dir.x * stepPx, y: cur.y + dir.y * stepPx });
                },
                onLostPointerCapture: () => release(a),
                onPointerCancel: () => {
                  if (drag.current) place(a, drag.current.offset);
                  release(a);
                  setSelected(null);
                },
                onPointerDown: (e) => {
                  if (e.button !== 0 || !e.isPrimary) return;
                  moved.current = false;
                  drag.current = { index: a, offset: { ...offsets.current[a] }, start: { x: e.clientX, y: e.clientY } };
                  setLifted(a);
                  morphPair(a, false);
                  e.currentTarget.setPointerCapture(e.pointerId);
                },
                onPointerMove: (e) => {
                  const d = drag.current;
                  if (!d || d.index !== a) return;
                  const dx = e.clientX - d.start.x;
                  const dy = e.clientY - d.start.y;
                  if (!moved.current && Math.hypot(dx, dy) < 4) return;
                  if (!moved.current) setSelected(a);
                  moved.current = true;
                  place(a, { x: d.offset.x + dx, y: d.offset.y + dy });
                },
                onPointerUp: () => release(a),
                tabIndex: entered || reduced ? 0 : -1,
              }}
            />
          </AgentPosition>
        ))}
      </div>
      <p id={describedBy} className="sr-only">
        {"Drag an agent to move it, or select it and click a space to place it. Use arrow keys to move, Home to restore its position, and Escape to deselect."}
      </p>
    </div>
  );
}
