"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { animate, useMotionValueEvent, useScroll } from "motion/react";

export type TrilogyItem = {
  title: string;
  description: string;
  image: { src: string; width: number; height: number; alt: string };
};

const SIZES = "(min-width: 992px) 50vw, (min-width: 560px) 560px, 100vw";
const SRCSET_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

// Split-panel scroll story (agents page, images carry alt text): a 300svh track with a sticky panel. Scroll progress
// through the track picks the active item (floor(p * n)) and fills its bar with
// the remainder; clicking an item scrolls to the start of its slice.
export function AgentsTrilogy({ id, header, items }: { id: string; header: ReactNode; items: TrilogyItem[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (t) => {
    let idx = Math.floor(t * items.length);
    if (idx === items.length) idx = items.length - 1;
    setActive(idx);
    setProgress((t * items.length - idx) * 100);
  });

  const goTo = useCallback(
    (index: number) => {
      const el = track.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const span = rect.height - window.innerHeight;
      const at = (index + 0.001) / items.length;
      animate(window.scrollY, top + at * span, {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1],
        onUpdate: (v) => window.scrollTo(0, v),
      });
    },
    [items.length],
  );

  return (
    <div ref={track} className="relative flex h-[300svh] w-full flex-col">
      <div className="sticky top-(--site-header-height) grid h-[calc(100svh-var(--site-header-height))] grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1 [@media(min-width:600px)_and_(max-height:700px)]:grid-cols-2 [@media(min-width:600px)_and_(max-height:700px)]:grid-rows-1">
        <div className="flex min-h-0 flex-col justify-between gap-6 px-8 py-6 lg:px-[8.333%] lg:py-[clamp(24px,5svh,58px)] [@media(max-height:700px)]:px-6 [@media(max-height:700px)]:py-3">
          {header}
          <div className="flex flex-col gap-3 lg:gap-6 [@media(max-height:700px)]:gap-1">
            {items.map((item, n) => {
              const on = n === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  aria-pressed={on}
                  aria-controls={id}
                  onClick={() => goTo(n)}
                  className={cx(
                    "w-full cursor-pointer text-left transition-opacity focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-8 motion-reduce:transition-none lg:max-w-91",
                    !on && "opacity-30 hover:opacity-70 focus-visible:opacity-100",
                  )}
                >
                  <span className="block text-lg text-secondary-foreground">{item.title}</span>
                  <span className="block text-accent-foreground text-sm lg:text-base [@media(max-height:700px)]:text-sm">{item.description}</span>
                  <span
                    className="mt-2 block h-0.5 overflow-hidden bg-subtle-stroke lg:mt-3 [@media(max-height:700px)]:mt-1"
                    style={{ visibility: on ? "visible" : "hidden" }}
                    role="progressbar"
                    aria-label={`${item.title} scroll progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(on ? progress : 0)}
                  >
                    <span className="block size-full origin-left bg-accent-foreground" style={{ transform: `scaleX(${on ? progress / 100 : 0})` }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div
          id={id}
          role="region"
          aria-label={items[active]?.title}
          className="relative min-h-0 overflow-hidden border-subtle-stroke border-t bg-white-300 lg:border-t-0 lg:border-l [@media(min-width:600px)_and_(max-height:700px)]:border-t-0 [@media(min-width:600px)_and_(max-height:700px)]:border-l"
        >
          {items.map((item, r) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.image.src}
              alt={item.image.alt}
              aria-hidden={r !== active}
              loading="eager"
              width={item.image.width}
              height={item.image.height}
              decoding="async"
              data-nimg="1"
              className={cx(
                "absolute inset-0 mx-auto size-full max-w-140 object-contain transition-opacity duration-300 motion-reduce:transition-none lg:max-w-none",
                r === active ? "opacity-100" : "opacity-0",
              )}
              style={{ color: "transparent" }}
              sizes={SIZES}
              srcSet={SRCSET_WIDTHS.map((w) => `${item.image.src} ${w}w`).join(", ")}
              src={item.image.src}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
