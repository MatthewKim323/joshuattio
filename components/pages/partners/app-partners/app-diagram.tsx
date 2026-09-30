"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { RollingCount } from "./rolling-count";

// Explore-apps diagram: every 2.5s (while in view) a random source category
// sends a pulse down its connector into the hub, the hub glows, then the pulse
// continues into one or two object cards whose record counts tick up.

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function Connector({
  isActive,
  direction = "right",
  width,
  height,
  duration,
  delay,
  d,
  strokeColorStart = "#E4E7EC",
  className,
  style,
}: {
  isActive: boolean;
  direction?: "right" | "left";
  width: number | string;
  height: number | string;
  duration: number;
  delay?: number;
  d: string;
  strokeColorStart?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId();
  const t = { delay, duration };
  return (
    <svg width={width} height={height} fill="none" className={className} style={style}>
      <path d={d} stroke={strokeColorStart} />
      {isActive && (
        <>
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              x1={direction === "right" ? "0" : "100%"}
              x2={direction === "right" ? "100%" : "0"}
              y1="0"
              y2="100%"
            >
              <motion.stop initial={{ offset: "-200%" }} animate={{ offset: "100%" }} transition={t} stopColor="white" stopOpacity="0" />
              <motion.stop initial={{ offset: "-200%" }} animate={{ offset: "100%" }} transition={t} stopColor="#A3ECE9" stopOpacity="0" />
              <motion.stop initial={{ offset: "-150%" }} animate={{ offset: "125%" }} transition={t} stopColor="#A3ECE9" />
              <motion.stop initial={{ offset: "-10%" }} animate={{ offset: "150%" }} transition={t} stopColor="#709FF5" />
              <motion.stop initial={{ offset: "-10%" }} animate={{ offset: "150%" }} transition={t} stopColor="white" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
          <path d={d} stroke={`url(#${id})`} />
        </>
      )}
    </svg>
  );
}

function Source({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="relative flex items-center justify-center gap-1.5 bg-white-100" style={{ height: "35px", width: "143px" }}>
      <img alt={title} loading="lazy" width="14" height="14" decoding="async" data-nimg="1" style={{ color: "transparent" }} src={icon} />
      <p className="whitespace-nowrap font-medium text-[12px] leading-[14px] tracking-[-2%]">{title}</p>
    </div>
  );
}

function ObjectCard({ title, count, icon, className }: { title: string; count: number; icon: string; className: string }) {
  return (
    <div
      className={`relative flex w-[180px] flex-col gap-1.5 rounded-[12px] border border-[#E4E7EC] bg-[#FFFFFF] p-[9px] ${className}`}
      style={{ filter: "drop-shadow(0px 4px 4px rgba(24, 39, 75, 0.04)) drop-shadow(0px 2px 4px rgba(24, 39, 75, 0.02))" }}
    >
      <div className="flex w-full items-center gap-1.5">
        <img alt={title} loading="lazy" width="18" height="18" decoding="async" data-nimg="1" style={{ color: "transparent" }} src={icon} />
        <p className="text-[12px] leading-[16px] tracking-[-2%]">{title}</p>
        <div className="ml-auto rounded-[8px] border border-[#EEEFF1] bg-[#F4F5F6] px-1.5 py-0.5 font-medium text-[10px] leading-[14px] tracking-[-2%]">
          {"Standard"}
        </div>
      </div>
      <svg width="100%" height="1" className="text-subtle-stroke">
        <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
      </svg>
      <p className="flex items-baseline font-medium leading-3 tracking-[-2%]">
        <RollingCount value={count} className="text-[11px] text-black-300 tabular-nums" />
        <span className="text-[10px] text-black-700">{"Records"}</span>
      </p>
    </div>
  );
}

// Placeholder hub mark (the site's own monogram), sized to the 36x32 slot.
function HubMark() {
  return (
    <svg width="36" height="32" viewBox="0 0 36 32" fill="none" role="img" aria-label="Joshuattio">
      <text
        x="18"
        y="24.5"
        textAnchor="middle"
        fill="#1C1D1F"
        fontSize="26"
        fontWeight="700"
        style={{ fontFamily: "var(--font-inter-display, var(--font-inter)), sans-serif" }}
      >
        {"j"}
      </text>
    </svg>
  );
}

function Hub({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ backgroundColor: "#E4E7EC" }}
      className="rounded-[12px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        boxShadow:
          "0px 0px 0px 4px rgba(164, 173, 186, 0.08), 0px 6px 20px -2px rgba(28, 40, 64, 0.08), 0px 2px 6px 0px rgba(28, 40, 64, 0.06)",
        height: 72,
        width: 72,
      }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[12px] bg-center"
        style={{ background: "linear-gradient(#709FF5 0%, #A3ECE9 100%)", backgroundSize: "400%" }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.625, ease: easeInOutCubic }}
      >
        <div className="absolute inset-px overflow-hidden rounded-[11px] bg-white-100" />
      </motion.div>
      <div className="absolute inset-px flex items-center justify-center rounded-[11px] bg-[#FFFFFF]">
        <HubMark />
      </div>
    </motion.div>
  );
}

type Active = { hub: boolean; company: boolean; deal: boolean; workspace: boolean };
const IDLE: Active = { hub: false, company: false, deal: false, workspace: false };

// Which cards each source feeds, by source index.
const TARGETS: Array<Array<"company" | "deal" | "workspace">> = [
  ["deal", "workspace"],
  ["deal", "workspace"],
  ["deal"],
  ["company"],
  ["company", "workspace"],
  ["workspace"],
];

