"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMeasure, useMediaQuery, useResolvedReducedMotion } from "./uc-hooks";
import { SIGNAL_MAX_WIDTH, SIGNAL_MIN_WIDTH, UcSignalRays } from "./uc-signal-rays";

const BLUR_ENTRANCE = 2.5;
const BLUR_REVEAL = 1.5;
const SAGITTA = { base: 200, lg: 264, xl: 352 };
const BELOW = { base: 176, lg: 224, xl: 280 };
const SPRING_SOFT = { damping: 28, mass: 0.4, stiffness: 180 };
const SPRING_LIFT = { damping: 38, mass: 0.8, stiffness: 120 };
const SPRING_RIM = { damping: 44, mass: 0.5, stiffness: 190 };

const RIM_MASK = "linear-gradient(to top, transparent 0, #000 64px)";
const RIM_COLORS =
  "conic-gradient(from 0deg at 50% 50%, #eef1ea 0deg, #6cbdb0 10deg, #161e69 60deg, #161e69 180deg, #bb2a1e 180deg, #bb2a1e 300deg, #ccc427 350deg, #eef1ea 360deg)";
const RIM_FADE =
  "conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.4) 0deg, #000 35deg, #000 325deg, rgba(0,0,0,0.4) 360deg)";

/** Colored rim light around the planet edge, drawn left to right with scroll and slowly hue-shifting. */
function Rim({
  centerBelowBottom,
  draw,
  opacity,
  radius,
  reduceMotion,
}: {
  centerBelowBottom: number;
  draw: MotionValue<number>;
  opacity: MotionValue<number>;
  radius: number;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });
  const hue = useMotionValue(0);
  const sat = useMotionValue(1);
  useAnimationFrame((e) => {
    if (reduceMotion || !inView) return;
    const t = e / 1e3;
    const a = 0.6 * Math.sin(0.27 * t) + 0.4 * Math.sin(0.11 * t);
    hue.set(5 * a);
    const s = 0.6 * Math.sin(0.17 * t) + 0.4 * Math.sin(0.065 * t);
    sat.set(1 + ((s + 1) / 2) * 0.5);
  });
  const filter = useMotionTemplate`hue-rotate(${hue}deg) saturate(${sat})`;
  const clipPath = useMotionTemplate`inset(-64px calc((1 - ${draw}) * (100% + 64px) - 64px) -64px -64px)`;
  const d = 2 * radius;
  const disc = {
    bottom: -(centerBelowBottom + radius) + 32,
    height: d,
    left: "50%",
    marginLeft: -radius,
    position: "absolute" as const,
    width: d,
  };
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 overflow-hidden"
      style={{ height: 640, maskImage: RIM_MASK, WebkitMaskImage: RIM_MASK }}
    >
      <motion.div
        className="absolute inset-0 will-change-[opacity]"
        style={{ clipPath: reduceMotion ? undefined : clipPath, opacity: reduceMotion ? 1 : opacity }}
      >
        <motion.div className="absolute overflow-hidden" style={{ inset: -32, ...(reduceMotion ? undefined : { filter }) }}>
          <div className="absolute inset-0 overflow-hidden" style={{ filter: "blur(10px)", opacity: 0.45 }}>
            <div style={disc}>
              <div
                className="absolute rounded-full"
                style={{ backgroundImage: RIM_COLORS, inset: -3, maskImage: RIM_FADE, WebkitMaskImage: RIM_FADE }}
              />
            </div>
          </div>
          <div className="absolute inset-0 overflow-hidden" style={{ filter: "blur(2px)" }}>
            <div style={disc}>
              <div
                className="absolute rounded-full"
                style={{ backgroundImage: RIM_COLORS, inset: -2, maskImage: RIM_FADE, WebkitMaskImage: RIM_FADE }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute overflow-hidden" style={{ filter: "blur(0.5px)", inset: -32 }}>
        <div style={disc}>
          <div className="absolute inset-0 rounded-full" style={{ background: "var(--color-black-50)" }} />
        </div>
      </div>
    </div>
  );
}

