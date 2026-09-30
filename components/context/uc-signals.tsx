"use client";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { UcWormhole } from "./uc-wormhole";

const EASE_REVEAL = [0, 0, 0.58, 1] as const;
const EASE_SWITCH = [0.33, 1, 0.68, 1] as const;
const BLUR_REVEAL = 1.5;
const DUR_SWITCH = 0.5;
const DUR_EXIT = 0.3;
const BAND_TOP = "pt-38 max-xl:pt-28 max-lg:pt-22";

const LAYERS = [
  { id: "context", title: "Context", body: "Emails, calls, records, product usage, connected tools. All live." },
  {
    id: "agents",
    title: "Agents + automations",
    body: "An always-on revenue engine. Prospect, follow-up, research, running 24/7.",
  },
  { id: "ecosystem", title: "Ecosystem", body: "Joshuattio wherever you work. Browser, inbox, Slack, terminal, agents." },
];
const STOPS = [0, 0.5, 1];
const clamp01 = (e: number) => (e < 0 ? 0 : e > 1 ? 1 : e);
const lerp = (e: number, t: number, a: number) => e + (t - e) * a;
const travelEase = (e: number) => {
  if (e <= 0) return 0;
  if (e >= 1) return 1;
  const t = 1 / 0.78;
  if (e < 0.22) return (e * e * t) / 0.44;
  if (e > 0.78) {
    const a = 1 - e;
    return 1 - (a * a * t) / 0.44;
  }
  return t * (e - 0.11);
};

type Direction = "positive" | "negative";

function Heading({ className }: { className?: string }) {
  return (
    <div className={className ? `flex flex-col gap-6 ${className}` : "flex flex-col items-start gap-6"}>
      <p className="inline-flex h-6 items-center rounded-lg bg-blue-100 px-1.5 font-medium text-[14px] text-blue-600 leading-5 tracking-[-0.14px] dark:bg-blue-800 dark:text-blue-200">
        {"Signals"}
      </p>
      <div className="flex flex-col gap-4">
        <h2 className="text-balance font-medium text-heading-responsive-md max-w-[478px] text-white-200">
          <span>
            {"All of the signals, none of the noise."}
            {" "}
          </span>
          <span className="text-accent-foreground">{"Ready to act on."}</span>
        </h2>
      </div>
    </div>
  );
}

function SeeMore() {
  return (
    <a
      className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-outline"
      href="/context"
    >
      <span>{"See more"}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.1"
          d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5"
        />
      </svg>
    </a>
  );
}

function BarFill({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  return <motion.div className="size-full origin-left bg-accent-foreground" style={{ scaleX }} />;
}

function Bar({
  className,
  label,
  onClick,
  progress,
}: {
  className: string;
  label?: string;
  onClick?: () => void;
  progress: number | MotionValue<number>;
}) {
  const isNum = typeof progress === "number";
  const state = !isNum ? "indeterminate" : progress === 100 ? "complete" : "loading";
  const bar = (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={isNum ? progress : undefined}
      aria-valuetext={isNum ? `${Math.round(progress)}%` : undefined}
      role="progressbar"
      data-state={state}
      data-value={isNum ? progress : undefined}
      data-max="100"
      className={
        onClick
          ? `block overflow-hidden bg-subtle-stroke origin-center transition-transform duration-200 ease-out-cubic group-hover/bar:scale-y-[2.5] group-focus-visible/bar:scale-y-[2.5] ${className}`
          : `block overflow-hidden bg-subtle-stroke ${className}`
      }
    >
      {isNum ? (
        <div className="size-full origin-left bg-accent-foreground" style={{ transform: `scaleX(${progress / 100})` }} />
      ) : (
        <BarFill progress={progress} />
      )}
    </div>
  );
  if (!onClick) return bar;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group/bar relative flex w-full cursor-pointer items-center before:absolute before:inset-x-0 before:-inset-y-3.5 before:content-[''] focus-visible:outline-none"
    >
      {bar}
    </button>
  );
}

