"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

export type GalleryImage = { src: string; thumb: string };

const SIZES = "(min-width: 1024px) 960px, 100vw";
const SHADOW =
  "0px 1px 1px -0.5px rgba(28, 40, 64, 0.10),0px 4px 4px -1px rgba(28, 40, 64, 0.08),0px 4px 8px -2px rgba(28, 40, 64, 0.06),0px 16px 16px -8px rgba(28, 40, 64, 0.08)";
const THUMB_ON =
  "aspect-8/5 w-full appearance-none rounded-xl border bg-transparent p-0.5 transition-colors hover:border-subtle-stroke hover:duration-50 active:border-strong-stroke active:duration-0 pointer-events-none cursor-default border-strong-stroke duration-50";
const THUMB_OFF =
  "aspect-8/5 w-full cursor-pointer appearance-none rounded-xl border border-weak-stroke bg-transparent p-0.5 transition-colors duration-100 hover:border-subtle-stroke hover:duration-50 active:border-strong-stroke active:duration-0";
const BUTTON_BASE =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border text-base transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function ArrowRight14({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
    </svg>
  );
}

/** Screenshot gallery: main image opens a zoom dialog (shared-layout morph), thumbnails pick the image. */
export function AppGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [mask, setMask] = useState({ bottom: false, top: false });
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updateMask = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setMask({ bottom: el.scrollTop < el.scrollHeight - el.clientHeight, top: el.scrollTop > 0 });
  }, []);

  useEffect(() => {
    requestAnimationFrame(updateMask);
    const el = listRef.current;
    el?.addEventListener("scroll", updateMask, { passive: true });
    window.addEventListener("resize", updateMask);
    return () => {
      el?.removeEventListener("scroll", updateMask);
      window.removeEventListener("resize", updateMask);
    };
  }, [updateMask, height]);

  const onThumbKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowLeft") {
      const n = i === 0 ? images.length - 1 : i - 1;
      setIndex(n);
      thumbs.current[n]?.focus();
    } else if (e.key === "ArrowRight") {
      const n = i === images.length - 1 ? 0 : i + 1;
      setIndex(n);
      thumbs.current[n]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIndex(i);
    }
  };

  const maskClass =
    mask.bottom && !mask.top
      ? " [mask-image:linear-gradient(to_bottom,black_0,black_90%,transparent_100%)]"
      : mask.top && mask.bottom
        ? " [mask-image:linear-gradient(to_bottom,transparent_0,black_10%,black_90%,transparent_100%)]"
        : mask.top && !mask.bottom
          ? " [mask-image:linear-gradient(to_bottom,transparent_0,black_10%,black_100%)]"
          : "";

  const current = images[index];
  return (
    <div className="relative grid auto-cols-max grid-cols-10">
      <div className="col-[1/-1] lg:col-[1/-3]" ref={mainRef}>
        <ImageDialog
          trigger={
            <div className="relative flex aspect-8/5 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl bg-secondary-background lg:rounded-2xl" style={{ boxShadow: SHADOW }}>
              <img alt={`Selected gallery image ${index + 1} of ${images.length}`} width="1480" height="925" decoding="async" className="size-full object-cover" style={{ color: "transparent" }} sizes={SIZES} src={current.src} />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px] shadow-black-100/10" />
            </div>
          }
          left={
            <button
              aria-label="Previous image"
              className={`${BUTTON_BASE} size-9 rounded-[10px] max-lg:size-12 max-lg:rounded-xl button-outline`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(index === 0 ? images.length - 1 : index - 1);
              }}
            >
              <ArrowRight14 className="rotate-180" />
            </button>
          }
          right={
            <button
              aria-label="Next image"
              className={`${BUTTON_BASE} size-9 rounded-[10px] max-lg:size-12 max-lg:rounded-xl button-outline`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(index === images.length - 1 ? 0 : index + 1);
              }}
            >
              <ArrowRight14 />
            </button>
          }
          content={
            <img alt={`Full size gallery image ${index + 1} of ${images.length}`} width="1480" height="925" sizes={SIZES} src={current.src} loading="eager" decoding="async" className="overflow-hidden rounded-xl object-contain lg:rounded-2xl" style={{ color: "transparent" }} />
          }
        />
      </div>
      <div className="relative col-[1/-1] max-lg:row-start-2 lg:col-[-3/-1]">
        <div
          ref={listRef}
          className={`scrollbar-none grid grid-cols-3 gap-4 overflow-y-scroll pt-8 lg:flex lg:flex-col lg:items-center lg:px-5 lg:pt-0${maskClass}`}
          style={{ maxHeight: height }}
        >
          {images.map((img, i) => (
            <button
              key={img.thumb + i}
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              type="button"
              aria-label={`Gallery thumbnail ${i + 1} of ${images.length}${i === index ? " (selected)" : ""}`}
              aria-pressed={i === index}
              className={i === index ? THUMB_ON : THUMB_OFF}
              onClick={() => setIndex(i)}
              onKeyDown={(e) => onThumbKey(e, i)}
            >
              <div className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-secondary-background transition-opacity${i === index ? " opacity-70 duration-0" : " duration-100"}`}>
                <img
                  alt={`Gallery thumbnail ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                  style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent" }}
                  sizes="240px"
                  src={img.thumb}
                />
              </div>
            </button>
          ))}
        </div>
        {mask.top ? (
          <button className={`${BUTTON_BASE} size-9 rounded-[10px] button-ghost absolute -top-12 left-1/2 -translate-x-1/2`} onClick={() => listRef.current?.scrollBy({ behavior: "smooth", top: -200 })}>
            <ChevronDown className="rotate-180 text-caption-foreground" />
          </button>
        ) : null}
        {mask.bottom ? (
          <button className={`${BUTTON_BASE} size-9 rounded-[10px] button-ghost absolute -bottom-12 left-1/2 -translate-x-1/2`} onClick={() => listRef.current?.scrollBy({ behavior: "smooth", top: 200 })}>
            <ChevronDown className="text-caption-foreground" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ImageDialog({ trigger, content, left, right }: { trigger: React.ReactNode; content: React.ReactNode; left?: React.ReactNode; right?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const withNav = !!(left || right);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      if (open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    const onDown = (e: Event) => {
      const el = panelRef.current;
      if (el && !el.contains(e.target as Node) && open) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  return (
    <MotionConfig transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}>
      <motion.button
        ref={triggerRef}
        layoutId={`dialog-${id}`}
        className="relative block cursor-zoom-in"
        style={{ width: "100%" }}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`dialog-content-${id}`}
      >
        {trigger}
      </motion.button>
      {!mounted
        ? null
        : createPortal(
      <AnimatePresence initial={false} mode="sync">
        {open && (
          <div key={`portal-${id}`}>
            <motion.div
              key={`backdrop-${id}`}
              className="fixed inset-0 z-(--dialog-overlay-z-index) h-full w-full bg-white-800/40 backdrop-blur-xs dark:bg-black-100/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="fixed inset-8 z-(--dialog-content-z-index) flex items-center justify-center">
              <div
                ref={panelRef}
                id={`dialog-content-${id}`}
                className={`grid max-w-full items-center${withNav ? " grid-cols-[1fr_1fr] gap-3 [grid-template-areas:'image_image'_'previous_next'] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4 lg:[grid-template-areas:'previous_image_next']" : ""}`}
                role="dialog"
                aria-modal="true"
              >
                {left ? (
                  <motion.div className="justify-self-end [grid-area:previous] lg:justify-self-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                    {left}
                  </motion.div>
                ) : null}
                <motion.div
                  className={`relative grid max-w-(--breakpoint-lg) items-center overflow-hidden ${withNav ? "max-h-[calc(100vh-7.75rem)] [grid-area:image] lg:max-h-[calc(100vh-4rem)]" : "max-h-[calc(100vh-4rem)]"}`}
                  layoutId={`dialog-${id}`}
                >
                  {content}
                </motion.div>
                {right ? (
                  <motion.div className="justify-self-start [grid-area:next] lg:justify-self-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                    {right}
                  </motion.div>
                ) : null}
              </div>
              <motion.div aria-label="Close dialog" className="absolute top-2 right-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button className={`${BUTTON_BASE} size-9 rounded-[10px] button-outline`} onClick={() => setOpen(false)}>
                  <svg className="text-black-500 dark:text-white-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m12.5 5.5-7 7m7 0-7-7" />
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>,
            document.body,
          )}
    </MotionConfig>
  );
}
