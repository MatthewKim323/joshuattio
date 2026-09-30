"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ACTIVITY_LEVELS, ACTIVITY_PRS, ACTIVITY_START } from "./activity-data";
import { useScramble } from "./use-scramble";

const easeOutCubic = (e: number) => 1 - (1 - e) ** 3;
const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);
const SCRAMBLE = { ignore: [] as string[], overdrive: false, overflow: true, scramble: 8, speed: 0.5, step: 1 };

const DAY = 86400000;
const START = Date.parse(`${ACTIVITY_START}T00:00:00.000Z`);
const DATA = ACTIVITY_PRS.map((pullRequests, i) => ({
  date: new Date(START + i * DAY),
  pullRequests,
  activityLevel: ACTIVITY_LEVELS[i],
}));
const MAX_DIGITS = Math.max(...ACTIVITY_PRS).toString().length;

const MONTH = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const DAY_MONTH = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", timeZone: "UTC" });
const ORDINAL = new Intl.PluralRules("en-US", { type: "ordinal" });
const SUFFIX: Record<string, string> = { one: "st", two: "nd", few: "rd", other: "th" };

function useIsTouchScreen() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setTouch(mq.matches);
    const on = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return touch;
}

function Summary({ date, pullRequests }: { date: Date; pullRequests: number }) {
  const day = date.getUTCDate();
  const { ref: prsRef } = useScramble<HTMLPreElement>({ text: pullRequests.toString().padStart(MAX_DIGITS, "0"), ...SCRAMBLE });
  const { ref: monthRef } = useScramble<HTMLPreElement>({ text: MONTH.format(date), ...SCRAMBLE });
  const { ref: dayRef } = useScramble<HTMLPreElement>({
    text: `${day.toString().padStart(2, "0")}${SUFFIX[ORDINAL.select(day)]}`,
    ...SCRAMBLE,
  });
  return (
    <div className="relative border border-black-100/5 backdrop-blur-xs dark:border-white-100/5" style={{ borderRadius: "8px" }}>
      <div
        className="overflow-hidden bg-primary-background shadow-joshuattio-5 dark:bg-secondary-background"
        style={{ borderRadius: "calc(8px - 1px)", padding: "6px" }}
      >
        <p className="sr-only">
          {`${pullRequests} ${pullRequests === 1 ? "pull request" : "pull requests"} on ${DAY_MONTH.format(date)}`}
        </p>
        <div
          aria-hidden="true"
          className="relative w-[12em] whitespace-nowrap px-1 text-center font-mono text-tertiary-foreground text-xs uppercase *:inline-block"
        >
          <pre ref={prsRef} />
          {` ${pullRequests === 1 ? "PR" : "PRs"} on `}
          <pre ref={monthRef} />
          {" "}
          <pre ref={dayRef} />
        </div>
      </div>
    </div>
  );
}

/** Contribution grid: cells fade in when it scrolls into view; hovering a cell shows its day. */
export function ActivityGrid({ className }: { className?: string }) {
  const probe = useRef<HTMLDivElement>(null);
  const inView = useInView(probe, { amount: 0.6, once: true });
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const touch = useIsTouchScreen();
  const cols = Math.ceil(DATA.length / 7);
  const col = typeof active === "number" ? Math.floor(active / 7) + 1 : null;
  const row = typeof active === "number" ? (active % 7) + 1 : null;
  const [jitter] = useState(() => DATA.map(() => 0.1 * Math.random()));

  return (
    <div
      className={`relative grid grid-flow-col grid-rows-7${className ? ` ${className}` : ""}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div ref={probe} className="invisible absolute inset-y-0 w-px" />
      {DATA.map((d, i) => (
        <motion.div
          key={d.date.toISOString()}
          animate={{ opacity: +!!inView }}
          transition={{ delay: 0.002 * i + jitter[i], duration: 0.6, ease: easeOutCubic }}
          className="p-0.25 opacity-0"
          onMouseEnter={() => setActive(i)}
        >
          <div className="aspect-square rounded-[30%]" style={{ backgroundColor: `var(--color-black-${d.activityLevel})` }} />
        </motion.div>
      ))}
      {!touch && (
        <motion.div
          layout="position"
          className="pointer-events-none absolute bottom-1/2 left-1/2 z-10 flex size-0 items-center justify-center"
          style={{ gridColumn: `${col} / span 1`, gridRow: `${row} / span 1` }}
          transition={{ damping: 20, mass: 0.5, stiffness: 100, type: "spring" }}
        >
          <motion.div
            className="absolute"
            style={{
              transform:
                col && row && cols
                  ? `translateX(${50 - ((col - 1) / (cols - 1)) * 100}%) translateY(${50 - ((row - 1) / 6) * 100}%)`
                  : "translateX(-50%) translateY(-50%)",
            }}
          >
            <AnimatePresence>
              {hovering && active !== null && (
                <motion.div
                  layout="position"
                  initial={{ filter: "blur(2px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  exit={{ filter: "blur(2px)", opacity: 0 }}
                  transition={{ ease: easeInOutCubic }}
                >
                  <Summary date={DATA[active].date} pullRequests={DATA[active].pullRequests} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