const HEADER_DARK_EVENT = "site-header-theme-dark";

/** Tells the site header it sits over a dark section while the header line is inside `section`. */
function useHeaderDarkMode(sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const id = `uc-${Math.round(el.getBoundingClientRect().top)}`;
    let dark = false;
    const emit = (next: boolean) => {
      if (dark === next) return;
      dark = next;
      window.dispatchEvent(new CustomEvent(HEADER_DARK_EVENT, { detail: { id, isDark: next } }));
    };
    const headerHeight = () => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;height:var(--site-header-height)";
      document.body.appendChild(probe);
      const h = probe.getBoundingClientRect().height;
      probe.remove();
      return h;
    };
    let offset = headerHeight();
    const check = () => {
      const r = el.getBoundingClientRect();
      emit(r.top <= offset && r.bottom > offset);
    };
    let raf: number | null = null;
    const onScroll = () => {
      if (raf === null)
        raf = requestAnimationFrame(() => {
          check();
          raf = null;
        });
    };
    const onResize = () => {
      offset = headerHeight();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
      if (dark) window.dispatchEvent(new CustomEvent(HEADER_DARK_EVENT, { detail: { id, isDark: false } }));
    };
  }, [sectionRef]);
}

/** Emits header dark-mode events for the enclosing dark section. */
export function UcHeaderDark() {
  const ref = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    sectionRef.current = ref.current?.closest("section") ?? null;
  }, []);
  useHeaderDarkMode(sectionRef);
  return <span ref={ref} hidden />;
}

