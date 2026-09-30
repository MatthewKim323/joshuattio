"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { QR_PATHS } from "./qr-paths";

const LINKS = {
  Android: "https://play.google.com/store/apps/details?id=com.joshuattio",
  iOS: "https://apps.apple.com/app/joshuattio/id1511545395",
  "macOS Intel": "/desktop-app/download/darwin/x86_64",
  "macOS Silicon": "/desktop-app/download/darwin/aarch64",
} as const;

const RESPONSIVE_BUTTON =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3 button-primary";

/** OS name the way the download button labels it, from the user agent string. */
function detectOs(ua: string): string | undefined {
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/windows/i.test(ua)) return "Windows";
  if (/linux/i.test(ua)) return "Linux";
  return undefined;
}

/** CPU architecture token from the user agent string; a Mac UA usually carries none. */
function detectArch(ua: string): string | undefined {
  if (/\b(x86_64|x86-64|x64|win64|wow64|amd64)\b/i.test(ua)) return "amd64";
  if (/\b(ia32|i[3-6]86|x86)\b/i.test(ua)) return "ia32";
  if (/\b(aarch64|arm64|armv\d+|arm)\b/i.test(ua)) return "arm64";
  return undefined;
}

/** "Download for <os>": renders nothing until the platform is known, then fades in. */
export function HeaderDownloadButton({ className }: { className?: string }) {
  const [os, setOs] = useState<string | undefined>(undefined);
  const [newTab, setNewTab] = useState(true);
  const [href, setHref] = useState<string | undefined>(undefined);
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const name = detectOs(ua);
    setOs(name);
    setHref(name ? (LINKS as Record<string, string>)[name] : undefined);
    if (name === "macOS") {
      setNewTab(false);
      const arch = detectArch(ua);
      setHref(arch && !arch.toLowerCase().includes("arm") ? LINKS["macOS Intel"] : LINKS["macOS Silicon"]);
    }
  }, []);
  if (!os || !href) return null;
  return (
    <motion.div className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ bounce: 0, duration: 0.3 }}>
      <a href={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined} className={RESPONSIVE_BUTTON}>
        {`Download for ${os}`}
      </a>
    </motion.div>
  );
}

const DOCK_A = { delay: 0.2, duration: 0.5, ease: "easeInOut" } as const;
const DOCK_B = { delay: 0.5, duration: 0.5, ease: "easeInOut" } as const;

/** Glow behind the dock: fades in once on load. */
export function DockGlow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} className="absolute inset-0 flex items-center justify-center">
      {children}
    </motion.div>
  );
}

/** The app tile in the middle of the dock grows in from nothing and drops into place. */
export function DockAppTile({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ height: 0, marginLeft: 0, marginRight: 0, opacity: 0, width: 0, y: -20 }}
      animate={{ height: 80, marginLeft: 12, marginRight: 12, opacity: 1, width: 80, y: 0 }}
      transition={{ height: DOCK_A, marginLeft: DOCK_B, marginRight: DOCK_B, opacity: DOCK_B, width: DOCK_A, y: DOCK_B }}
      className="flex size-20 shrink-0 scale-105 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-b from-[#FCFCFC] to-[#F6F6F8]"
      style={{
        boxShadow:
          "0px 1px 1px -0.5px #00000033, 0px 4px 4px -2px #00000033, 0px 8px 8px -4px #00000033, 0px 16px 20px -8px #00000026, 0px -0.705px 0px 0px #0000004D inset, 0px 0.705px 0.705px 0px #FFFFFF1F inset",
      }}
    >
      {children}
    </motion.div>
  );
}

function QrIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="5" height="5" rx="2" transform="matrix(1 0 0 -1 6 11)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3H6C4.34315 3 3 4.34315 3 6V8M16 3H18C19.6569 3 21 4.34315 21 6V8M21 16V18C21 19.6569 19.6569 21 18 21H16M3 16V18C3 19.6569 4.34315 21 6 21H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect width="5" height="5" rx="2" transform="matrix(1 0 0 -1 6 18)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect width="5" height="5" rx="2" transform="matrix(1 0 0 -1 13 11)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect width="5" height="5" rx="2" transform="matrix(1 0 0 -1 13 18)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FINDERS = [
  ["M198.75 50H76.25H50V76.25V198.75V225H76.25H198.75H225V198.75V76.25V50H198.75ZM198.75 198.75H76.25V76.25H198.75V198.75Z", "M175 100H100V175H175V100Z"],
  ["M1048.75 50H926.25H900V76.25V198.75V225H926.25H1048.75H1075V198.75V76.25V50H1048.75ZM1048.75 198.75H926.25V76.25H1048.75V198.75Z", "M1025 100H950V175H1025V100Z"],
  ["M198.75 900H76.25H50V926.25V1048.75V1075H76.25H198.75H225V1048.75V926.25V900H198.75ZM198.75 1048.75H76.25V926.25H198.75V1048.75Z", "M175 950H100V1025H175V950Z"],
];

function QrCode({ which }: { which: keyof typeof QR_PATHS }) {
  return (
    <svg width="1125" height="1125" viewBox="0 0 1125 1125" fill="none" className="size-40">
      <path d="M1125 0H0V1125H1125V0Z" fill="white" />
      <path d={QR_PATHS[which]} fill="black" />
      {FINDERS.map(([ring, dot]) => (
        <g key={dot}>
          <path d={ring} fill="black" />
          <path d={dot} fill="black" />
        </g>
      ))}
      <rect width="325" height="325" transform="translate(400 400)" fill="white" />
      <text x="562.5" y="640" textAnchor="middle" fontSize="220" fontWeight="600" fill="#1C1D1F" style={{ fontFamily: "var(--font-inter-display, var(--font-inter)), sans-serif" }}>
        {"J"}
      </text>
    </svg>
  );
}

const SIDE_OFFSET = 12;

/** QR button beside a store link: opens a scannable code to the left of the button, bottom-aligned. */
export function QrPopover({ label, which }: { label: string; which: keyof typeof QR_PATHS }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const t = trigger.current?.getBoundingClientRect();
      const c = content.current?.getBoundingClientRect();
      if (!t) return;
      const w = c?.width ?? 0;
      const h = c?.height ?? 0;
      setPos({ x: Math.round(t.left - SIDE_OFFSET - w), y: Math.round(t.bottom - h) });
    };
    place();
    const raf = requestAnimationFrame(place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const n = e.target as Node;
      if (trigger.current?.contains(n) || content.current?.contains(n)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border text-base transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default size-9 rounded-[10px] max-lg:size-12 max-lg:rounded-xl button-outline"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen((o) => !o)}
      >
        <QrIcon />
      </button>
      {mounted &&
        createPortal(
          <div
            ref={content}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              transform: pos ? `translate(${pos.x}px, ${pos.y}px)` : "translate(0, -200%)",
              minWidth: "max-content",
              zIndex: 50,
            }}
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  role="dialog"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="relative flex origin-right flex-col items-center justify-center rounded-2xl bg-white-100 p-2"
                  style={{ boxShadow: "0px 6px 20px -2px #1C284014, 0px 2px 6px 0px #1C28400F" }}
                >
                  <QrCode which={which} />
                  <p className="text-center text-black-800 text-xs">{label}</p>
                  <div className="absolute inset-0 rounded-[inherit] shadow-[0_0_0_1px] shadow-black-100/10" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </>
  );
}
