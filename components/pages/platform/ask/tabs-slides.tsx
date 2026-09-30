"use client";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type PanInfo,
} from "motion/react";
import { cn } from "@/components/hero/cn";

/* Slides data (clicker variant, the middle slide starts selected). */
type Slide = { uid: string; title: string; widget: string; subtitle: string; description: string };
const SLIDES: Slide[] = [
  {
    uid: "fb7bf04c-9678-4b2e-a103-e4b6042c8a60",
    title: "Marketing",
    widget: "marketing",
    subtitle: "Turn every customer touchpoint into competitive advantage.",
    description: "Analyze conversion, validate messaging, and gather content for campaigns.",
  },
  {
    uid: "cd193b58-b4b8-4a6e-b1f0-2eb69c0c7d90",
    title: "Success",
    widget: "success",
    subtitle: "Retain and expand more accounts when review is effortless. ",
    description: "Hand off accounts, check customer health, and run business reviews.  ",
  },
  {
    uid: "2f8fc983-fb36-44d9-a76d-1154995ede0c",
    title: "Sales",
    widget: "sales",
    subtitle: "Win faster when every call is perfectly prepped.",
    description: "Prepare for meetings, update deals, and review pipeline.",
  },
  {
    uid: "29115ebc-45a0-4564-ad5e-2441cec70bc1",
    title: "Founders",
    widget: "founders",
    subtitle: "Build product and revenue wins with real customer insights.",
    description: "Run customer discovery, track deals, and gather product feedback.",
  },
  {
    uid: "8058284d-2f12-4fa7-9b1c-b00372a32ba9",
    title: "Venture capital",
    widget: "vc",
    subtitle: "Turn portfolio intelligence into perfectly timed investment edge.",
    description: "Research founders, leverage networks, and manage deal flow. ",
  },
];

/* ---------- click sound (procedural noise tick) ---------- */
let sharedCtx: AudioContext | null = null;
function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<Float32Array | null>(null);
  const randomness = 0.5,
    toneMix = 0,
    toneFrequency = 1500,
    attack = 0.002,
    release = 0.001,
    sustain = 0,
    highpassFrequency = 1e3,
    lowpassFrequency = 8e3,
    lowpassQ = 8,
    volume = 0.1,
    total = attack + sustain + release;
  useEffect(() => {
    // The context is created on the first user gesture so the browser never warns about autoplay.
    const unlock = () => {
      if (!sharedCtx) sharedCtx = new AudioContext();
      const e = sharedCtx;
      ctxRef.current = e;
      if (e.state === "suspended") e.resume();
      const len = Math.max(1, Math.ceil(e.sampleRate * total));
      const a = new Float32Array(len);
      let r = 12345;
      for (let i = 0; i < len; i++) {
        r = (0x41c64e6d * r + 12345) & 0x7fffffff;
        a[i] = (r / 0x7fffffff) * 2 - 1;
      }
      noiseRef.current = a;
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [total]);
  return useCallback(
    (count: number) => {
      if (count <= 0) return;
      const ctx = ctxRef.current,
        noise = noiseRef.current;
      if (!ctx || !noise) return;
      const sr = ctx.sampleRate,
        size = Math.max(1, Math.ceil(sr * total)),
        now = ctx.currentTime,
        dur = 0.3;
      for (let t = 0; t < count; t++) {
        const at = now + (count <= 1 ? 0 : t / count) * dur;
        const src = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, size, sr),
          ch = buf.getChannelData(0);
        for (let i = 0; i < size; i++) {
          const n = noise[i] * (1 - randomness) + (2 * Math.random() - 1) * randomness,
            s = Math.sin((2 * Math.PI * toneFrequency * i) / sr);
          ch[i] = n * (1 - toneMix) + s * toneMix;
        }
        src.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(volume, at + attack);
        gain.gain.linearRampToValueAtTime(0, at + total);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = lowpassFrequency;
        lp.Q.value = lowpassQ;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = highpassFrequency;
        src.connect(hp);
        hp.connect(lp);
        lp.connect(gain);
        gain.connect(ctx.destination);
        src.start(at);
        src.stop(at + total);
      }
    },
    [total],
  );
}

