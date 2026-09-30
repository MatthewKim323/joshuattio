"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";

// Hero run: every 2500ms the next card gets `workflows-hero-card`, which starts its CSS
// border trace (conic gradient) plus the Running / Completed badge and connection dot keyframes.
// The connectors between cards fade to green and sweep a gradient pulse on their own delays.
export function WfHeroGrid({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (step < 3) setStep(step + 1);
      else clearInterval(id);
    }, 2500);
    const card = ref.current?.children[step];
    if (step <= 3) card?.classList.add("workflows-hero-card");
    return () => clearInterval(id);
  }, [step]);
  return (
    <div ref={ref} style={{ "--duration": "2500ms" } as CSSProperties} className={className}>
      {children}
    </div>
  );
}

const STOPS = (end: string) => (
  <>
    <stop stopColor="#0FC27B" stopOpacity="0" />
    <stop stopColor="#0FC27B" />
    <stop offset={end} stopColor="#0FC27B" stopOpacity="0" />
  </>
);

function GreenPath({ d, delay }: { d: string; delay: number }) {
  return (
    <motion.path
      stroke="#0FC27B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d={d}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay, duration: 0.5 } }}
    />
  );
}

type Grad = { x1: number[]; x2: number[]; y1: number[]; y2: number[] };

function Pulse({ id, d, delay, duration, from, to, end = "1" }: { id: string; d: string; delay: number; duration: number; from: { x1: number; x2: number; y1: number; y2: number }; to: Grad; end?: string }) {
  return (
    <>
      <path stroke={`url(#${id})`} strokeLinecap="round" strokeWidth="1.5" d={d} />
      <defs>
        <motion.linearGradient id={id} gradientUnits="userSpaceOnUse" initial={from} animate={to} transition={{ delay, duration }}>
          {STOPS(end)}
        </motion.linearGradient>
      </defs>
    </>
  );
}

const V_D = "m1 64 5 5 5-5M6 1v67";
/** Straight vertical connector (desktop + mobile). */
export function PulseVertical({ className, delay, id }: { className: string; delay: number; id: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="12" height="70" fill="none" viewBox="0 0 12 70">
      <path stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={V_D} />
      <GreenPath d={V_D} delay={delay + 1} />
      <Pulse id={id} d={V_D} delay={delay} duration={3.3} from={{ x1: 0, x2: 0, y1: 0, y2: 0 }} to={{ x1: [0, -180], x2: [0, -60], y1: [-270, -45], y2: [-270, -90] }} />
    </svg>
  );
}

const H_D = "m56 11 5-5-5-5M1 6h59";
/** Horizontal connector (tablet). */
export function PulseHorizontal({ className, delay, id }: { className: string; delay: number; id: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="100%" height="12" fill="none" viewBox="0 0 62 12" preserveAspectRatio="none">
      <path stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={H_D} />
      <GreenPath d={H_D} delay={delay + 1} />
      <Pulse id={id} d={H_D} delay={delay} duration={3} from={{ x1: 0, x2: 0, y1: 0, y2: 0 }} to={{ x1: [0, 180], x2: [0, 90], y1: [-50, -25], y2: [-100, -50] }} />
    </svg>
  );
}

const B_D = "m1 125 5 5 5-5M191 1v44c0 11-9 20-20 20H26C15 65 6 74 6 85v44";
/** Right-to-left elbow connector (tablet, second hop). */
export function PulseElbow({ className, delay, id }: { className: string; delay: number; id: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 192 131" preserveAspectRatio="none">
      <path stroke="#D1D3D6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d={B_D} />
      <GreenPath d={B_D} delay={delay + 1} />
      <Pulse id={id} d={B_D} delay={delay} duration={3} end="10" from={{ x1: 0, x2: 0, y1: -131, y2: -131 }} to={{ x1: [0, -384], x2: [0, -192], y1: [-131, -65.5], y2: [-262, -131] }} />
    </svg>
  );
}

type Connection = { path: string; width: number; height: number; classNameConnection: string; isStraight?: boolean };
/** Branch connector sized by its viewBox; straight variant sweeps faster. */
export function PulseConnection({ delay, id, connection }: { delay: number; id: string; connection: Connection }) {
  const { path, width: n, height: s, classNameConnection, isStraight = false } = connection;
  const to = isStraight
    ? { x1: [0, -(5 * n * 2)], x2: [0, -(5 * n)], y1: [-s / 2, -s / 4], y2: [-s, -s / 2] }
    : { x1: [0, -(2 * n)], x2: [0, -n], y1: [-s, -s / 2], y2: [-(2 * s), -s] };
  return (
    <svg className={classNameConnection} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox={`0 0 ${n} ${s}`} preserveAspectRatio="none">
      <path stroke="#D1D3D6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d={path} />
      <motion.path
        stroke="#0FC27B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d={path}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: delay + 0.8, duration: 0.5 } }}
      />
      <Pulse id={id} d={path} delay={delay} duration={isStraight ? 1.5 : 2.8} from={{ x1: 0, x2: 0, y1: 0, y2: 0 }} to={to} />
    </svg>
  );
}
