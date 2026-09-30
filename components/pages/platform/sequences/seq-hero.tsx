"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";

type Stage = "created" | "follow-up" | "booked" | "completed";

// Column offset per latest stage.
const OFFSET: Record<Stage, number> = { booked: -360, completed: -360, created: 0, "follow-up": -180 };
const PER_DAY = 1 / 4;

function cx(...p: (string | false | null | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

function DashedLine({ className }: { className?: string }) {
  return (
    <svg width="100%" height="1" className={cx("text-subtle-stroke", className)}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
    </svg>
  );
}

// Light beam that runs around the card border along a rounded-rect offset path.
function BorderBeam({ className, size, transition }: { className: string; size: number; transition: Transition }) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cx("absolute aspect-square bg-transparent", className)}
        style={{ offsetPath: `rect(0 auto auto 0 round ${size}px)`, width: size }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={transition}
      />
    </div>
  );
}

function Card({ children, isAnimated }: { children: ReactNode; isAnimated: boolean }) {
  return (
    <div
      className="relative mx-auto w-full max-w-lg rounded-xl bg-primary-background transition duration-300"
      style={{
        boxShadow: [
          isAnimated ? "inset 0px 0px 0px 1px rgba(24, 37, 62, 0.2)" : "inset 0px 0px 0px 1px rgba(24, 37, 62, 0.12)",
          "0px 29px 12px 0px rgba(24, 37, 62, 0.00)",
          "0px 16px 10px 0px rgba(24, 37, 62, 0.01)",
          "0px 7px 7px 0px rgba(24, 37, 62, 0.02)",
          "0px 2px 4px 0px rgba(24, 37, 62, 0.02)",
        ].join(", "),
      }}
    >
      <BorderBeam
        className={cx("bg-linear-to-l from-transparent via-blue-400 to-transparent transition-opacity duration-300", isAnimated ? "opacity-100" : "opacity-0 delay-600")}
        size={100}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      />
      <div className="px-3 pt-2.5 pb-3">{children}</div>
    </div>
  );
}

function dayLabel(tick: number) {
  const d = Math.floor(tick * PER_DAY);
  switch (d) {
    case 0:
      return "Today";
    case 1:
      return "Yesterday";
    default:
      return `${d} days ago`;
  }
}

// Relative timestamp that rolls up to its next value.
function Stamp({ tick }: { tick: number }) {
  const label = dayLabel(tick);
  return (
    <span className="mr-0.5 inline-flex items-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]">
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.14, ease: "easeInOut" }}
          className="inline-block text-accent-foreground text-xs"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Placeholder text bar that grows from a 16px stub to its width.
function Bar({ isAnimated, width, delay = 0 }: { isAnimated: boolean; width: number; delay?: number }) {
  const [jitter] = useState(() => 0.3 * Math.random());
  return (
    <motion.div
      initial={{ opacity: 0.6, width: 16 }}
      animate={isAnimated ? { opacity: 1, width } : { opacity: 0.6, width: 16 }}
      transition={{ delay: delay + jitter, duration: 0.6, ease: "easeOut" }}
      className="h-4 w-60 max-w-full rounded-full bg-white-300"
    />
  );
}

