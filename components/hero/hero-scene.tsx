"use client";
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/components/hero/cn";
import { BLUR_REVEAL, EASE_REVEAL, EASE_UI } from "@/components/hero/ease";
import { AppDemo, TAB, type TabId } from "@/components/hero/app-demo";
import { CallWindowBody, SlackWindowBody, TerminalWindowBody } from "@/components/hero/side-apps";

/* ------------------------------------------------------------------ tokens */

const hiddenBlur = { filter: `blur(${BLUR_REVEAL}px)`, opacity: 0 },
  shownBlur = { filter: "blur(0px)", opacity: 1 },
  shellInitial = { opacity: 0, scale: 0.98 },
  shellAnimate = { opacity: 1, scale: 1 },
  shellTransition = { delay: 0.45, duration: 0.9, ease: EASE_REVEAL },
  maskW = (e: number) => 160 + (1 - e) * 120,
  maskH = (e: number) => 120 + (1 - e) * 40,
  scaleXAt = (e: number) => maskW(e) / maskW(0),
  scaleYAt = (e: number) => maskH(e) / maskH(0);

const shadowRing = "0 0 0 1px rgba(11,13,24,0.06)",
  shadowRest = `${shadowRing}, 0 1px 2px rgba(11,13,24,0.025), 0 3px 6px rgba(11,13,24,0.03), 0 8px 14px rgba(11,13,24,0.035), 0 16px 28px rgba(11,13,24,0.04)`,
  shadowDrag = `${shadowRing}, 0 2px 5px rgba(11,13,24,0.03), 0 6px 14px rgba(11,13,24,0.04), 0 16px 32px rgba(11,13,24,0.05), 0 28px 52px rgba(11,13,24,0.06)`,
  shadowTransition = { duration: 0.22, ease: EASE_UI },
  dragSpring = { damping: 30, mass: 0.5, stiffness: 200 },
  clamp = (e: number, t: number, a: number) => Math.min(Math.max(t, a), Math.max(Math.min(t, a), e));

/* ---------------------------------------------------------------- backdrop */

function HeroBackdrop({ revealOpacity: e }: { revealOpacity?: MotionValue<number> }) {
  return (
    <>
      <motion.div
        aria-hidden={true}
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(90% 80% at 50% 100%, #e6ecff 0%, #bccbff 45%, #86a0ee 100%)",
          ...(e && { opacity: e }),
        }}
      />
      <div
        aria-hidden={true}
        className="absolute inset-0 bg-[repeating-linear-gradient(90deg,color-mix(in_oklab,var(--color-white-100)_78%,transparent)_0_1px,transparent_1px_8px)] opacity-40"
      />
    </>
  );
}

/* -------------------------------------------------------- app window tabs */

const tabOrder: TabId[] = [TAB.ask, TAB.data, TAB.workflows, TAB.reporting],
  tabDurations: Record<TabId, number> = {
    [TAB.ask]: 11e3,
    [TAB.data]: 6500,
    [TAB.workflows]: 17e3,
    [TAB.reporting]: 6500,
  };

function useTabCycle(e: boolean) {
  const [t, a] = useState<TabId>(TAB.ask);
  useEffect(() => {
    if (!e) return;
    const s = window.setTimeout(() => {
      a((e) => tabOrder[(tabOrder.indexOf(e) + 1) % tabOrder.length]);
    }, tabDurations[t]);
    return () => window.clearTimeout(s);
  }, [t, e]);
  return t;
}

function PreviewTabs({ heightClassName: e }: { heightClassName: string }) {
  const a = useTabCycle(true);
  return (
    <div data-home-hero-preview-tab={a} className="h-full">
      <AppDemo activeTabId={a} heightClassName={e} />
    </div>
  );
}