/** "Universal Context" title over the planet horizon, revealed by scroll. */
export function UcHorizon() {
  const reduce = useResolvedReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [measureRoot, { width: rootWidth }] = useMeasure<HTMLDivElement>();
  const setRoot = useCallback(
    (el: HTMLDivElement | null) => {
      rootRef.current = el;
      measureRoot(el);
    },
    [measureRoot],
  );
  const m = rootWidth || 1392;
  const xl = useMediaQuery("(min-width: 1280px)", true);
  const lg = useMediaQuery("(min-width: 1024px)", true);
  const bp = xl ? "xl" : lg ? "lg" : "base";
  const below = BELOW[bp];
  const sagitta = Math.min(SAGITTA[bp], 0.28 * m);
  const centerBelow = ((m / 2) ** 2 - sagitta ** 2) / (2 * sagitta);
  const radius = sagitta + centerBelow;
  const haloSize = Math.round(2 * radius * 1.3);
  const padBottom = sagitta + 64;
  const [measureTitle, { height: titleHeight }] = useMeasure<HTMLDivElement>();

  const { scrollYProgress } = useScroll({ offset: ["center end", "end end"], target: rootRef });
  const titleY = useTransform(scrollYProgress, [0.1, 0.6], [4, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const titleBlur = useTransform(scrollYProgress, [0.15, 0.5], [BLUR_ENTRANCE, 0]);
  const leadY = useTransform(scrollYProgress, [0.22, 0.72], [4, 0]);
  const leadOpacity = useTransform(scrollYProgress, [0.3, 0.62], [0, 1]);
  const leadBlur = useTransform(scrollYProgress, [0.3, 0.62], [BLUR_REVEAL, 0]);
  const haloOpacity = useTransform(scrollYProgress, [0.5, 1], [0, 1]);
  const haloScale = useTransform(scrollYProgress, [0.5, 1], [0.84, 1]);
  const titleYS = useSpring(titleY, SPRING_LIFT);
  const titleOpacityS = useSpring(titleOpacity, SPRING_SOFT);
  const titleBlurS = useSpring(titleBlur, SPRING_SOFT);
  const leadYS = useSpring(leadY, SPRING_LIFT);
  const leadOpacityS = useSpring(leadOpacity, SPRING_SOFT);
  const leadBlurS = useSpring(leadBlur, SPRING_SOFT);
  const titleBlurQ = useTransform(titleBlurS, (e) => Math.round(2 * e) / 2);
  const leadBlurQ = useTransform(leadBlurS, (e) => Math.round(2 * e) / 2);
  const titleFilter = useMotionTemplate`blur(${titleBlurQ}px)`;
  const leadFilter = useMotionTemplate`blur(${leadBlurQ}px)`;
  const haloOpacityS = useSpring(haloOpacity, SPRING_SOFT);
  const haloScaleS = useSpring(haloScale, SPRING_SOFT);
  const rimProgress = useSpring(scrollYProgress, SPRING_RIM);
  const still = reduce === true;

  return (
    <div ref={setRoot} className="relative overflow-hidden" style={{ height: padBottom + (titleHeight || 120) + below }}>
      <div
        aria-hidden="true"
        className="size-full text-[rgb(255_255_255/0.035)] pointer-events-none absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 8px)" }}
      />
      <UcSignalRays
        color="rgba(255,255,255,0.5)"
        count={6}
        direction="down"
        easeDistance={180}
        gridAlignment="start"
        initialSpawn="distributed"
        maxWidth={SIGNAL_MAX_WIDTH}
        minSpeedFactor={0.55}
        minWidth={SIGNAL_MIN_WIDTH}
        peakOpacity={0.26}
        shouldReduceMotion={reduce}
        terminusFromBottom={sagitta}
      />
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-6" style={{ paddingBottom: padBottom }}>
        <div ref={measureTitle} className="flex max-w-full flex-col items-center gap-1 text-center">
          <motion.p
            className="text-accent-foreground text-sm will-change-[filter,opacity,transform] sm:text-base"
            style={still ? undefined : { filter: leadFilter, opacity: leadOpacityS, y: leadYS }}
          >
            {"The only CRM with"}
          </motion.p>
          <motion.h2
            className="max-w-full text-balance font-display font-semibold text-[40px] text-white-200 leading-none tracking-[-0.024em] will-change-[filter,opacity,transform] sm:text-[48px] md:text-[56px] lg:text-[72px] xl:text-[96px]"
            style={still ? undefined : { filter: titleFilter, opacity: titleOpacityS, y: titleYS }}
          >
            {"Universal Context"}
            <sup className="relative top-[0.15em] inline-block align-top text-[0.4em] leading-none tracking-normal">
              {"™"}
            </sup>
          </motion.h2>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 h-[640px] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute will-change-[transform,opacity]"
          style={{
            backgroundImage:
              "radial-gradient(circle closest-side, transparent 64%, rgba(255,255,255,0.04) 71%, rgba(255,255,255,0.12) 74.5%, rgba(255,255,255,0.16) 75.5%, rgba(255,255,255,0.125) 77.5%, rgba(255,255,255,0.07) 80.5%, rgba(255,255,255,0.035) 85%, rgba(255,255,255,0.015) 91%, transparent 98%)",
            bottom: -(centerBelow + haloSize / 2),
            height: haloSize,
            left: "50%",
            marginLeft: -haloSize / 2,
            width: haloSize,
            ...(still ? undefined : { opacity: haloOpacityS, scale: haloScaleS }),
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 h-[640px] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2"
          style={{ bottom: -(centerBelow + radius), height: 2 * radius, marginLeft: -radius, width: 2 * radius }}
        >
          <div className="absolute inset-0 rounded-full" style={{ background: "var(--color-black-50)" }} />
          <motion.svg
            className="absolute inset-0 size-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
            style={still ? undefined : { opacity: haloOpacityS }}
            viewBox="0 0 1000 1000"
          >
            <defs>
              <linearGradient id="universal-context-edge" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="0.33" stopColor="#2e3238" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="500"
              cy="500"
              fill="none"
              r="500"
              stroke="url(#universal-context-edge)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>
        </div>
      </div>
      <Rim centerBelowBottom={centerBelow} draw={rimProgress} opacity={rimProgress} radius={radius} reduceMotion={still} />
    </div>
  );
}