function Connector({ on, delay }: { on: boolean; delay: number }) {
  return (
    <motion.span
      initial={{ scaleY: 0 }}
      animate={on ? { scaleY: 1 } : { scaleY: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className="my-2.5 block h-6.5 w-px origin-top rounded-full bg-white-700"
    />
  );
}

function FadeLine({ on, className }: { on: boolean; className: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}>
      <DashedLine className={className} />
    </motion.div>
  );
}

// Hero sequence: a 125ms clock (0..20) enrolls the contact, sends the welcome
// email, waits, sends next steps, then books the meeting; the column scrolls
// up as stages land and the whole stack settles 200px higher at the end.
export function SeqHero() {
  const [tick, setTick] = useState(0);
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      if (tick >= 20) clearInterval(id);
      else setTick((t) => t + 1);
    }, 125);
    return () => clearInterval(id);
  }, [tick]);

  useEffect(() => {
    const at: Partial<Record<number, Stage>> = { 0: "created", 8: "follow-up", 14: "booked", 16: "completed" };
    const s = at[tick];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s) setStages((prev) => [s, ...prev]);
  }, [tick]);

  const created = stages.includes("created");
  const followUp = stages.includes("follow-up");
  const booked = stages.includes("booked");

  return (
    <div
      className={cx(
        "pointer-events-none relative top-1/2 h-100 w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,#00000080_10%,black_95%,transparent_100%)] transition-transform delay-1400 duration-600 ease-out-cubic",
        booked ? "-translate-y-50" : "translate-y-0 max-lg:-translate-y-20",
      )}
    >
      <motion.div
        className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 opacity-25 blur-[120px]"
        initial={{ opacity: 0 }}
        animate={booked ? { opacity: 0.25 } : { opacity: 0 }}
        transition={{ delay: 2.2, duration: 0.6, ease: "easeOut" }}
      />
      <motion.div
        animate={{ y: stages[0] ? OFFSET[stages[0]] : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 flex w-full flex-col items-center pt-8"
      >
        <div className="relative w-full px-8">
          <div className="mx-auto mb-2 flex w-full max-w-lg flex-col items-start">
            <motion.div
              className="flex items-center gap-x-2 px-3 py-2"
              initial={{ opacity: 0, y: 40 }}
              animate={created ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-tertiary-foreground text-xs">{"Enrolled by"}</span>
              <div className="flex items-center gap-x-2">
                <div className="flex size-4.5 items-center justify-center rounded-md border border-[#D6E5FF] bg-[#E5EEFF] text-[#183C81]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1.25" y="1.25012" width="4" height="4" rx="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="6.75" y="6.75" width="4" height="4" rx="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 7.25V8.00084C2 9.10541 2.89543 10.0008 4 10.0008H4.75" stroke="currentColor" strokeLinecap="round" />
                    <path d="M10 4.75L10 3.99916C10 2.89459 9.10457 1.99916 8 1.99916L7.25 1.99916" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-primary-foreground text-sm">{"PQL Triage"}</span>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={created ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            <Card isAnimated={!followUp}>
              <div className="mb-2.5 flex items-center justify-between gap-x-2">
                <span className="text-primary-foreground text-sm">{"Welcome Yara"}</span>
                <Stamp tick={tick} />
              </div>
              <DashedLine />
              <div className="mt-3 flex w-full flex-col gap-y-5">
                <div className="flex flex-col gap-y-1">
                  <Bar isAnimated={created} width={240} />
                </div>
                <div className="flex flex-col gap-y-1">
                  <Bar isAnimated={created} width={460} />
                  <Bar isAnimated={created} width={148} />
                </div>
                <div className="flex flex-col gap-y-1">
                  <Bar isAnimated={created} width={460} />
                  <Bar isAnimated={created} width={496} />
                  <Bar isAnimated={created} width={300} />
                </div>
                <div className="flex flex-col gap-y-1">
                  <Bar isAnimated={created} width={128} />
                  <Bar isAnimated={created} width={64} />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        <Connector on={followUp} delay={0.25} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={followUp ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center gap-1 px-3 py-1 text-accent-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M6 3.42859V6.42859H8.57143" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
          <span className="font-medium text-xs">{"After 2 business days"}</span>
        </motion.div>
        <Connector on={followUp} delay={0.75} />
        <div className="relative w-full px-8">
          <FadeLine on={booked} className="absolute inset-x-0 top-px" />
          <FadeLine on={booked} className="absolute inset-x-0 bottom-px" />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={followUp ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}>
            <Card isAnimated={!stages.includes("completed")}>
              <div className="mb-2.5 flex items-center justify-between gap-x-2">
                <span className="text-primary-foreground text-sm">{"Next steps"}</span>
                <Stamp tick={tick - 13} />
              </div>
              <DashedLine />
              <div className="mt-3 flex w-full flex-col gap-y-1">
                <Bar isAnimated={followUp} width={140} delay={1} />
                <Bar isAnimated={followUp} width={300} delay={1} />
              </div>
            </Card>
          </motion.div>
        </div>
        <Connector on={followUp} delay={0.25} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={followUp ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center gap-1 px-3 py-1 text-accent-foreground"
        >
          <span className="font-medium text-xs">{"Completed"}</span>
        </motion.div>
        <Connector on={booked} delay={0.75} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={booked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
          className="relative flex w-full flex-col items-center px-8"
        >
          <FadeLine on={booked} className="absolute inset-x-0 top-px" />
          <FadeLine on={booked} className="absolute inset-x-0 bottom-px" />
          <div className="relative mx-auto flex items-center gap-x-4 rounded-full border border-default-stroke bg-primary-background p-2 pr-6">
            <motion.div
              animate={{ opacity: [1, 0, 0], scaleX: [1, 1.08, 1], scaleY: [1, 1.32, 1] }}
              transition={{ duration: 3, ease: "easeOut", repeat: Infinity }}
              className="absolute -inset-px rounded-full border border-default-stroke"
            />
            <motion.div
              animate={{ opacity: [1, 0, 0], scaleX: [1, 1.1, 1], scaleY: [1, 1.32, 1] }}
              className="absolute -inset-2 rounded-full border border-subtle-stroke"
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            />
            <div className="flex items-center">
              <div className="size-10 rounded-full bg-white-300 outline-2 outline-white-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Sequences Avatar" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="rounded-full" style={{ color: "transparent" }} srcSet="/img/img-aceb745093.jpg 1x, /img/img-aceb745093.jpg 2x" src="/img/img-aceb745093.jpg" />
              </div>
              <div className="-ml-2 size-10 overflow-hidden rounded-full bg-white-300 outline-2 outline-white-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Sequences Avatar" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="rounded-full" style={{ color: "transparent" }} srcSet="/img/img-88ca08103a.jpg 1x, /img/img-88ca08103a.jpg 2x" src="/img/img-88ca08103a.jpg" />
              </div>
            </div>
            <span className="text-base text-primary-foreground lg:text-lg">
              {"Booked meeting "}
              <span className="text-accent-foreground">{"with"}</span>
              {" Yara"}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