const PreviewWindow = memo(function PreviewWindow({
  heightClassName: e = "h-[280px] md:h-[380px] lg:h-[min(40.35vw,775px)]",
}: {
  heightClassName?: string;
}) {
  const a = useRef<HTMLDivElement>(null),
    s = useInView(a, { margin: "256px 0px" });
  return (
    <div
      ref={a}
      className={cn(e, "w-full overflow-hidden rounded-md bg-white-100 lg:rounded-xl lg:border lg:border-black-0/5")}
    >
      {s && <PreviewTabs heightClassName="h-full" />}
    </div>
  );
});

/* ------------------------------------------------------------ drag windows */

type DragHandlers = {
  onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
};

function useDragWindow({
  constraintsRef: e,
  enabled: t = true,
  onStart: s,
  resetOnDisable: r = true,
}: {
  constraintsRef?: RefObject<HTMLDivElement | null>;
  enabled?: boolean;
  onStart?: () => void;
  resetOnDisable?: boolean;
}) {
  const i = useMotionValue(0),
    l = useMotionValue(0),
    [o, d] = useState(false),
    c = useRef(false),
    p = useRef<{ element: HTMLDivElement; pointerId: number } | null>(null),
    u = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 }),
    g = useRef({ maxX: 360, maxY: 240, minX: -360, minY: -240 });
  useEffect(() => {
    if (t || !r) return;
    const e = animate(i, 0, dragSpring),
      s = animate(l, 0, dragSpring);
    return () => {
      e.stop();
      s.stop();
    };
  }, [t, r, i, l]);
  useEffect(() => {
    if (t) return;
    const e = p.current;
    p.current = null;
    if (c.current) {
      c.current = false;
      d(false);
      if (e?.element.hasPointerCapture(e.pointerId)) e.element.releasePointerCapture(e.pointerId);
    }
  }, [t]);
  const h = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!c.current) return;
    c.current = false;
    d(false);
    p.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const dragHandlers: DragHandlers = {
    onPointerCancel: h,
    onPointerDown: (a) => {
      if (!t || 0 !== a.button) return;
      s?.();
      u.current = { pointerX: a.clientX, pointerY: a.clientY, x: i.get(), y: l.get() };
      const r = e?.current;
      if (r) {
        const e = a.currentTarget.getBoundingClientRect(),
          t = r.getBoundingClientRect(),
          s = e.left - i.get(),
          n = e.top - l.get();
        g.current = {
          maxX: t.right - s - e.width,
          maxY: t.bottom - n - e.height,
          minX: t.left - s,
          minY: t.top - n,
        };
      }
      c.current = true;
      d(true);
      p.current = { element: a.currentTarget, pointerId: a.pointerId };
      a.currentTarget.setPointerCapture(a.pointerId);
    },
    onPointerMove: (e) => {
      if (!c.current) return;
      const t = u.current,
        a = g.current;
      i.set(clamp(t.x + (e.clientX - t.pointerX), a.minX, a.maxX));
      l.set(clamp(t.y + (e.clientY - t.pointerY), a.minY, a.maxY));
    },
    onPointerUp: h,
  };
  return { dragHandlers, dragX: i, dragY: l, isDragging: o };
}

export function TrafficLights({ className: e }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none z-20 flex items-center gap-[3px] lg:gap-1.5", e ?? "absolute top-1.5 left-1.5 lg:top-3 lg:left-3")}
    >
      <span className="size-1.5 rounded-full bg-white-800 lg:size-3 lg:bg-red-500" />
      <span className="size-1.5 rounded-full bg-white-800 lg:size-3 lg:bg-yellow-500" />
      <span className="size-1.5 rounded-full bg-white-800 lg:size-3 lg:bg-green-500" />
    </div>
  );
}