function Layer({
  active,
  layer,
  onClick,
  progress,
}: {
  active: boolean;
  layer: (typeof LAYERS)[number];
  onClick: () => void;
  progress: MotionValue<number>;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLParagraphElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <div className="flex flex-col">
      <div className="group contents">
        <p
          className={
            active
              ? "w-fit font-medium text-[18px] text-white-200 leading-[1.4] tracking-[-0.01em] lg:max-xl:text-[16px]"
              : "w-fit font-medium text-[18px] text-white-200 leading-[1.4] tracking-[-0.01em] lg:max-xl:text-[16px] joshuattio-group-hover-underline cursor-pointer"
          }
          role={active ? undefined : "button"}
          tabIndex={active ? undefined : 0}
          onClick={active ? undefined : onClick}
          onKeyDown={active ? undefined : onKeyDown}
        >
          {layer.title}
        </p>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ filter: "blur(1px)", height: 0, opacity: 0 }}
            animate={{
              filter: "blur(0px)",
              height: "auto",
              opacity: 1,
              transition: {
                ease: EASE_REVEAL,
                filter: { duration: 0.5 },
                height: { duration: 0.25 },
                opacity: { duration: 0.5 },
              },
            }}
            exit={{
              filter: "blur(1px)",
              height: 0,
              opacity: 0,
              transition: {
                ease: EASE_REVEAL,
                filter: { duration: 0.125 },
                height: { delay: 0.5 / 8, duration: 0.25 },
                opacity: { duration: 0.125 },
              },
            }}
          >
            <p className="mt-2 max-w-[360px] text-balance font-medium text-[16px] text-accent-foreground leading-[1.4] tracking-[-0.01em] lg:max-xl:text-[14px]">
              {layer.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ filter: "blur(1px)", height: 0, opacity: 0 }}
            animate={{
              filter: "blur(0px)",
              height: "auto",
              opacity: 1,
              transition: {
                delay: 0.125,
                ease: EASE_REVEAL,
                filter: { delay: 0.125, duration: 0.5 },
                height: { duration: 0.25 },
                opacity: { delay: 0.125, duration: 0.5 },
              },
            }}
            exit={{
              filter: "blur(1px)",
              height: 0,
              opacity: 0,
              transition: {
                ease: EASE_REVEAL,
                filter: { duration: 0.125 },
                height: { duration: 0.25 },
                opacity: { duration: 0.125 },
              },
            }}
          >
            <Bar progress={progress} className="mt-5 h-0.5 w-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene({
  progress,
  sceneOpacity,
  sceneScale,
}: {
  progress: MotionValue<number>;
  sceneOpacity: MotionValue<number>;
  sceneScale: MotionValue<number>;
}) {
  return (
    <motion.div className="relative h-full w-full" style={{ opacity: sceneOpacity, scale: sceneScale }}>
      <UcWormhole progress={progress} />
    </motion.div>
  );
}

function Rules() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-50">
      <div aria-hidden="true" className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-subtle-stroke" />
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-subtle-stroke" />
    </div>
  );
}