/* ---------- primitives ---------- */
function Line({ className, vertical, dashed }: { className?: string; vertical?: boolean; dashed?: boolean }) {
  return vertical ? (
    <svg width="1" height="100%" className={className ?? "text-subtle-stroke"}>
      <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray={dashed ? "4 6" : undefined} strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="100%" height="1" className={className ?? "text-subtle-stroke"}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray={dashed ? "4 6" : undefined} strokeLinecap="round" />
    </svg>
  );
}
function Dots({ className }: { className: string }) {
  const id = useId();
  return (
    <svg width="100%" height="100%" className={cn("text-muted-strong-background", className)}>
      <defs>
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="5.5" y="5.5" width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
function Img({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} loading="lazy" width={width} height={height} decoding="async" data-nimg="1" className={className} style={{ color: "transparent" }} srcSet={`${src} 1x`} src={src} />
  );
}
const Play12 = (p: { className?: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={p.className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.15692 2.9802C3.86361 2.81399 3.5 3.02587 3.5 3.36301V8.63681C3.5 8.97395 3.86361 9.18584 4.15693 9.01962L8.81028 6.38272C9.10771 6.21418 9.10771 5.78565 8.81028 5.6171L4.15692 2.9802ZM2.5 3.36301C2.5 2.25964 3.68998 1.5662 4.64994 2.11018L9.30329 4.74708C10.2767 5.29868 10.2767 6.70114 9.30329 7.25274L4.64994 9.88964C3.68998 10.4336 2.5 9.74018 2.5 8.63681V3.36301Z" fill="currentColor" />
  </svg>
);
const VideoCamera14 = (p: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={p.className}>
    <path d="M7 1.5C7.44539 1.5 7.72673 1.49862 7.96973 1.53711C9.25304 1.74056 10.2594 2.74697 10.4629 4.03027C10.4714 4.0841 10.4774 4.1403 10.4824 4.19922L11.1553 3.86328C11.4148 3.73349 11.6403 3.62024 11.8281 3.54688C12.0153 3.47378 12.2363 3.40997 12.4756 3.44531C12.8019 3.49357 13.094 3.67411 13.2832 3.94434C13.4218 4.14253 13.4641 4.36928 13.4824 4.56934C13.5008 4.77004 13.5 5.02245 13.5 5.3125V8.6875C13.5 8.9776 13.5008 9.22994 13.4824 9.43066C13.4641 9.63066 13.4217 9.85653 13.2832 10.0547C13.0941 10.3251 12.8021 10.5064 12.4756 10.5547C12.2363 10.59 12.0153 10.5262 11.8281 10.4531C11.6404 10.3798 11.4148 10.2665 11.1553 10.1367L10.4824 9.7998C10.4774 9.85908 10.4715 9.91561 10.4629 9.96973C10.2594 11.253 9.25305 12.2594 7.96973 12.4629C7.72673 12.5014 7.4454 12.5 7 12.5H5C4.30822 12.5 3.75934 12.5 3.31738 12.4639C2.86958 12.4273 2.48732 12.351 2.1377 12.1729C1.57348 11.8853 1.11472 11.4265 0.827148 10.8623C0.649016 10.5127 0.572719 10.1304 0.536133 9.68262C0.500031 9.24067 0.5 8.69177 0.5 8V6C0.5 5.30823 0.500028 4.75933 0.536133 4.31738C0.572721 3.8696 0.649011 3.48731 0.827148 3.1377C1.11472 2.57348 1.57348 2.11472 2.1377 1.82715C2.48732 1.64901 2.86959 1.57272 3.31738 1.53613C3.75934 1.50003 4.30822 1.5 5 1.5H7ZM5 2.5C4.29169 2.5 3.79023 2.50022 3.39844 2.53223C3.01265 2.56377 2.77691 2.62346 2.5918 2.71777C2.21555 2.9095 1.90951 3.21556 1.71777 3.5918C1.62346 3.7769 1.56377 4.01266 1.53223 4.39844C1.50022 4.79023 1.5 5.2917 1.5 6V8C1.5 8.7083 1.50022 9.20977 1.53223 9.60156C1.56376 9.98735 1.62346 10.2231 1.71777 10.4082C1.90951 10.7845 2.21555 11.0905 2.5918 11.2822C2.77691 11.3765 3.01264 11.4362 3.39844 11.4678C3.79023 11.4998 4.29168 11.5 5 11.5H7C7.48318 11.5 7.66689 11.4986 7.8125 11.4756C8.66828 11.34 9.34004 10.6683 9.47559 9.8125C9.49859 9.6669 9.5 9.48314 9.5 9V5C9.5 4.51685 9.4986 4.3331 9.47559 4.1875C9.34003 3.33173 8.66827 2.65996 7.8125 2.52441C7.66689 2.5014 7.48317 2.5 7 2.5H5ZM12.3291 4.43457C12.3502 4.43769 12.328 4.42556 12.1924 4.47852C12.0573 4.53128 11.8796 4.61926 11.6025 4.75781L10.5 5.30859V8.69043L11.6025 9.24219C11.8796 9.38071 12.0573 9.46873 12.1924 9.52148C12.3279 9.57441 12.3502 9.56231 12.3291 9.56543C12.3835 9.55739 12.4323 9.52652 12.4639 9.48145C12.4516 9.49895 12.473 9.48493 12.4863 9.33984C12.4995 9.19544 12.5 8.99725 12.5 8.6875V5.3125C12.5 5.00281 12.4995 4.80456 12.4863 4.66016C12.4731 4.51577 12.452 4.50047 12.4639 4.51758C12.4323 4.47264 12.3834 4.44259 12.3291 4.43457Z" fill="currentColor" />
  </svg>
);
const ArrowTurnDownRight14 = (p: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={p.className}>
    <path d="M2.5 2.5C2.22386 2.5 2 2.72386 2 3V6.5C2 7.88071 3.11929 9 4.5 9H9.29297L7.64648 10.6465L7.58203 10.7246C7.45387 10.9187 7.47562 11.1827 7.64648 11.3535C7.81735 11.5244 8.08131 11.5461 8.27539 11.418L8.35352 11.3535L10.8535 8.85352C10.9473 8.75975 11 8.63261 11 8.5C11 8.40056 10.9704 8.30419 10.916 8.22266L10.8535 8.14648L8.35352 5.64648C8.15825 5.45122 7.84175 5.45122 7.64648 5.64648C7.45122 5.84175 7.45122 6.15825 7.64648 6.35352L9.29297 8H4.5C3.67157 8 3 7.32843 3 6.5V3C3 2.72391 2.77607 2.50009 2.5 2.5Z" fill="currentColor" />
  </svg>
);
const Check14 = (p: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={p.className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.2649 3.07601C11.4991 3.22236 11.5703 3.53084 11.4239 3.76501L8.27903 8.79686L8.26603 8.81766C7.96584 9.29798 7.72247 9.68737 7.50209 9.9779C7.27756 10.2739 7.03718 10.5228 6.72175 10.6676C6.24572 10.8861 5.70298 10.9091 5.21014 10.7318C4.88356 10.6142 4.62295 10.3867 4.37412 10.1108C4.1299 9.83997 3.85439 9.47262 3.51455 9.01949L3.49983 8.99986L2.59994 7.80001C2.43425 7.57909 2.47902 7.26569 2.69994 7.10001C2.92085 6.93432 3.23425 6.97909 3.39994 7.20001L4.29983 8.39986C4.65789 8.87728 4.90647 9.2079 5.11672 9.44102C5.32588 9.67294 5.45274 9.75629 5.54875 9.79084C5.79517 9.87952 6.06655 9.868 6.30456 9.75874C6.3973 9.71616 6.51663 9.62236 6.70538 9.37354C6.8951 9.12343 7.11474 8.77292 7.43103 8.26686L10.5759 3.23501C10.7223 3.00084 11.0308 2.92965 11.2649 3.07601Z" fill="currentColor" />
  </svg>
);
const Globe14 = (p: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={p.className}>
    <path d="M7.33496 0.508789C10.7691 0.68312 13.5 3.52253 13.5 7C13.5 10.5899 10.5899 13.5 7 13.5C3.41015 13.5 0.5 10.5899 0.5 7C0.50004 3.41018 3.41017 0.5 7 0.5L7.33496 0.508789ZM5.01074 7.5C5.06064 8.90329 5.31622 10.1457 5.69336 11.0508C5.90445 11.5573 6.14339 11.9347 6.38281 12.1777C6.62056 12.4191 6.829 12.5 7 12.5C7.171 12.5 7.37944 12.4191 7.61719 12.1777C7.85661 11.9347 8.09555 11.5573 8.30664 11.0508C8.68378 10.1457 8.93936 8.90329 8.98926 7.5H5.01074ZM1.52344 7.5C1.71859 9.6655 3.16823 11.4682 5.14062 12.1768C5.00501 11.9495 4.88126 11.7004 4.77051 11.4346C4.33478 10.3886 4.06096 9.01117 4.01074 7.5H1.52344ZM9.98926 7.5C9.93904 9.01117 9.66522 10.3886 9.22949 11.4346C9.11867 11.7005 8.99412 11.9494 8.8584 12.1768C10.8312 11.4684 12.2814 9.66582 12.4766 7.5H9.98926ZM5.14062 1.82227C3.1681 2.53071 1.71865 4.33443 1.52344 6.5H4.01074C4.06096 4.98883 4.33478 3.61136 4.77051 2.56543C4.88137 2.29935 5.00484 2.04974 5.14062 1.82227ZM7 1.5C6.829 1.5 6.62056 1.58092 6.38281 1.82227C6.14339 2.06534 5.90445 2.44265 5.69336 2.94922C5.31622 3.85435 5.06064 5.09671 5.01074 6.5H8.98926C8.93936 5.09671 8.68378 3.85435 8.30664 2.94922C8.09555 2.44265 7.85661 2.06534 7.61719 1.82227C7.37944 1.58092 7.171 1.5 7 1.5ZM8.8584 1.82227C8.99429 2.04986 9.11856 2.29918 9.22949 2.56543C9.66522 3.61136 9.93904 4.98883 9.98926 6.5H12.4766C12.2813 4.33411 10.8314 2.53049 8.8584 1.82227Z" fill="currentColor" />
  </svg>
);
function DealIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="fill-caption-foreground">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.807 2.575a.793.793 0 0 0-.39.69l.014 2.517c.002.284.154.546.398.685l2.134 1.218a.775.775 0 0 0 .777-.004l2.12-1.244a.793.793 0 0 0 .39-.69l-.014-2.516a.793.793 0 0 0-.398-.685L4.704 1.328a.775.775 0 0 0-.777.004L1.807 2.575Zm2.655-.62.013 2.177c0 .187.1.359.26.453l1.866 1.096a.208.208 0 0 0 .314-.183l-.013-2.177a.528.528 0 0 0-.26-.453L4.777 1.772a.208.208 0 0 0-.314.183Z" />
    </svg>
  );
}
function PaperclipIcon({ className }: { className: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M6.5 2.5V8.5C6.5 9.05228 6.05228 9.5 5.5 9.5C4.94772 9.5 4.5 9.05228 4.5 8.5V3.5C4.5 3.22386 4.72386 3 5 3C5.27614 3 5.5 3.22386 5.5 3.5V8" stroke="currentColor" strokeLinecap="round" />
      <path d="M6.5 2.5C6.5 1.67157 7.17157 1 8 1C8.82843 1 9.5 1.67157 9.5 2.5V8.5C9.5 10.1569 8.15685 11.5 6.5 11.5C4.84315 11.5 3.5 10.1569 3.5 8.5V4" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

type AvatarVariant =
  | { type: "image"; src: string; alt: string }
  | { type: "initial"; initial: string; color: string }
  | { type: "count"; count: number };
function Avatar({ variant: e, grouped = false, className }: { variant: AvatarVariant; grouped?: boolean; className?: string }) {
  const o = "rounded-full";
  return (
    <div className={cn("relative size-4.5 border bg-primary-background", o, grouped ? "border-primary-background" : "border-transparent", className)}>
      {e.type === "image" && <Img src={e.src} alt={e.alt} width={16} height={16} className={cn("size-full object-cover", o)} />}
      {e.type === "initial" && (
        <div className={cn("flex size-full items-center justify-center", e.color, o)}>
          <span className="font-medium text-[8px] text-white-100 uppercase leading-4">{e.initial}</span>
        </div>
      )}
      {e.type === "count" && (
        <div className={cn("flex size-full items-center justify-center bg-primary-background", o)}>
          <span className="text-[9px] text-tertiary-foreground leading-none">{"+"}{e.count}</span>
        </div>
      )}
      <div className={cn("absolute inset-0 size-full border border-black-0/10", o)} />
    </div>
  );
}

/* ---------- widget building blocks ---------- */
const SPRING = { damping: 30, mass: 1, stiffness: 300 };
function reveal(active: boolean, delay: number) {
  return {
    animate: active ? { filter: "blur(0px)", opacity: 1, y: 0 } : { filter: "blur(1px)", opacity: 0, y: 10 },
    initial: { filter: "blur(1px)", opacity: 0, y: 10 },
    transition: { type: "spring" as const, ...SPRING, delay },
  };
}
function UserBubble({ children, isActive = true, className }: { children: ReactNode; isActive?: boolean; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ type: "spring", ...SPRING }}
      className={cn("flex justify-end", className)}
    >
      <div className="mb-1 flex items-center rounded-xl bg-surface px-3.5 py-2">
        <span className="max-w-[17em] text-pretty text-primary-foreground text-sm">{children}</span>
      </div>
    </motion.div>
  );
}
const typeDuration = (s: string) => 0.005 * s.length;
function StreamText({ text, isActive = true, delay = 0, className }: { text: string; isActive?: boolean; delay?: number; className?: string }) {
  const lines = text.split("\n");
  let offset = 0;
  return (
    <div className={cn("px-0.5", className)}>
      <p className="font-medium text-primary-foreground text-sm leading-5">
        {lines.map((line, li) => {
          const words = line.split(" ");
          return (
            <span key={li}>
              {words.map((w, wi) => {
                const start = offset;
                offset += w.length + 1;
                return (
                  <span key={wi} className="inline">
                    {w.split("").map((ch, ci) => (
                      <motion.span
                        key={ci}
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: delay + (start + ci) * 0.005, duration: 0.05 }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                    {wi < words.length - 1 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: delay + (start + w.length) * 0.005, duration: 0.05 }}
                      >
                        {" "}
                      </motion.span>
                    )}
                  </span>
                );
              })}
              {li < lines.length - 1 && <br />}
            </span>
          );
        })}
      </p>
    </div>
  );
}
function SuggestedActions({ actions, isActive = true, delay = 0, className }: { actions: string[]; isActive?: boolean; delay?: number; className?: string }) {
  const n = reveal(isActive, delay);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <motion.span initial={n.initial} animate={n.animate} transition={n.transition} className="font-medium text-accent-foreground text-xs">
        {"Suggested action"}
      </motion.span>
      {actions.map((label, r) => {
        const l = reveal(isActive, delay + 0.08 * (r + 1));
        return (
          <motion.div key={r} initial={l.initial} animate={l.animate} transition={l.transition} className="flex items-center gap-0.5 rounded-lg">
            <div className="flex size-8 items-center justify-center">
              <ArrowTurnDownRight14 className="size-3.5 text-tertiary-foreground" />
            </div>
            <span className="font-medium text-sm text-tertiary-foreground">{label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* Portraits for the feedback call rows (FB*) and the follow-up email (EM*). */
const FB1 = "/img/img-7d52cb60c6.png",
  FB2 = "/img/img-e967a78352.png",
  FB3 = "/img/img-ad8f939cc6.png",
  EM1 = "/img/img-b57f3c29ef.png",
  EM2 = "/img/img-387c3bbff7.png",
  EM3 = "/img/img-004c71c4ea.png";

/* ---------- Founders ---------- */
type FeedbackRow = { avatars: AvatarVariant[]; name: string; progressStart: number; progressEnd: number };
function FeedbackCard({ rows, isActive = true, delay = 0, className }: { rows: FeedbackRow[]; isActive?: boolean; delay?: number; className?: string }) {
  const n = reveal(isActive, delay);
  return (
    <motion.div initial={n.initial} animate={n.animate} transition={n.transition} className={className}>
      <div className="flex flex-col rounded-xl bg-primary-background shadow-joshuattio-product-e1">
        <div className="flex items-center justify-between py-2 pr-2.5 pl-2">
          <div className="flex items-center gap-1.5">
            <div className="flex size-5 items-center justify-center rounded-md border border-blue-200 bg-blue-100">
              <VideoCamera14 className="size-3.5 text-blue-600" />
            </div>
            <span className="font-medium text-primary-foreground text-sm underline decoration-black-100/10">{"Customer feedback"}</span>
          </div>
          <div className="flex h-5 items-center gap-0.75 rounded-md bg-primary-background px-1 text-secondary-foreground text-xs shadow-joshuattio-product-e1">
            <Play12 />
            <span>{"Play all"}</span>
          </div>
        </div>
        <div className="h-px bg-weak-stroke" />
        <div className="flex flex-col gap-3 px-3 pt-2 pb-3">
          {rows.map((e, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex h-5 items-center justify-between">
                <span className="truncate font-medium text-primary-foreground text-xs underline decoration-black-100/10">{e.name}</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center pr-1.5">
                    {e.avatars.map((v, a) => (
                      <Avatar key={a} variant={v} grouped={true} className="-mr-1.5" />
                    ))}
                  </div>
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-white-100 text-secondary-foreground shadow-joshuattio-3">
                    <Play12 />
                  </div>
                </div>
              </div>
              <div className="relative h-1 overflow-hidden rounded-full bg-secondary-background">
                <div className="absolute h-full rounded-full bg-default-stroke" style={{ left: `${e.progressStart}%`, width: `${e.progressEnd - e.progressStart}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
const FOUNDERS_TEXT = "Three features are often mentioned:",
  FOUNDERS_DELAY = 0.1 + typeDuration(FOUNDERS_TEXT) + 0.1;
function FoundersWidget({ isActive = true }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center p-6 size-full">
      <div className="relative w-full max-w-sm max-2xl:scale-90 max-xl:scale-80 max-lg:scale-100 max-md:scale-80">
        <UserBubble isActive={isActive} className="mb-4">{"tell me what users want most"}</UserBubble>
        <StreamText text={FOUNDERS_TEXT} isActive={isActive} delay={0.1} className="mb-4" />
        <FeedbackCard
          rows={[
            { avatars: [{ alt: "", src: FB1, type: "image" }, { alt: "", src: FB2, type: "image" }], name: "Agents", progressEnd: 50, progressStart: 25 },
            {
              avatars: [{ alt: "", src: FB1, type: "image" }, { alt: "", src: FB2, type: "image" }, { alt: "", src: FB3, type: "image" }],
              name: "Mobile app",
              progressEnd: 50,
              progressStart: 0,
            },
            { avatars: [{ alt: "", src: FB2, type: "image" }], name: "Advanced reporting", progressEnd: 38, progressStart: 0 },
          ]}
          isActive={isActive}
          delay={FOUNDERS_DELAY}
          className="mb-6"
        />
        <SuggestedActions actions={["Draft summary of feedback to share with product"]} isActive={isActive} delay={FOUNDERS_DELAY + 0.1} />
      </div>
    </div>
  );
}

/* ---------- Marketing ---------- */
function TaskCard({ title, deadline, deadlineVariant = "warning", isActive = true, delay = 0 }: { title: string; deadline: string; deadlineVariant?: string; isActive?: boolean; delay?: number }) {
  const o = reveal(isActive, delay);
  return (
    <motion.div initial={o.initial} animate={o.animate} transition={o.transition}>
      <div className="rounded-xl bg-primary-background shadow-joshuattio-product-e1">
        <div className="flex items-center gap-2 px-2.5 py-2">
          <div className="size-4 shrink-0 rounded-full border border-black-100/15 bg-primary-background" />
          <p className="flex-1 truncate font-medium text-primary-foreground text-sm leading-5 tracking-tight">{title}</p>
          <span className={cn("shrink-0 font-medium text-xs leading-4", { "text-yellow-600": deadlineVariant === "warning" }, { "text-black-400/40": deadlineVariant !== "warning" })}>
            {deadline}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
const MARKETING_TEXT = "Here are 2 open tasks to look into:",
  MARKETING_DELAY = 0.1 + typeDuration(MARKETING_TEXT) + 0.1;
function MarketingWidget({ isActive = true }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center p-6 size-full">
      <div className="relative w-full max-w-sm max-2xl:scale-90 max-xl:scale-80 max-lg:scale-100 max-md:scale-85">
        <UserBubble isActive={isActive} className="mb-4">{"any open requests with greenleaf?"}</UserBubble>
        <StreamText text={MARKETING_TEXT} isActive={isActive} delay={0.1} className="mb-4" />
        <div className="mb-6 flex flex-col gap-3">
          <TaskCard title="Share 1-pager with the team" deadline="Today" deadlineVariant="warning" isActive={isActive} delay={MARKETING_DELAY} />
          <TaskCard title="Create case study with Sarah" deadline="Tomorrow" deadlineVariant="muted" isActive={isActive} delay={MARKETING_DELAY + 0.1} />
        </div>
        <SuggestedActions actions={["Draft follow-up email to Sarah"]} isActive={isActive} delay={MARKETING_DELAY + 0.2} />
      </div>
    </div>
  );
}

/* ---------- Sales ---------- */
function ActionCard({ headerLabel, value, valueType = "text", isActive = true, delay = 0 }: { headerLabel: string; value: string; valueType?: string; isActive?: boolean; delay?: number }) {
  const o = reveal(isActive, delay);
  return (
    <motion.div initial={o.initial} animate={o.animate} transition={o.transition}>
      <div className="flex flex-col rounded-xl bg-primary-background shadow-joshuattio-product-e1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 px-3 pt-2.5 pb-0.5">
            <span className="text-accent-foreground text-xs">{headerLabel}</span>
          </div>
          <div className="flex items-center px-2 pt-2">
            <div className="flex h-5 min-w-5 items-center gap-0.75 rounded-md bg-primary-background pr-1.5 pl-1 shadow-joshuattio-product-e1">
              <Check14 className="size-3 text-primary-foreground" />
              <span className="font-medium text-primary-foreground text-xs">{"Accept"}</span>
            </div>
          </div>
        </div>
        <div className="px-3 pt-0.5 pb-1">
          <div className="flex items-center gap-2 rounded-lg py-1">
            {valueType === "status" && (
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-yellow-500" />
                <span className="font-medium text-primary-foreground text-sm">{value}</span>
              </div>
            )}
            {valueType === "tag" && (
              <div className="flex h-5.5 items-center rounded-lg border border-blue-200 bg-blue-100 px-1">
                <span className="text-blue-600 text-xs">{value}</span>
              </div>
            )}
            {valueType === "text" && <span className="font-medium text-secondary-foreground text-sm">{value}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
function EntityRef({ label, avatar, type = "deal", isActive = true, delay = 0 }: { label: string; avatar?: string; type?: string; isActive?: boolean; delay?: number }) {
  const o = reveal(isActive, delay);
  return (
    <motion.div initial={o.initial} animate={o.animate} transition={o.transition} className="flex h-5.5 items-center px-0.75">
      <div className="flex items-center gap-1.25">
        {avatar && type === "person" ? (
          <Avatar variant={{ alt: label, src: avatar, type: "image" }} />
        ) : avatar ? (
          <Img src={avatar} alt={label} width={16} height={16} className="size-4 rounded-[5px] border border-weak-stroke" />
        ) : type === "deal" ? (
          <div className="flex size-4 items-center justify-center rounded-[5px] border border-weak-stroke bg-surface-subtle">
            <DealIcon />
          </div>
        ) : type === "company" ? (
          <div className="flex size-4 items-center justify-center rounded-[5px] border border-weak-stroke bg-surface-subtle">
            <span className="font-medium text-[8px] text-tertiary-foreground">{label.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <Avatar variant={{ color: "bg-surface-subtle", initial: label.charAt(0).toUpperCase(), type: "initial" }} />
        )}
        <span className="font-medium text-primary-foreground text-sm underline decoration-subtle-stroke">{label}</span>
      </div>
    </motion.div>
  );
}
type SalesItem =
  | { type: "entityReference"; entityType: string; label: string; avatar?: string }
  | { type: "actionCard"; headerLabel: string; value: string; valueType?: string };
const SALES_ITEMS: SalesItem[] = [
  { entityType: "deal", label: "Basepoint // Greenleaf", type: "entityReference" },
  { headerLabel: "Update Deal Stage", type: "actionCard", value: "Negotiation", valueType: "status" },
  { headerLabel: "Update Next Step", type: "actionCard", value: "Joshua to send documentation on…" },
  { avatar: "/img/img-5105b904f5.avif", entityType: "person", label: "Drew Houston", type: "entityReference" },
  { headerLabel: "Updated Role", type: "actionCard", value: "Head of IT" },
  { avatar: "/img/img-bccd37200b.avif", entityType: "company", label: "Greenleaf", type: "entityReference" },
  { headerLabel: "Funding Raised", type: "actionCard", value: "$100M - $250M", valueType: "tag" },
];
function SalesWidget({ isActive = true }: { isActive?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 size-full">
      <div className="relative w-full max-w-sm max-2xl:scale-90 max-xl:scale-75 max-lg:scale-100 max-md:scale-70">
        <UserBubble isActive={isActive} className="mb-4">{"update this deal pls"}</UserBubble>
        <div className="flex flex-col">
          {SALES_ITEMS.map((a, r) => {
            const prev = r > 0 ? SALES_ITEMS[r - 1] : null,
              gap = prev?.type === "actionCard" && a.type === "entityReference",
              delay = 0.1 + 0.08 * r;
            return (
              <div key={`${a.type}-${r}`} className={cn("flex flex-col", r > 0 && (gap ? "mt-4" : "mt-2"))}>
                {a.type === "entityReference" && <EntityRef label={a.label} avatar={a.avatar} type={a.entityType} isActive={isActive} delay={delay} />}
                {a.type === "actionCard" && <ActionCard headerLabel={a.headerLabel} value={a.value} valueType={a.valueType} isActive={isActive} delay={delay} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- Success ---------- */
function EmailCard({ subject, previewText, attachmentsCount, avatars, isActive = true, delay = 0, className }: { subject: string; previewText: string; attachmentsCount?: number; avatars: AvatarVariant[]; isActive?: boolean; delay?: number; className?: string }) {
  const d = reveal(isActive, delay);
  return (
    <motion.div initial={d.initial} animate={d.animate} transition={d.transition} className={className}>
      <div className="flex flex-col rounded-xl bg-primary-background shadow-joshuattio-product-e1">
        <div className="flex flex-col gap-0.5 px-3 pt-2.5 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-caption-foreground text-xs">{"Draft email"}</span>
              <span className="font-medium text-primary-foreground text-sm">{subject}</span>
            </div>
            <div className="flex items-center -space-x-1">
              {avatars.map((v, a) => (
                <Avatar key={a} variant={v} grouped={true} />
              ))}
            </div>
          </div>
          <p className="truncate font-medium text-tertiary-foreground text-xs">{previewText}</p>
        </div>
        {!!attachmentsCount && attachmentsCount > 0 && (
          <div className="px-2.5 pb-2.5">
            <div className="inline-flex h-5 items-center gap-1 rounded-md border border-weak-stroke bg-surface-subtle px-1">
              <PaperclipIcon className="size-3 text-tertiary-foreground" />
              <span className="font-medium text-tertiary-foreground text-xs">
                {attachmentsCount}
                {" attachment"}
                {attachmentsCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
const SUCCESS_TEXT = "Your draft is ready.\nReview and customise if needed:",
  SUCCESS_DELAY = 0.1 + typeDuration(SUCCESS_TEXT) + 0.1;
function SuccessWidget({ isActive = true }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center p-6 size-full">
      <div className="relative w-full max-w-sm max-2xl:scale-90 max-lg:scale-100 max-md:scale-80">
        <UserBubble isActive={isActive} className="mb-4">{"write a follow-up email"}</UserBubble>
        <StreamText text={SUCCESS_TEXT} isActive={isActive} delay={0.1} className="mb-4" />
        <EmailCard
          subject="RE: Follow-Up on Initial Discussion"
          previewText="Hi everyone, thanks for the productive check-in..."
          avatars={[
            { alt: "Avatar", src: EM1, type: "image" },
            { alt: "Avatar", src: EM2, type: "image" },
            { alt: "Avatar", src: EM3, type: "image" },
            { count: 2, type: "count" },
          ]}
          isActive={isActive}
          delay={SUCCESS_DELAY}
          className="mb-8"
        />
        <SuggestedActions actions={["Suggest next steps"]} isActive={isActive} delay={SUCCESS_DELAY + 0.1} />
      </div>
    </div>
  );
}

/* ---------- Venture capital ---------- */
type Favicon = { type: "color"; color: string } | { type: "image"; src: string; alt: string };
function WebSearch({ resultsCount, favicons, overflowCount, isActive = true, delay = 0, className }: { resultsCount: number; favicons: Favicon[]; overflowCount?: number; isActive?: boolean; delay?: number; className?: string }) {
  const o = reveal(isActive, delay);
  return (
    <motion.div initial={o.initial} animate={o.animate} transition={o.transition} className={cn("flex items-center gap-2", className)}>
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-weak-stroke bg-primary-background px-2 py-1.5">
        <Globe14 className="size-3.5 text-accent-foreground" />
        <span className="text-accent-foreground text-sm">
          {"Searched web:"}
          {" "}
          <span className="text-caption-foreground">
            {resultsCount}
            {" results"}
          </span>
        </span>
        <div className="flex items-center -space-x-1">
          {favicons.map((e, a) => (
            <div key={a} className="relative size-4 overflow-hidden rounded-sm border border-primary-background" style={{ zIndex: a + 1 }}>
              {e.type === "image" ? (
                <Img src={e.src} alt={e.alt} width={14} height={14} className="size-full" />
              ) : (
                <div className={cn("size-3.5 rounded-full border border-black-100/5", e.color)} />
              )}
              <div className="absolute inset-0 size-full rounded-[3px] border border-black-0/10" />
            </div>
          ))}
          {overflowCount != null && overflowCount > 0 && (
            <div className="relative z-10 flex size-4 items-center justify-center rounded-sm border border-primary-background bg-secondary-background">
              <span className="font-semibold text-[9px] text-tertiary-foreground leading-none">{overflowCount}</span>
              <div className="absolute inset-0 size-full rounded-[3px] border border-black-0/10" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
const VC_A = "Here's what you should know:",
  VC_B =
    "Greenleaf was founded by Alex Kowalski and Sarah Johnson, who met while working at Stripe. Alex was one of the early engineers who helped build Stripe's money movement platform, while Sarah led product and partnerships for startups.",
  VC_DELAY_B = 0.3 + typeDuration(VC_A) + 0.15,
  VC_DELAY_C = VC_DELAY_B + typeDuration(VC_B) + 0.15;
function VcWidget({ isActive = true }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center p-6 size-full">
      <div className="mask-b-from-38% relative w-full max-w-sm max-2xl:scale-90 max-lg:scale-100 max-md:scale-75">
        <UserBubble isActive={isActive} className="mb-4">{"what do you know about the founders of Greenleaf?"}</UserBubble>
        <WebSearch
          resultsCount={6}
          favicons={[
            { alt: "X", src: "/img/img-37eac382d8.png", type: "image" },
            { alt: "Vox", src: "/img/img-7fa0bdb878.png", type: "image" },
            { alt: "CNET", src: "/img/img-9e749fcff3.png", type: "image" },
          ]}
          overflowCount={3}
          isActive={isActive}
          delay={0.1}
          className="mb-4"
        />
        <StreamText text={VC_A} isActive={isActive} delay={0.3} className="mb-3" />
        <StreamText text={VC_B} isActive={isActive} delay={VC_DELAY_B} className="mb-3" />
        <StreamText
          text="The two realized there was a gap in the market for developer-friendly sustainability tools, and launched Greenleaf to help companies with their carbon footprint."
          isActive={isActive}
          delay={VC_DELAY_C}
        />
      </div>
    </div>
  );
}

/* ---------- slide wrappers ---------- */
type Dir = "positive" | "negative";
const EASE_IO = { duration: 0.3, ease: "easeInOut" as const };
function SlideVisual({ slide }: { slide: Slide }) {
  const ref = useRef<HTMLDivElement>(null);
  const s = useInView(ref, { once: true });
  const W =
    slide.widget === "sales"
      ? SalesWidget
      : slide.widget === "success"
        ? SuccessWidget
        : slide.widget === "marketing"
          ? MarketingWidget
          : slide.widget === "founders"
            ? FoundersWidget
            : VcWidget;
  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(2px)", opacity: 0, x: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
      exit={{ filter: "blur(3px)", opacity: 0 }}
      transition={EASE_IO}
      className="absolute inset-0"
    >
      <W isActive={s} />
    </motion.div>
  );
}

function Clicker({ slides, selectedIndex: a, onSelect }: { slides: Slide[]; selectedIndex: number; onSelect: (i: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null),
    rowRef = useRef<HTMLDivElement>(null),
    [width, setWidth] = useState(0),
    [offsets, setOffsets] = useState<number[]>([]),
    click = useClickSound(),
    x = useMotionValue(0),
    springX = useSpring(x, { damping: 40, stiffness: 300 }),
    lastTick = useRef(0),
    panning = useRef(false);
  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setWidth(wrapRef.current.offsetWidth);
      if (rowRef.current) {
        const row = rowRef.current,
          t = row.getBoundingClientRect(),
          half = t.width / 2,
          list: number[] = [];
        row.querySelectorAll("button").forEach((b) => {
          const r = b.getBoundingClientRect();
          list.push(half - (r.left - t.left + r.width / 2));
        });
        setOffsets(list);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [slides.length]);
  const rulerX = (width / 5) * (a - 2);
  const offsetOf = useCallback((i: number) => (offsets.length > i ? offsets[i] : 0), [offsets]);
  useEffect(() => {
    if (!panning.current && offsets.length > 0) x.set(offsetOf(a));
  }, [a, offsets, offsetOf, x]);
  const onPan = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      panning.current = true;
      const r = offsetOf(a) + info.offset.x;
      x.set(r);
      const tick = Math.round(r / 10);
      if (tick !== lastTick.current) {
        const d = Math.abs(tick - lastTick.current);
        if (d > 0) click(Math.min(d, 3));
        lastTick.current = tick;
      }
    },
    [a, offsetOf, x, click],
  );
  const onPanEnd = useCallback(() => {
    panning.current = false;
    const cur = x.get();
    let best = a,
      dist = Infinity;
    offsets.forEach((o, i) => {
      const d = Math.abs(cur - o);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    x.set(offsetOf(best));
    if (best !== a) onSelect(best);
  }, [x, offsets, a, offsetOf, onSelect]);
  const ticks = (
    Array.from({ length: 161 }).map((_, i) =>
      i === 80 ? (
        <Line key={i} vertical className="shrink-0 h-3 text-primary-foreground" />
      ) : (
        <Line key={i} vertical className="text-subtle-stroke h-2 shrink-0" />
      ),
    )
  );
  return (
    <div className="relative col-[2/-2] max-lg:col-span-full" ref={wrapRef}>
      <div className="relative flex w-full flex-col overflow-hidden lg:hidden">
        <div className="mask-x-from-80% relative flex w-full justify-center overflow-hidden">
          <motion.div
            ref={rowRef}
            className="flex cursor-grab items-center justify-center gap-8 active:cursor-grabbing"
            style={{ touchAction: "none", x: springX }}
            onPan={onPan}
            onPanEnd={onPanEnd}
          >
            {slides.map((e, r) => (
              <button
                key={e.uid}
                type="button"
                onClick={() => {
                  if (r === a) return;
                  const n = 4 * Math.abs(r - a);
                  if (n > 0) click(n);
                  onSelect(r);
                }}
                className={cn(
                  "shrink-0 cursor-pointer select-none whitespace-nowrap pb-4 text-center text-sm transition-colors duration-300",
                  { "text-secondary": r === a },
                  { "text-caption-foreground": r !== a },
                )}
              >
                {e.title}
              </button>
            ))}
          </motion.div>
        </div>
        <div className="mask-x-from-96% relative flex w-full justify-center overflow-hidden">
          <div className="flex min-w-[200vw] max-w-[200vw] items-end justify-center gap-3">{ticks}</div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="grid grid-cols-5 justify-center justify-items-center">
          {slides.map((e, r) => (
            <button
              key={e.uid}
              type="button"
              onClick={() => {
                const n = 4 * Math.abs(r - a);
                if (n > 0) click(n);
                onSelect(r);
              }}
              className={cn(
                "pb-4 text-sm transition-colors duration-300",
                { "text-secondary": r === a },
                { "cursor-pointer text-caption-foreground hover:text-accent-foreground hover:duration-150": r !== a },
              )}
            >
              {e.title}
            </button>
          ))}
        </div>
        <div className="mask-x-from-96% relative flex w-full justify-center overflow-hidden">
          <motion.div
            className="flex min-w-[200vw] max-w-[200vw] items-end justify-center gap-3"
            animate={{ x: rulerX }}
            transition={EASE_IO}
          >
            {ticks}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <div className={className}>
      <Line vertical dashed className="text-subtle-stroke absolute inset-y-0 left-1/2 -translate-x-1/2" />
      <Line dashed className="text-subtle-stroke absolute inset-x-0 top-1/2 -translate-y-1/2" />
    </div>
  );
}

export function TabsSlides() {
  const [dir, setDir] = useState<Dir>("positive");
  const [sel, setSel] = useState(() => Math.floor(SLIDES.length / 2));
  // Clicker variant flips the travel direction.
  const v: Dir = dir === "positive" ? "negative" : "positive";
  const select = (i: number) => {
    setDir(i > sel ? "positive" : "negative");
    setSel(i);
  };
  return (
    <>
      <div className="grid grid-cols-12 pb-10">
        <Clicker slides={SLIDES} selectedIndex={sel} onSelect={select} />
      </div>
      <div className="relative grid w-full grid-cols-12 max-lg:mt-0">
        <div className="relative col-[2/-2] flex w-full border border-subtle-stroke max-xl:col-[2/-2] max-lg:col-span-full max-lg:aspect-video max-lg:border-x-0 max-md:aspect-5/4 max-lg:aspect-square!">
          <div className="relative my-px bg-white-100 w-1/2 max-lg:hidden">
            <Line vertical className="text-subtle-stroke absolute inset-y-0 right-0" />
            {SLIDES.map((e, i) => (
              <AnimatePresence key={e.uid} initial={false}>
                {sel === i && (
                  <motion.div
                    key={e.uid}
                    initial={{ filter: "blur(2px)", opacity: 0, x: v === "positive" ? "4px" : "-4px" }}
                    animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                    exit={{ filter: "blur(3px)", opacity: 0 }}
                    transition={EASE_IO}
                    className="absolute top-12 left-10 flex items-center gap-2 max-xl:top-12 max-xl:left-7.5"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="max-w-[20em] text-balance pr-6 font-display font-semibold text-2xl">{e.subtitle}</h3>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
            <div className="absolute inset-x-10 bottom-10 max-xl:inset-x-7.5 max-xl:bottom-7.5">
              {SLIDES.map((e, i) => (
                <AnimatePresence key={e.uid} initial={false}>
                  {sel === i && (
                    <motion.div
                      key={e.uid}
                      initial={{ filter: "blur(1.5px)", opacity: 0, x: v === "positive" ? "4px" : "-4px" }}
                      animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                      exit={{ filter: "blur(2px)", opacity: 0 }}
                      transition={EASE_IO}
                      className="absolute bottom-0 flex max-w-sm flex-col text-balance text-tertiary-foreground"
                    >
                      <p className="text-balance pr-6 text-accent-foreground text-sm">{e.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>
          <div className="relative flex overflow-hidden bg-secondary-background max-lg:aspect-video max-lg:w-full max-lg:justify-center max-md:aspect-square aspect-square! aspect-square w-1/2">
            <Dots className="mask-[radial-gradient(circle,transparent_00%,black_100%)] absolute inset-0" />
            {SLIDES.map((e, i) => (
              <AnimatePresence key={e.uid} initial={false}>
                {sel === i && <SlideVisual key={i} slide={e} />}
              </AnimatePresence>
            ))}
          </div>
          <Corner className="absolute top-0 left-0 size-10 translate-x-[calc(-50%-0.5px)] translate-y-[calc(-50%-0.5px)]" />
          <Corner className="absolute top-0 right-0 size-10 translate-x-[calc(50%+0.5px)] translate-y-[calc(-50%-0.5px)]" />
          <Corner className="absolute right-0 bottom-0 size-10 translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />
          <Corner className="absolute bottom-0 left-0 size-10 translate-x-[calc(-50%-0.5px)] translate-y-[calc(50%+0.5px)]" />
        </div>
      </div>
    </>
  );
}