function MainWindow({
  constraintsRef: e,
  isInteractive: a,
  onFocus: s,
  scale: i,
  zIndex: n,
}: {
  constraintsRef: RefObject<HTMLDivElement | null>;
  isInteractive: boolean;
  onFocus: () => void;
  scale: MotionValue<number>;
  zIndex: number;
}) {
  const { dragHandlers: l, dragX: o, dragY: d, isDragging: c } = useDragWindow({ constraintsRef: e, enabled: a, onStart: s });
  return (
    <motion.div
      data-home-hero="joshuattio-window-shell"
      className="pointer-events-none relative w-full"
      style={{ zIndex: n }}
      initial={shellInitial}
      animate={shellAnimate}
      transition={shellTransition}
    >
      <motion.div
        data-home-hero="joshuattio-window"
        {...(a ? l : {})}
        className={cn(
          "relative origin-center touch-none select-none overflow-hidden rounded-lg bg-white-300/80 p-[3px] pt-0 backdrop-blur-md lg:rounded-2xl lg:p-1.5 lg:pt-0",
          "group-data-hero-scrolling/hero:bg-white-300 group-data-hero-scrolling/hero:backdrop-blur-none",
          a ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none",
        )}
        style={{ scale: i, willChange: "transform", x: o, y: d }}
        animate={{ boxShadow: c ? shadowDrag : shadowRest }}
        transition={shadowTransition}
      >
        <div className="flex h-4 items-center pl-1 lg:h-8 lg:pl-2">
          <TrafficLights className="relative" />
        </div>
        <PreviewWindow />
      </motion.div>
    </motion.div>
  );
}

type SideApp = {
  body: (active: boolean) => ReactNode;
  dark?: boolean;
  id: "call" | "slack" | "terminal";
  transformOrigin: string;
  windowClassName: string;
};

