"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1);

const POPUP_SHADOW =
  "0px 1px 2px 0px oklch(0 0 0 / 0.01),0px 2px 4px -1px oklch(0 0 0 / 0.02),0px 4px 8px -2px oklch(0 0 0 / 0.03),0px 8px 16px -4px oklch(0 0 0 / 0.04),0px 16px 32px -8px oklch(0 0 0 / 0.05)";

function embedUrl(url: string) {
  const id = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  return id ? `https://player.vimeo.com/video/${id}?autoplay=1&byline=0&portrait=0&title=0` : url;
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.15692 2.9802C3.86361 2.81399 3.5 3.02587 3.5 3.36301V8.63681C3.5 8.97395 3.86361 9.18584 4.15693 9.01962L8.81028 6.38272C9.10771 6.21418 9.10771 5.78565 8.81028 5.6171L4.15692 2.9802ZM2.5 3.36301C2.5 2.25964 3.68998 1.5662 4.64994 2.11018L9.30329 4.74708C10.2767 5.29868 10.2767 6.70114 9.30329 7.25274L4.64994 9.88964C3.68998 10.4336 2.5 9.74018 2.5 8.63681V3.36301Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Story header media: a muted looping preview with a "Play video" pill that opens
// the full interview in a modal. The preview pauses while the modal is open.
export function StoryHeaderVideo({
  preview,
  video,
  className,
}: {
  preview: string;
  video: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const id = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const v = previewRef.current;
    if (!v) return;
    if (open) v.pause();
    else v.play().catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevPad = html.style.paddingRight;
    const gap = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    popupRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      html.style.overflow = prevOverflow;
      html.style.paddingRight = prevPad;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div data-visual-test="blackout" className={`relative flex overflow-hidden bg-black-0 ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: easeInOutCubic, when: "beforeChildren" }}
        className="absolute inset-0 flex size-full items-center justify-center bg-black-0"
      >
        <video
          ref={previewRef}
          aria-label="Customer case preview video"
          className="absolute inset-0 size-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={preview} type="video/mp4" />
        </video>
        <div className="relative flex w-full max-w-md flex-col items-center justify-center">
          <motion.button
            ref={triggerRef}
            aria-label="Play customer case video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ bounce: 0, delay: 0.2, duration: 0.3 }}
            className="flex items-center gap-x-1.5 px-3 py-1.5 backdrop-blur-xs rounded-full border-[0.5px] border-white-100/20 text-white-100 outline-[0.5px] outline-white-200/20 bg-radial-[at_50%_90%] bg-size-[200%_200%] bg-top from-white-100/20 via-white-100/12 to-70% to-white-100/8 cursor-pointer hover:bg-bottom focus-visible:bg-bottom active:border-white-100/32 active:opacity-75 transition-all duration-150 ease-in-out"
            type="button"
            data-base-ui-click-trigger=""
            id={`trigger-${id}`}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <PlayIcon />
            <span className="font-normal text-sm">{"Play video"}</span>
          </motion.button>
          {mounted &&
            createPortal(
              <AnimatePresence>
                {open && (
                  <div key="dialog">
                    <motion.div
                      role="presentation"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="z-(--dialog-overlay-z-index) fixed inset-0 cursor-pointer bg-black-50/96"
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                    <div
                      role="presentation"
                      className="z-(--dialog-content-z-index) fixed inset-0 flex items-center justify-center px-container"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) setOpen(false);
                      }}
                    >
                      <motion.div
                        ref={popupRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Customer case video"
                        tabIndex={-1}
                        initial={{ filter: "blur(2px)", opacity: 0, scale: 0.99, y: 2 }}
                        animate={{
                          filter: "blur(0px)",
                          opacity: 1,
                          scale: 1,
                          transition: { delay: 0.1, duration: 0.3, ease: "easeInOut" },
                          y: 0,
                        }}
                        exit={{
                          filter: "blur(6px)",
                          opacity: 0,
                          scale: 1.01,
                          transition: { duration: 0.2, ease: "easeInOut" },
                        }}
                        className="relative isolate aspect-video w-full max-w-7xl overflow-hidden rounded-xl bg-black-0 outline-none"
                        style={{ boxShadow: POPUP_SHADOW }}
                      >
                        <iframe
                          src={embedUrl(video)}
                          title="Customer case video"
                          allow="autoplay; fullscreen; picture-in-picture"
                          className="absolute inset-0 size-full border-0"
                        />
                      </motion.div>
                    </div>
                  </div>
                )}
              </AnimatePresence>,
              document.body,
            )}
        </div>
      </motion.div>
    </div>
  );
}
