"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useResolvedReducedMotion } from "@/components/scale/use-reduced-motion";

type Mark = { src: string; width: number; height: number };
type Customer = {
  slug: string;
  href: string;
  name: string;
  overline: string;
  tagline: string;
  title: string;
  image: string;
  logo: Mark;
  mark: Mark;
};

const CUSTOMERS: Customer[] = [
  {
    slug: "customers/granola",
    href: "/customers/granola",
    name: "Granola",
    overline: "Artificial Intelligence",
    tagline: "83% faster lead triage",
    title: "How Granola turns product signals into revenue at scale",
    image: "/img/img-c05a7c8ed4.avif",
    logo: { src: "/img/img-575b6bfbe8.svg", width: 108, height: 23 },
    mark: { src: "/img/img-061fd78d7f.svg", width: 24, height: 24 },
  },
  {
    slug: "customers/railway",
    href: "/customers/railway",
    name: "Railway",
    overline: "Cloud Computing",
    tagline: "100% adoption, no admin",
    title: "How Railway built a lead engine the whole team runs on",
    image: "/img/img-d9accaac96.avif",
    logo: { src: "/img/img-1006c9d57c.svg", width: 118, height: 27 },
    mark: { src: "/img/img-72af8ec5f6.svg", width: 22, height: 22 },
  },
  {
    slug: "customers/modal",
    href: "/customers/modal",
    name: "Modal",
    overline: "Artificial Intelligence",
    tagline: "Faster outbound targeting",
    title: "How Modal combines product and CRM data into pipeline",
    image: "/img/img-f27f7aacaa.avif",
    logo: { src: "/img/img-af7a948e15.svg", width: 123, height: 27 },
    mark: { src: "/img/img-6d69638fdc.svg", width: 42, height: 22 },
  },
  {
    slug: "customers/taskrabbit",
    href: "/customers/taskrabbit",
    name: "Taskrabbit",
    overline: "Marketplace",
    tagline: "4x faster sales updates",
    title: "How Taskrabbit scales global partnerships on Joshuattio",
    image: "/img/img-685e10af51.avif",
    logo: { src: "/img/img-c27b7e101c.svg", width: 133, height: 17 },
    mark: { src: "/img/img-05b05946a1.svg", width: 35, height: 24 },
  },
];

const EASE_SWITCH = [0.33, 1, 0.68, 1] as const;
const DUR_SWITCH = 0.5;
const DUR_EXIT = 0.3;
const BLUR_REVEAL = 1.5;
const BLUR_IMAGE = 1;
const AUTOPLAY_MS = 6000;
const SIZES = "(min-width: 992px) 696px, 100vw";
const FILL_IMG: CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  color: "transparent",
};

const cellWidth = (w: number, base: number) => `calc(var(--cell-h) * ${(w / base).toFixed(4)})`;
const srcSet = (src: string) => [640, 750, 828, 1080, 1200, 1920, 2048, 3840].map((w) => `${src} ${w}w`).join(", ");

function Mask({ m, name, width, className }: { m: Mark; name: string; width: string; className: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={className}
      style={{
        aspectRatio: `${m.width} / ${m.height}`,
        height: "auto",
        maskImage: `url(${m.src})`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maxWidth: "100%",
        WebkitMaskImage: `url(${m.src})`,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        width,
      }}
    />
  );
}