export function AppDiagram({ grid }: { grid: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [source, setSource] = useState(0);
  const [active, setActive] = useState<Active>(IDLE);
  const [counts, setCounts] = useState({ company: 3096, deal: 5490, workspace: 2857 });
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  useEffect(() => {
    if (!inView) return;
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.current.delete(id);
        fn();
      }, ms);
      timers.current.add(id);
    };
    const interval = setInterval(() => {
      let next = source;
      while (next === source) next = Math.floor(6 * Math.random());
      setSource(next);
      setActive(IDLE);
      later(() => setActive((a) => ({ ...a, hub: true })), 500);
      later(() => setActive((a) => ({ ...a, hub: false })), 875);
      const targets = TARGETS[next];
      later(() => setActive((a) => ({ ...a, ...Object.fromEntries(targets.map((k) => [k, true])) })), 1500);
      later(
        () =>
          setCounts((c) => ({
            ...c,
            ...Object.fromEntries(targets.map((k) => [k, c[k] + 1])),
          })),
        2500,
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [source, inView]);

  return (
    <div ref={ref} className="flex size-full items-center justify-center relative -top-2.5 lg:-top-3" data-visual-test="blackout">
      <div className="absolute inset-x-0 top-0 h-[calc(50%+12px)] bg-[#FFFFFF]" />
      <div className="relative grid scale-[70%] grid-rows-[calc(50%+12px)_calc(50%-15px)] items-center justify-items-center md:scale-100 xl:scale-90 2xl:scale-100">
        <div className="relative size-full bg-[#FFFFFF]">
          {grid}
          <div className="absolute inset-0">
            <Connector isActive={source === 0} width={108} height={72} duration={1.5} strokeColorStart="transparent" d="M0.5 0V71.5 H72" className="absolute right-1/2 bottom-0 -translate-x-[0.5px]" />
            <Connector isActive={source === 1} width={108} height={109} duration={1.5} strokeColorStart="transparent" d="M0 0.5H36 V108.5 H72" className="absolute right-1/2" style={{ bottom: 36 }} />
            <Connector isActive={source === 2} width={72} height={181} duration={1.5} strokeColorStart="transparent" d="M0 0.5H72 V180.5" className="absolute right-1/2" style={{ bottom: 36 }} />
            <Connector direction="left" isActive={source === 3} width={72} height={181} duration={1.5} strokeColorStart="transparent" d="M0.5 180V0.5 H72" className="absolute left-1/2" style={{ bottom: 36 }} />
            <Connector direction="left" isActive={source === 4} width={108} height={109} duration={1.5} strokeColorStart="transparent" d="M0 108.5H72 V0.5 H108" className="absolute left-1/2" style={{ bottom: 36 }} />
            <Connector direction="left" isActive={source === 5} width={108} height={72} duration={1.5} strokeColorStart="transparent" d="M0.5 71.5H107.5 V0" className="absolute bottom-0 left-1/2 translate-x-[0.5px]" />
          </div>
          <div className="relative flex size-full flex-col items-center justify-end" style={{ bottom: 73, gap: 37 }}>
            <div className="flex items-center justify-center" style={{ gap: 109 }}>
              <Source title="Sales engagement" icon="/img/img-6d8f9bbdc1.svg" />
              <Source title="Email & calendar" icon="/img/img-2cc2138e81.svg" />
            </div>
            <div className="flex items-center justify-center" style={{ gap: 181 }}>
              <Source title="Data warehouses" icon="/img/img-eda00ff116.svg" />
              <Source title="Customer support" icon="/img/img-917ab7eaa7.svg" />
            </div>
            <div className="flex items-center justify-center" style={{ gap: 109 }}>
              <Source title="Billing & invoicing" icon="/img/img-970f8481d0.svg" />
              <Source title="Product data" icon="/img/img-06d1650e06.svg" />
            </div>
          </div>
        </div>
        <div className="relative grid size-full grid-cols-8 grid-rows-[70px_min-content_28px_min-content] items-center justify-items-center" style={{ top: 18 }}>
          <div className="col-span-4 col-start-1 row-start-1 flex w-full -translate-x-1 justify-end">
            <Connector isActive={active.workspace} width="132" height="70" direction="left" duration={1} d="M6 70V49.34C6 42.72 11.37 37.34 18 37.34H114C120.627 37.34 126 31.97 126 25.34V0" />
          </div>
          <div className="col-span-full row-span-3 row-start-1 flex size-full justify-center">
            <Connector isActive={active.deal} width="1" height="165" duration={0.75} d="M0.5 0V165" />
          </div>
          <div className="col-span-4 col-start-5 row-start-1 flex w-full translate-x-1">
            <Connector isActive={active.company} width="132" height="70" direction="right" duration={1} d="M126 70V49.34C126 42.72 120.627 37.34 114 37.34H18C11.373 37.34 6 31.97 6 25.34V0" />
          </div>
          <ObjectCard title="Workspace" count={counts.workspace} icon="/img/img-be32c5f07d.svg" className="col-span-4 col-start-1 row-start-2" />
          <ObjectCard title="Company" count={counts.company} icon="/img/img-eb684e4363.svg" className="col-span-4 col-start-5 row-start-2" />
          <ObjectCard title="Deal" count={counts.deal} icon="/img/img-28c4a4fef9.svg" className="col-span-full row-start-4" />
        </div>
        <Hub active={active.hub} />
      </div>
    </div>
  );
}