function SideWindow({
  isLoopActive: e,
  app: a,
  constraintsRef: s,
  isHidden: i = false,
  isInteractive: n,
  onFocus: l,
  scale: o,
  transformOrigin: d = "50% 50%",
  zIndex: c,
}: {
  isLoopActive: boolean;
  app: SideApp;
  constraintsRef: RefObject<HTMLDivElement | null>;
  isHidden?: boolean;
  isInteractive: boolean;
  onFocus: () => void;
  scale: MotionValue<number>;
  transformOrigin?: string;
  zIndex: number;
}) {
  const {
    dragHandlers: p,
    dragX: u,
    dragY: g,
    isDragging: h,
  } = useDragWindow({ constraintsRef: s, enabled: n, onStart: l, resetOnDisable: false });
  useEffect(() => {
    if (i) {
      u.jump(0);
      g.jump(0);
    }
  }, [i, u, g]);
  const m = useMemo(() => a.body(e), [a, e]);
  return (
    <motion.div
      data-home-hero="desktop-window"
      data-home-hero-app={a.id}
      {...(n ? p : {})}
      className={cn(
        "absolute touch-none select-none overflow-hidden rounded-lg p-[3px] pt-0 backdrop-blur-md lg:rounded-2xl lg:p-1.5 lg:pt-0",
        "group-data-hero-scrolling/hero:backdrop-blur-none",
        a.dark
          ? "dark bg-black-0/80 group-data-hero-scrolling/hero:bg-black-0"
          : "bg-white-300/80 group-data-hero-scrolling/hero:bg-white-300",
        n ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none",
        a.windowClassName,
      )}
      style={{ scale: o, transformOrigin: d, willChange: "transform", x: u, y: g, zIndex: c }}
      animate={{ boxShadow: h ? shadowDrag : shadowRest }}
      transition={{ boxShadow: shadowTransition }}
    >
      <div className="flex h-4 items-center pl-1 lg:h-8 lg:pl-2">
        <TrafficLights className="relative" />
      </div>
      <div className="overflow-hidden rounded-md bg-primary-background lg:rounded-xl lg:border lg:border-black-0/5">{m}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------------ side windows */

const sideApps: SideApp[] = [
    {
      body: (e) => <CallWindowBody isActive={e} />,
      id: "call",
      transformOrigin: "0% 100%",
      windowClassName:
        "top-[20px] right-[-64px] w-[136px] lg:top-[40px] lg:right-[-128px] lg:w-[30%] lg:max-w-[272px] xl:right-[-160px] 2xl:right-[-172px]",
    },
    {
      body: (e) => <SlackWindowBody isActive={e} />,
      id: "slack",
      transformOrigin: "100% 100%",
      windowClassName:
        "-top-[8px] left-[-64px] w-[134px] lg:-top-[16px] lg:left-[-128px] lg:w-[30%] lg:max-w-[268px] xl:left-[-160px] 2xl:left-[-172px]",
    },
    {
      body: (e) => <TerminalWindowBody isActive={e} />,
      dark: true,
      id: "terminal",
      transformOrigin: "100% 0%",
      windowClassName:
        "bottom-[16px] left-[-48px] w-[150px] lg:bottom-[32px] lg:left-[-96px] lg:w-[33%] lg:max-w-[300px] xl:left-[-128px] 2xl:left-[-144px]",
    },
  ],
  initialOrder = ["call", "slack", "joshuattio", "terminal"],
  revealTransition = { duration: 0.6, ease: EASE_UI },
  fadeTransition = { duration: 0.5, ease: EASE_UI },
  bgRevealRange: [number, number] = [0, 0.6],
  revealOrder = ["terminal", "slack", "call"],
  heightRange: [number, number] = [500, 800],
  progressIn = (e: number, [t, a]: [number, number]) => Math.min(1, Math.max(0, (e - t) / (a - t))),
  blurFilter = (e: number) => {
    const t = Math.round(2 * e) / 2;
    return t <= 0.25 ? "none" : `blur(${t}px)`;
  };

function RevealedSideWindow({
  app: e,
  constraintsRef: s,
  isInteractive: i,
  isLoopActive: o,
  isRevealed: c,
  onFocus: p,
  scale: u,
  zIndex: g,
}: {
  app: SideApp;
  constraintsRef: RefObject<HTMLDivElement | null>;
  isInteractive: boolean;
  isLoopActive: boolean;
  isRevealed: boolean;
  onFocus: () => void;
  scale: MotionValue<number>;
  zIndex: number;
}) {
  const h = useMotionValue(0),
    m = useMotionValue(3),
    C = useTransform(m, blurFilter);
  useEffect(() => {
    const t = { ...revealTransition, delay: c ? 0.2 * revealOrder.indexOf(e.id) : 0 },
      s = animate(h, c ? 1 : 0, t),
      r = animate(m, c ? 0 : 3, t);
    return () => {
      s.stop();
      r.stop();
    };
  }, [c, h, m, e.id]);
  const [f, y] = useState(true);
  useMotionValueEvent(h, "change", (e) => {
    y(e < 0.001);
  });
  const b = 1.2 + 0.15 * revealOrder.indexOf(e.id);
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: g }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...shellTransition, delay: b }}
    >
      <motion.div className="absolute inset-0" style={{ filter: C, opacity: h }}>
        <SideWindow
          app={e}
          constraintsRef={s}
          isHidden={f}
          isInteractive={i}
          isLoopActive={o && !f}
          onFocus={p}
          scale={u}
          transformOrigin={e.transformOrigin}
          zIndex={g}
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------ scroll hooks */

/** 0..1 progress of the hero through the viewport (top pinned to scroll distance). */
function useHeroProgress(m: RefObject<HTMLDivElement | null>) {
  const g = useMotionValue(0);
  useEffect(() => {
    const e = m.current;
    if (!e) return;
    let t = 0;
    const a = () => {
        t = 0;
        const a = e.getBoundingClientRect(),
          s = a.height - window.innerHeight;
        g.set(s <= 0 ? 0 : Math.min(1, Math.max(0, -a.top / s)));
      },
      s = () => {
        if (!t) t = requestAnimationFrame(a);
      };
    a();
    window.addEventListener("scroll", s, { passive: true });
    window.addEventListener("resize", s, { passive: true });
    return () => {
      if (t) cancelAnimationFrame(t);
      window.removeEventListener("scroll", s);
      window.removeEventListener("resize", s);
    };
  }, [m, g]);
  return g;
}

function useMappedRange(e: MotionValue<number>, t: [number, number], a: [number, number] = [0, 1]) {
  const [s, r] = a,
    i = useMotionValue(s);
  useMotionValueEvent(e, "change", (e) => {
    const a = progressIn(e, t);
    i.set(s + (r - s) * a);
  });
  return i;
}