// Customer story switcher: logo tab strip with a 6s linear progress fill that
// auto-advances while in view, paused on hover / focus, stopped for good on click.
export function CustomersTabs() {
  const reduce = useResolvedReducedMotion();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [dir, setDir] = useState<"positive" | "negative">("positive");
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [paused, setPaused] = useState(false);
  const cur = CUSTOMERS[active];
  const running = autoplay && !paused && !reduce && CUSTOMERS.length > 1 && inView;
  const sign = dir === "positive" ? 1 : -1;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setDir("positive");
        setActive((i) => (i + 1) % CUSTOMERS.length);
      }
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div
      ref={root}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <span aria-live="polite" className="sr-only">
        {cur.overline ? `${cur.overline}: ` : ""}
        {cur.tagline}
        {". "}
        {cur.title}
        {"."}
      </span>
      <div
        className="@container grid gap-px border-subtle-stroke border-b bg-subtle-stroke"
        style={{ "--cell-h": "clamp(3.5rem, 7.8cqw, 5rem)", gridTemplateColumns: `repeat(${CUSTOMERS.length}, minmax(0, 1fr))` } as CSSProperties}
      >
        {CUSTOMERS.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.slug}
              type="button"
              aria-pressed={on}
              onClick={() => {
                if (i === active) return;
                setAutoplay(false);
                setDir(i > active ? "positive" : "negative");
                setActive(i);
              }}
              className={`group/tab relative flex h-[var(--cell-h)] cursor-pointer items-center justify-center overflow-hidden bg-primary-background transition-colors duration-200 ease-out${on ? "" : " hover:bg-white-300"}`}
            >
              <AnimatePresence>
                {on ? (
                  running ? (
                    <motion.span
                      key="tab-fill"
                      aria-hidden="true"
                      className="absolute inset-0 origin-left bg-white-200 will-change-[transform,opacity]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: { duration: reduce ? 0 : DUR_EXIT, ease: EASE_SWITCH },
                        scaleX: { duration: 6, ease: "linear" },
                      }}
                    />
                  ) : (
                    <motion.span
                      key="tab-fill"
                      aria-hidden="true"
                      className="absolute inset-0 origin-left bg-white-200 will-change-[transform,opacity]"
                      initial={{ opacity: 1, scaleX: 1 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ opacity: { duration: reduce ? 0 : DUR_EXIT, ease: EASE_SWITCH } }}
                    />
                  )
                ) : null}
              </AnimatePresence>
              <Mask
                m={c.mark}
                name={c.name}
                width={cellWidth(c.mark.width, 67)}
                className="block transition-colors duration-200 ease-out relative z-10 bg-secondary-foreground md:hidden"
              />
              <Mask
                m={c.logo}
                name={c.name}
                width={cellWidth(c.logo.width, 88)}
                className="transition-colors duration-200 ease-out relative z-10 hidden bg-secondary-foreground md:block"
              />
            </button>
          );
        })}
      </div>
      <a className="group grid grid-cols-1 lg:grid-cols-2" href={cur.href}>
        <div className="relative order-2 flex flex-col border-subtle-stroke border-t bg-primary-background px-[calc(100%/12)] py-6 lg:order-1 lg:min-h-[429px] lg:justify-end lg:border-t-0 lg:border-r lg:py-8 lg:pr-8 lg:pl-[calc(100%/12)]">
          <div className="pointer-events-none absolute inset-0 bg-secondary-background opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-80 group-hover:duration-50 group-active:opacity-100 group-active:duration-50" />
          <div className="relative grid mix-blend-multiply">
            <AnimatePresence initial={false}>
              <motion.div
                key={cur.slug}
                initial={{ filter: reduce ? "blur(0px)" : `blur(${BLUR_REVEAL}px)`, opacity: 0, x: reduce ? 0 : 12 * sign }}
                animate={{
                  filter: "blur(0px)",
                  opacity: 1,
                  x: 0,
                  transition: { duration: reduce ? 0 : DUR_SWITCH, ease: EASE_SWITCH },
                }}
                exit={{
                  filter: reduce ? "blur(0px)" : `blur(${BLUR_REVEAL}px)`,
                  opacity: 0,
                  transition: { duration: reduce ? 0 : DUR_EXIT, ease: EASE_SWITCH },
                }}
                className="col-start-1 row-start-1 flex flex-col gap-3 will-change-[transform,opacity,filter]"
              >
                {cur.overline ? <p className="text-accent-foreground text-overline">{cur.overline}</p> : null}
                <p className="max-w-[16em] text-balance font-display font-medium text-[28px] text-primary-foreground leading-[1.15] tracking-[-0.7px] lg:text-[32px] lg:tracking-[-0.8px]">
                  <span className="block">
                    {cur.tagline}
                    {"."}
                  </span>
                  <span className="block min-h-[3.45em] text-accent-foreground lg:min-h-0">
                    {cur.title}
                    {"."}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="relative order-1 aspect-[696/429] overflow-hidden border-subtle-stroke bg-white-300 lg:order-2 lg:aspect-auto">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0">
            {CUSTOMERS.map((c) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={c.slug} alt="" loading="eager" decoding="async" data-nimg="fill" className="object-cover" style={FILL_IMG} sizes={SIZES} srcSet={srcSet(c.image)} src={c.image} />
            ))}
          </div>
          <AnimatePresence initial={false}>
            <motion.div
              key={cur.slug}
              initial={{
                filter: reduce ? "blur(0px)" : `blur(${BLUR_IMAGE}px)`,
                opacity: 0,
                scale: reduce ? 1 : 1.015,
                x: reduce ? 0 : 5 * sign,
              }}
              animate={{
                filter: "blur(0px)",
                opacity: 1,
                scale: 1,
                x: 0,
                transition: { delay: reduce ? 0 : 0.05, duration: reduce ? 0 : DUR_SWITCH, ease: EASE_SWITCH },
              }}
              exit={{
                filter: reduce ? "blur(0px)" : `blur(${BLUR_IMAGE}px)`,
                opacity: 0,
                transition: { duration: reduce ? 0 : DUR_EXIT, ease: EASE_SWITCH },
              }}
              className="absolute inset-0 will-change-[transform,opacity,filter]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={cur.name}
                loading="lazy"
                decoding="async"
                data-nimg="fill"
                className="object-cover saturate-[0.55] transition duration-500 ease-out group-hover:scale-[1.005] group-hover:saturate-100"
                style={FILL_IMG}
                sizes={SIZES}
                srcSet={srcSet(cur.image)}
                src={cur.image}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </a>
    </div>
  );
}