function MobileSignals({
  active,
  itemProgress,
  direction,
  onItemClick,
  progress,
  sceneOpacity,
  sceneScale,
}: {
  active: number;
  itemProgress: MotionValue<number>;
  direction: Direction;
  onItemClick: (i: number) => void;
  progress: MotionValue<number>;
  sceneOpacity: MotionValue<number>;
  sceneScale: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const layer = LAYERS[active];
  return (
    <div className={`relative z-50 flex w-full flex-col px-6 pb-32 ${BAND_TOP} lg:hidden`}>
      <Rules />
      <div className="flex flex-col items-center gap-8">
        <Heading className="items-center text-center" />
        <SeeMore />
      </div>
      <div className="relative mt-8">
        <div
          className="relative mx-auto aspect-square w-full max-w-[560px]"
          style={{
            maskImage: "radial-gradient(circle at center, #000 45%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at center, #000 45%, transparent 80%)",
          }}
        >
          <Scene progress={progress} sceneOpacity={sceneOpacity} sceneScale={sceneScale} />
        </div>
      </div>
      <div className="relative mx-auto mt-8 w-full max-w-[420px] sm:mt-16">
        <div className="flex gap-1.5">
          {LAYERS.map((l, i) => (
            <Bar
              key={l.id}
              progress={i === active ? itemProgress : 100 * Number(i < active)}
              className="h-0.5 w-full"
              label={l.title}
              onClick={() => onItemClick(i)}
            />
          ))}
        </div>
        <div className="relative mt-4 grid">
          {LAYERS.map((l) => (
            <div key={l.id} aria-hidden="true" className="invisible col-start-1 row-start-1 text-center">
              <p className="font-medium text-[18px] leading-[1.4] tracking-[-0.01em]">{l.title}</p>
              <p className="mt-2 text-balance font-medium text-[16px] leading-[1.4] tracking-[-0.01em]">{l.body}</p>
            </div>
          ))}
          <AnimatePresence initial={false}>
            <motion.div
              key={layer.id}
              initial={{
                filter: reduce ? "blur(0px)" : `blur(${BLUR_REVEAL}px)`,
                opacity: 0,
                x: reduce ? 0 : (direction === "positive" ? 1 : -1) * 12,
              }}
              animate={{
                filter: "blur(0px)",
                opacity: 1,
                transition: { duration: reduce ? 0 : DUR_SWITCH, ease: EASE_SWITCH },
                x: 0,
              }}
              exit={{
                filter: reduce ? "blur(0px)" : `blur(${BLUR_REVEAL}px)`,
                opacity: 0,
                transition: { duration: reduce ? 0 : DUR_EXIT, ease: EASE_SWITCH },
              }}
              className="col-start-1 row-start-1 text-center will-change-[transform,opacity,filter]"
            >
              <p className="font-medium text-[18px] text-white-200 leading-[1.4] tracking-[-0.01em]">{layer.title}</p>
              <p className="mt-2 text-balance font-medium text-[16px] text-accent-foreground leading-[1.4] tracking-[-0.01em]">
                {layer.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Signals block: auto-advancing layer list (5s dwell per layer) driving the funnel scene. */
export function UcSignals() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<Direction>("positive");
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const progress = useMotionValue(STOPS[0]);
  const itemProgress = useMotionValue(0);
  const sceneOpacity = useMotionValue(1);
  const sceneScale = useMotionValue(1);
  const current = useRef(0);
  const phase = useRef<"dwell" | "transition" | "wrapOut" | "wrapIn">("dwell");
  const startedAt = useRef<number | null>(null);
  const from = useRef(STOPS[0]);
  const to = useRef(STOPS[0]);
  const wrapTarget = useRef(0);

  useEffect(() => {
    if (inView) return;
    current.current = 0;
    setActive(0);
    progress.set(STOPS[0]);
    itemProgress.set(0);
    sceneOpacity.set(1);
    sceneScale.set(1);
    phase.current = "dwell";
    startedAt.current = null;
  }, [inView, progress, itemProgress, sceneOpacity, sceneScale]);

  useAnimationFrame((now) => {
    if (!inView) return;
    if (startedAt.current === null) startedAt.current = now;
    const t = now - startedAt.current;
    if (phase.current === "dwell") {
      itemProgress.set(100 * clamp01(t / 5e3));
      if (t < 5e3) return;
      itemProgress.set(0);
      startedAt.current = now;
      if (current.current === STOPS.length - 1) {
        wrapTarget.current = 0;
        setDirection("positive");
        phase.current = "wrapOut";
        return;
      }
      const next = current.current + 1;
      from.current = progress.get();
      to.current = STOPS[next];
      current.current = next;
      setDirection("positive");
      setActive(next);
      phase.current = "transition";
      return;
    }
    if (phase.current === "wrapOut") {
      const a = clamp01(t / 380);
      sceneOpacity.set(1 - a);
      sceneScale.set(lerp(1, 0.88, a));
      if (t < 380) return;
      const r = wrapTarget.current;
      sceneOpacity.set(0);
      sceneScale.set(1);
      progress.set(STOPS[r]);
      current.current = r;
      setActive(r);
      phase.current = "wrapIn";
      startedAt.current = now;
      return;
    }
    if (phase.current === "wrapIn") {
      if (t < 320) return;
      const a = clamp01((t - 320) / 380);
      sceneOpacity.set(a);
      if (a < 1) return;
      sceneOpacity.set(1);
      phase.current = "dwell";
      startedAt.current = now;
      return;
    }
    const a = clamp01(t / Math.max(1100, 6500 * Math.abs(to.current - from.current)));
    progress.set(lerp(from.current, to.current, travelEase(a)));
    if (a >= 1) {
      progress.set(to.current);
      phase.current = "dwell";
      startedAt.current = now;
    }
  });

  const onItemClick = useCallback(
    (e: number) => {
      const t = current.current;
      const a = STOPS[e];
      if (e !== t) setDirection(e > t ? "positive" : "negative");
      setActive(e);
      itemProgress.set(0);
      startedAt.current = null;
      if (Math.abs(progress.get() - a) < 0.001) {
        sceneOpacity.set(1);
        sceneScale.set(1);
        current.current = e;
        progress.set(a);
        phase.current = "dwell";
        return;
      }
      if (e < t) {
        wrapTarget.current = e;
        phase.current = "wrapOut";
        return;
      }
      sceneOpacity.set(1);
      sceneScale.set(1);
      current.current = e;
      from.current = progress.get();
      to.current = a;
      phase.current = "transition";
    },
    [progress, itemProgress, sceneOpacity, sceneScale],
  );

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative z-50 hidden lg:block">
        <div className="relative z-50">
          <div className="relative z-10 flex flex-col lg:flex-row">
            <div
              className={`flex flex-1 flex-col justify-center px-6 lg:px-[58px] ${BAND_TOP}`}
              style={{ paddingBottom: "clamp(48px,12svh,96px)" }}
            >
              <div className="flex h-140 flex-col">
                <div className="flex shrink-0 flex-col items-start gap-8">
                  <Heading />
                  <SeeMore />
                </div>
                <div className="min-h-16 flex-1" />
                <div className="flex w-full shrink-0 flex-col gap-7">
                  {LAYERS.map((l, i) => (
                    <Layer
                      key={l.id}
                      active={i === active}
                      layer={l}
                      onClick={() => onItemClick(i)}
                      progress={itemProgress}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden border-subtle-stroke border-t lg:min-h-0 lg:w-1/2 lg:border-t-0 lg:border-l lg:border-l-weak-stroke">
              <div
                className="absolute inset-0"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
                }}
              >
                <Scene progress={progress} sceneOpacity={sceneOpacity} sceneScale={sceneScale} />
              </div>
            </div>
            <Rules />
          </div>
        </div>
      </div>
      <MobileSignals
        active={active}
        itemProgress={itemProgress}
        direction={direction}
        onItemClick={onItemClick}
        progress={progress}
        sceneOpacity={sceneOpacity}
        sceneScale={sceneScale}
      />
    </div>
  );
}
