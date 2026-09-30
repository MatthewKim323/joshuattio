"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValueEvent, useScroll } from "motion/react";

type Item = { title: string; description: string; image: { id: string; src: string; width: number; height: number } };

const TITLE = "From idea to live agent, before your next meeting.";
const SUBTITLE = "Describe it. Test it. Ship it. Run it back.";
const ITEMS: Item[] = [
  { title: "Say it in a sentence.", description: "Describe the goal. Joshuattio assembles the workflow for you to approve.", image: { id: "w1", src: "/img/img-2e3376aa31.avif", width: 2588, height: 1960 } },
  { title: "Test it block by block.", description: "Inspect every block and edit anything before the workflow goes live. ", image: { id: "w2", src: "/img/img-98e86d47a5.avif", width: 1294, height: 980 } },
  { title: "Run once or a million times.", description: "The same workflow runs on one record or your entire account list.", image: { id: "w3", src: "/img/img-a29a722a6f.avif", width: 1294, height: 980 } },
];

type Dir = "down" | "up";

function cx(...p: (string | false | null | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

function HLine({ dashed, className }: { dashed?: boolean; className?: string }) {
  return (
    <svg width="100%" height="1" className={cx("text-subtle-stroke", className)}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray={dashed ? "4 6" : undefined} strokeLinecap="round" />
    </svg>
  );
}

function VLine({ dashed, className }: { dashed?: boolean; className?: string }) {
  return (
    <svg width="1" height="100%" className={cx("text-subtle-stroke", className)}>
      <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray={dashed ? "4 6" : undefined} strokeLinecap="round" />
    </svg>
  );
}

function Dots({ id, className }: { id: string; className?: string }) {
  return (
    <svg width="100%" height="100%" className={cx("text-muted-strong-background", className)}>
      <defs>
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="5.5" y="5.5" width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Heading({ className, wrap }: { className?: string; wrap?: string }) {
  const inner = (
    <div className={cx("max-w-[20em] text-pretty text-heading-responsive-sm text-start", wrap)}>
      <h2 className="text-pretty inline">{TITLE}</h2>{" "}
      <p className="inline text-pretty font-medium text-black-800">{SUBTITLE}</p>
    </div>
  );
  if (!className) return inner;
  return <header className={className}>{inner}</header>;
}

function Progress({ value, className, onClick }: { value: number; className: string; onClick?: () => void }) {
  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${Math.round(value)}%`}
      role="progressbar"
      data-max="100"
      className={className}
      onClick={onClick}
    >
      <div data-max="100" className="size-full bg-accent-foreground" style={{ transform: `translateX(-${100 - value}%)` }} />
    </div>
  );
}

function DesktopItem({ item, active, progress, onClick }: { item: Item; active: boolean; progress: number; onClick: () => void }) {
  return (
    <div className="flex flex-col pt-7 transition-all">
      <div className="group contents">
        <h3
          className={cx("w-fit font-semibold text-lg text-secondary-foreground lg:max-xl:text-base", !active && "joshuattio-group-hover-underline cursor-pointer")}
          onClick={onClick}
        >
          {item.title}
        </h3>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ filter: "blur(1px)", height: 0, opacity: 0 }}
            animate={{
              filter: "blur(0px)",
              height: "auto",
              opacity: 1,
              transition: { filter: { duration: 0.5 }, height: { duration: 0.25 }, opacity: { duration: 0.5 } },
            }}
            exit={{
              filter: "blur(1px)",
              height: 0,
              opacity: 0,
              transition: { filter: { duration: 0.125 }, height: { delay: 0.5 / 8, duration: 0.25 }, opacity: { duration: 0.125 } },
            }}
            className="will-change-[height]"
          >
            <p className="mt-2 text-balance text-accent-foreground lg:max-xl:text-sm">{item.description}</p>
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
                filter: { delay: 0.125, duration: 0.5 },
                height: { duration: 0.25 },
                opacity: { delay: 0.125, duration: 0.5 },
              },
            }}
            exit={{
              filter: "blur(1px)",
              height: 0,
              opacity: 0,
              transition: { filter: { duration: 0.125 }, height: { duration: 0.25 }, opacity: { duration: 0.125 } },
            }}
            className="will-change-[height]"
          >
            <Progress value={progress} className="mt-5 h-0.5 w-full overflow-hidden rounded-full bg-subtle-stroke" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Scroll story: a 300svh track with a sticky panel. Progress through the
// track picks the active item (floor(p * n)) and fills its bar with the rest;
// clicking an item scrolls to the start of its slice.
export function WfTrilogy() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<Dir>("down");
  const [progress, setProgress] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const n = ITEMS.length;
  const { scrollYProgress } = useScroll({ offset: ["start start", "end end"], target: track });

  useMotionValueEvent(scrollYProgress, "change", (t) => {
    setDir(t - (scrollYProgress.getPrevious() ?? 0) > 0 ? "down" : "up");
    let a = Math.floor(t * n);
    if (a === n) a = n - 1;
    setActive(a);
    setProgress((t * n - a) * 100);
  });

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const span = r.height - window.innerHeight;
      const at = (i + 0.001) / n;
      animate(window.scrollY, top + at * span, {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1],
        onUpdate: (v) => window.scrollTo(0, v),
      });
    },
    [n],
  );

  const item = ITEMS[active];

  return (
    <div ref={track} className="relative flex h-[300svh] w-full flex-col">
      <div className="sticky top-(--site-header-height) flex w-full flex-col items-center justify-between h-[calc(100svh-var(--site-header-height))] py-[clamp(40px,5svh,160px)] max-lg:hidden">
        <HLine dashed />
        <VLine dashed className="min-h-10 flex-1" />
        <div className="relative grid h-135 grid-cols-12">
          <div className="relative col-[2/6] pb-80">
            <Heading />
            <div className="absolute inset-x-0 bottom-0">
              {ITEMS.map((it, i) => (
                <DesktopItem key={it.title} item={it} active={i === active} progress={progress} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>
          <div className="relative col-[7/-1] overflow-hidden border-subtle-stroke border-y">
            <Dots id="_R_adiqnpfiv9f9k7ivb_" className="absolute inset-0" />
            <AnimatePresence>
              <motion.div
                key={item.image.id}
                initial={{ filter: "blur(2px)", opacity: 0, y: dir === "down" ? "50%" : "-50%" }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                exit={{ filter: "blur(3px)", opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" loading="eager" width={item.image.width} height={item.image.height} decoding="async" className="max-h-140 max-w-140 size-full object-contain" srcSet={`${item.image.src} 1x`} src={item.image.src} style={{ color: "transparent" }} />
              </motion.div>
            </AnimatePresence>
          </div>
          <VLine className="absolute inset-y-0 left-1/2 -translate-x-1/2" />
          <div className="absolute inset-y-0 right-1/2 flex w-5 flex-col justify-between">
            <HLine dashed />
            <HLine dashed />
          </div>
        </div>
        <VLine dashed className="min-h-10 flex-1" />
        <HLine dashed />
      </div>
      <Heading
        className="grid grid-cols-12 pt-40 pb-20 max-xl:pt-30 max-xl:pb-16 max-lg:pt-25 max-lg:pb-15 justify-items-start lg:hidden [@media(min-height:1000px)]:hidden"
        wrap="col-[2/-2] mix-blend-multiply dark:mix-blend-screen"
      />
      <div className="sticky top-(--site-header-height) flex w-full flex-col items-center justify-between py-[clamp(40px,5svh,160px)] h-[calc(100svh-var(--site-header-height))] lg:hidden">
        <Heading
          className="grid grid-cols-12 pt-40 pb-20 max-xl:pt-30 max-xl:pb-16 max-lg:pt-25 max-lg:pb-15 justify-items-start lg:hidden [@media(max-height:1000px)]:hidden"
          wrap="col-[2/-2] mix-blend-multiply dark:mix-blend-screen"
        />
        <HLine dashed />
        <div className="relative mt-8 aspect-square w-full flex-1 overflow-hidden">
          <Dots id="_R_5qiqnpfiv9f9k7ivb_" className="absolute inset-0" />
          <AnimatePresence>
            <motion.div
              key={item.image.id}
              initial={{ filter: "blur(2px)", opacity: 0, x: dir === "down" ? "100%" : "-100%" }}
              animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
              exit={{ filter: "blur(3px)", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" loading="eager" width={item.image.width} height={item.image.height} decoding="async" className="size-full object-contain" srcSet={`${item.image.src} 1x`} src={item.image.src} style={{ color: "transparent" }} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative grid w-full grid-cols-12">
          <div className="relative col-[2/-2] h-48">
            <div className="absolute inset-x-0 bottom-8 h-32">
              <div className="absolute inset-x-0 top-8">
                <div className="flex gap-1.5">
                  {ITEMS.map((it, i) => (
                    <Progress
                      key={it.title}
                      value={i === active ? progress : 100 * Number(i < active)}
                      className="h-0.5 w-full cursor-pointer overflow-hidden rounded-full bg-subtle-stroke"
                      onClick={() => goTo(i)}
                    />
                  ))}
                </div>
                <AnimatePresence>
                  <motion.div
                    key={item.title}
                    initial={{ filter: "blur(1px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ filter: "blur(1px)", opacity: 0, transition: { duration: 0.125 } }}
                    className="absolute inset-x-0 top-5"
                  >
                    <h3 className="font-semibold text-lg text-secondary-foreground lg:max-xl:text-base">{item.title}</h3>
                    <p className="mt-2 text-pretty text-accent-foreground lg:max-xl:text-sm">{item.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <HLine dashed />
      </div>
    </div>
  );
}
