"use client";
import { useCallback, useRef, useState } from "react";
import { animate, useMotionValueEvent, useScroll } from "motion/react";

type Item = { title: string; description: string; image: string };

const PANEL_ID = "trilogy-183e3e48-cd5b-4944-892b-b87eb16bd0f9";

const imgSrcSet = (src: string) =>
  [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840].map((w) => `${src} ${w}w`).join(", ");

/** Split-panel scroll story: 300svh track, sticky panel, one step per third of the scroll with a progress bar. */
export function UcTrilogy({ title, subtitle, items }: { title: string; subtitle: string; items: Item[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start start", "end end"], target: trackRef });

  useMotionValueEvent(scrollYProgress, "change", (t) => {
    let i = Math.floor(t * items.length);
    if (i === items.length) i = items.length - 1;
    setActive(i);
    setProgress((t * items.length - i) * 100);
  });

  const goTo = useCallback(
    (index: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const span = r.height - window.innerHeight;
      const at = (index + 0.001) / items.length;
      animate(window.scrollY, top + at * span, {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1],
        onUpdate: (y) => window.scrollTo(0, y),
      });
    },
    [items.length],
  );

  return (
    <div ref={trackRef} className="relative flex h-[300svh] w-full flex-col">
      <div className="sticky top-(--site-header-height) grid h-[calc(100svh-var(--site-header-height))] grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1 [@media(min-width:600px)_and_(max-height:700px)]:grid-cols-2 [@media(min-width:600px)_and_(max-height:700px)]:grid-rows-1">
        <div className="flex min-h-0 flex-col justify-between gap-6 px-8 py-6 lg:px-[8.333%] lg:py-[clamp(24px,5svh,58px)] [@media(max-height:700px)]:px-6 [@media(max-height:700px)]:py-3">
          <div className="text-pretty text-start hidden max-w-120 font-medium text-heading-responsive-md leading-[1.15] lg:block [&>p]:text-black-700 [@media(max-height:700px)]:hidden">
            <h2 className="text-pretty inline">{title}</h2>{" "}
            <p className="inline text-pretty font-medium text-black-800">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-3 lg:gap-6 [@media(max-height:700px)]:gap-1">
            {items.map((item, n) => {
              const on = n === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  aria-pressed={on}
                  aria-controls={PANEL_ID}
                  onClick={() => goTo(n)}
                  className={`w-full cursor-pointer text-left transition-opacity focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-8 motion-reduce:transition-none lg:max-w-91${on ? "" : " opacity-30 hover:opacity-70 focus-visible:opacity-100"}`}
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
          id={PANEL_ID}
          role="region"
          aria-label={items[active]?.title}
          className="relative min-h-0 overflow-hidden border-subtle-stroke border-t bg-white-300 lg:border-t-0 lg:border-l [@media(min-width:600px)_and_(max-height:700px)]:border-t-0 [@media(min-width:600px)_and_(max-height:700px)]:border-l"
        >
          {items.map((item, r) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.image}
              alt=""
              aria-hidden={r !== active}
              loading="eager"
              width="2088"
              height="2562"
              decoding="async"
              data-nimg="1"
              className={`absolute inset-0 mx-auto size-full max-w-140 object-contain transition-opacity duration-300 motion-reduce:transition-none lg:max-w-none ${r === active ? "opacity-100" : "opacity-0"}`}
              style={{ color: "transparent" }}
              sizes="(min-width: 992px) 50vw, (min-width: 560px) 560px, 100vw"
              srcSet={imgSrcSet(item.image)}
              src={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