/* ----------------------------------------------------------- desktop scene */

export function HeroDesktopScene({
  kicker,
  title: s,
  subtitle: p,
  ctaTalk,
  ctaStart,
}: {
  kicker: ReactNode;
  title: string;
  subtitle: string;
  ctaTalk: ReactNode;
  ctaStart: ReactNode;
}) {
  const m = useRef<HTMLDivElement>(null),
    f = useRef<HTMLDivElement>(null),
    y = useRef<HTMLDivElement>(null),
    b = useInView(m, { margin: "0px" }),
    v = useHeroProgress(m),
    M = useMappedRange(v, bgRevealRange, [0.4, 0.7]),
    N = useMotionValue(scaleXAt(0)),
    k = useMotionValue(scaleYAt(0));
  useMotionValueEvent(v, "change", (e) => {
    N.set(scaleXAt(e));
    k.set(scaleYAt(e));
  });

  // Scrolled past the top: hides the heading block and reveals the side windows.
  const [E, B] = useState(false);
  useEffect(() => {
    const e = () => B(window.scrollY >= 8);
    e();
    window.addEventListener("scroll", e, { passive: true });
    return () => window.removeEventListener("scroll", e);
  }, []);

  // Short "transitioning" window after E flips (drops backdrop blur while it runs).
  const [L, S] = useState(false),
    H = useRef(false),
    O = useRef(0);
  useEffect(() => {
    if (E !== H.current) {
      H.current = E;
      S(true);
      window.clearTimeout(O.current);
      O.current = window.setTimeout(() => S(false), 1300);
    }
  }, [E]);
  useEffect(() => () => window.clearTimeout(O.current), []);

  const z = useMotionValue(1),
    I = useMotionValue(0),
    T = useTransform(I, blurFilter),
    D = useTransform(v, (e) => (e >= 0.95 ? "hidden" : "visible"));
  useEffect(() => {
    const e = animate(z, E ? 0 : 1, fadeTransition),
      t = animate(I, E ? 2.5 : 0, fadeTransition);
    return () => {
      e.stop();
      t.stop();
    };
  }, [E, z, I]);

  // Window scale: fits the viewport height, springs between the rest and revealed sizes.
  const Q = useMotionValue(1);
  useEffect(() => {
    let e = 0;
    const t = () => {
      e = f.current?.getBoundingClientRect().height ?? 0;
      const t = 1 - (1 - progressIn(window.innerHeight, heightRange)) * 0.14,
        a = e > 0 ? Math.min(0.95 * t, window.innerHeight / (1.5 * e)) : 0.95 * t;
      Q.set(E ? Math.min(a, t) : t);
    };
    t();
    const a = new ResizeObserver(t);
    if (f.current) a.observe(f.current);
    window.addEventListener("resize", t, { passive: true });
    return () => {
      a.disconnect();
      window.removeEventListener("resize", t);
    };
  }, [E, Q]);
  const Z = useSpring(Q, { damping: 26, mass: 1, stiffness: 120 }),
    [P, K] = useState(false);
  useMotionValueEvent(v, "change", (e) => {
    K(e >= 0.1);
  });

  // data-hero-scrolling while a scroll is in flight (160ms debounce).
  const [U, F] = useState(false),
    W = useRef(0),
    Y = useRef(b);
  useEffect(() => {
    Y.current = b;
  }, [b]);
  useEffect(() => {
    const e = () => {
      if (Y.current) {
        F(true);
        window.clearTimeout(W.current);
        W.current = window.setTimeout(() => F(false), 160);
      }
    };
    window.addEventListener("scroll", e, { passive: true });
    return () => {
      window.removeEventListener("scroll", e);
      window.clearTimeout(W.current);
    };
  }, []);

  // Window stacking: the last focused (dragged) window goes on top; resets 700ms after returning to the top.
  const [G, J] = useState(initialOrder),
    focus = (e: string) => J((t) => (t[t.length - 1] === e ? t : [...t.filter((t) => t !== e), e])),
    q = (e: string) => G.indexOf(e) + 1;
  useEffect(() => {
    if (E) return;
    const e = window.setTimeout(() => J((e) => (e === initialOrder ? e : initialOrder)), 700);
    return () => window.clearTimeout(e);
  }, [E]);

  return (
    <div ref={m} className="group/hero relative grid grid-cols-1 grid-rows-1" data-hero-scrolling={U || L ? "" : undefined}>
      <div
        aria-hidden={true}
        className="pointer-events-none sticky top-(--site-header-height) z-0 col-start-1 row-start-1 h-[calc(100svh-var(--site-header-height))] self-start overflow-hidden"
      >
        <HeroBackdrop revealOpacity={M} />
        <motion.div
          aria-hidden={true}
          className="absolute top-0 left-[-150%] h-[150%] w-[400%] origin-top will-change-transform"
          style={{
            backgroundImage:
              "radial-gradient(70% 106.6667% at 50% 0%, var(--color-primary-background) 32%, transparent 64%)",
            scaleX: N,
            scaleY: k,
          }}
        />
      </div>
      <div className="z-10 col-start-1 row-start-1 flex flex-col">
        <motion.div
          style={{
            filter: T,
            opacity: z,
            pointerEvents: E ? "none" : "auto",
            visibility: D,
            willChange: L ? "opacity, filter" : undefined,
          }}
          className="sticky top-(--site-header-height) -mb-[min(calc(8px+20svh),calc(50svh-261px))] flex min-h-[clamp(320px,calc(40svh-var(--site-header-height)),520px)] flex-col items-center justify-center gap-6 px-6 pt-[max(96px,10svh)] text-center md:px-14 lg:mb-[max(min(calc(120px-20svh),calc(550px-53svh)),calc(max(389px,min(calc(82px+20vw),466px))-50svh))] lg:px-[58px]"
        >
          <div className="flex flex-col items-center gap-9">
            <motion.div initial={hiddenBlur} animate={shownBlur} transition={{ duration: 0.6, ease: EASE_REVEAL }}>
              {kicker}
            </motion.div>
            <motion.h1
              style={{
                fontSize: "clamp(64px, calc(16px + 5.333svh), 80px)",
                letterSpacing: "clamp(-2.4px, calc(2.08px - 0.3733svh), -1.28px)",
              }}
              className="text-balance font-display font-semibold text-primary-foreground leading-[0.95]"
              initial={hiddenBlur}
              animate={shownBlur}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE_REVEAL }}
            >
              {s}
            </motion.h1>
          </div>
          <motion.p
            className="mt-3 max-w-[27em] text-balance font-medium text-[18px] text-accent-foreground leading-[1.3] tracking-[-0.18px]"
            initial={hiddenBlur}
            animate={shownBlur}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE_REVEAL }}
          >
            {p}
          </motion.p>
          <div className="flex items-center justify-center gap-x-2.5 gap-y-2 max-md:flex-col max-md:items-center w-auto">
            <motion.div
              initial={hiddenBlur}
              animate={shownBlur}
              transition={{ delay: 0.30000000000000004, duration: 0.6, ease: EASE_REVEAL }}
            >
              {ctaTalk}
            </motion.div>
            <motion.div initial={hiddenBlur} animate={shownBlur} transition={{ delay: 0.4, duration: 0.6, ease: EASE_REVEAL }}>
              {ctaStart}
            </motion.div>
          </div>
        </motion.div>
        <div
          ref={y}
          className={cn(
            "sticky top-0 flex h-svh items-center justify-center overflow-visible pt-(--site-header-height) pb-20",
            { "pointer-events-none": !P },
          )}
        >
          <div ref={f} className="relative w-2/3 max-w-[1440px] lg:w-3/4">
            <MainWindow
              constraintsRef={y}
              isInteractive={P}
              onFocus={() => focus("joshuattio")}
              scale={Z}
              zIndex={q("joshuattio")}
            />
            {sideApps.map((e) => (
              <RevealedSideWindow
                key={e.id}
                app={e}
                constraintsRef={y}
                isInteractive={P}
                isLoopActive={b}
                isRevealed={E}
                onFocus={() => focus(e.id)}
                scale={Z}
                zIndex={q(e.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ mobile scene */

const mobileMask = `radial-gradient(${maskW(0)}% ${maskH(0)}% at 50% 0%, transparent 32%, #000 64%)`;

export function HeroMobileScene({
  kicker,
  title: a,
  subtitle: s,
  ctaStart,
  ctaTalk,
}: {
  kicker: ReactNode;
  title: string;
  subtitle: string;
  ctaStart: ReactNode;
  ctaTalk: ReactNode;
}) {
  return (
    <div data-home-hero="mobile-scene" className="relative overflow-hidden">
      <div className="container flex flex-1 flex-col max-lg:contents">
        <div className="flex w-full flex-1 flex-col border-subtle-stroke border-x max-lg:border-none relative overflow-hidden">
          <div aria-hidden={true} className="absolute inset-0 bg-primary-background" />
          <div
            aria-hidden={true}
            className="absolute inset-0 overflow-hidden opacity-60"
            style={{ maskImage: mobileMask, WebkitMaskImage: mobileMask }}
          >
            <HeroBackdrop />
          </div>
          <div className="relative z-20 flex flex-col items-center gap-7 px-6 pt-16 sm:gap-6 sm:pt-22">
            <div className="flex flex-col items-center gap-6 text-center sm:gap-7">
              <motion.div initial={hiddenBlur} animate={shownBlur} transition={{ duration: 0.6, ease: EASE_REVEAL }}>
                {kicker}
              </motion.div>
              <motion.h1
                className="mt-2 text-balance text-heading-md text-primary-foreground leading-[0.95] sm:mt-1 sm:text-heading-lg sm:tracking-[-0.02em]"
                initial={hiddenBlur}
                animate={shownBlur}
                transition={{ delay: 0.1, duration: 0.6, ease: EASE_REVEAL }}
              >
                {a}
              </motion.h1>
              <motion.p
                className="max-w-[420px] text-balance font-medium text-[15px] text-accent-foreground leading-[1.3] tracking-[-0.17px] sm:text-[16px]"
                initial={hiddenBlur}
                animate={shownBlur}
                transition={{ delay: 0.2, duration: 0.6, ease: EASE_REVEAL }}
              >
                {s}
              </motion.p>
            </div>
            <div className="flex w-full items-center justify-center gap-x-2.5 gap-y-2 max-md:flex-col max-md:items-center">
              <motion.div
                className="w-full"
                initial={hiddenBlur}
                animate={shownBlur}
                transition={{ delay: 0.30000000000000004, duration: 0.6, ease: EASE_REVEAL }}
              >
                {ctaStart}
              </motion.div>
              <motion.div initial={hiddenBlur} animate={shownBlur} transition={{ delay: 0.4, duration: 0.6, ease: EASE_REVEAL }}>
                {ctaTalk}
              </motion.div>
            </div>
          </div>
          <motion.div
            aria-hidden={true}
            className="relative z-10 mt-10 mb-6 ml-4 overflow-hidden rounded-l-lg bg-white-300/80 pb-0.75 pl-0.75 shadow-[0_2px_8px_rgba(11,13,24,0.04),0_16px_40px_rgba(11,13,24,0.08)] backdrop-blur-md sm:mt-16 sm:ml-0 sm:w-full sm:max-w-[560px] sm:self-center sm:rounded-lg sm:pr-0.75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.75, ease: EASE_REVEAL }}
          >
            <div className="flex h-4 items-center gap-[3px] pl-1.5">
              <span className="size-1.5 rounded-full bg-white-800" />
              <span className="size-1.5 rounded-full bg-white-800" />
              <span className="size-1.5 rounded-full bg-white-800" />
            </div>
            <PreviewWindow heightClassName="h-[296px]" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** Both hero variants share the reduced-motion policy of the rest of the page. */
export function HeroMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
