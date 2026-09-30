"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { PLAYER_ICONS } from "./player-icons";
import "./careers.css";

// Team film shelf: a dimmed looping preview with a "Play video" pill. Playing
// fades the preview away and hands over to the hosted film inside a compact
// player chrome (play / pause, scrubber, mute, fullscreen) that auto-hides while
// the film runs and the pointer rests.

const VIDEO_ID = "1127230914";
const PLAYER_ORIGIN = "https://player.vimeo.com";
const AUTOHIDE_MS = 2000;

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);
const easeOutCubic = (e: number) => 1 - (1 - e) ** 3;

const CHROME_VARS = {
  "--media-box-arrow-background": "var(--color-black-100)",
  "--media-control-background": "rgba(0, 0, 0, 0.12)",
  "--media-control-height": "32px",
  "--media-control-hover-background": "rgba(0, 0, 0, 0.32)",
  "--media-control-padding": "0px",
  "--media-font-family": "var(--font-inter)",
  "--media-preview-time-background": "var(--color-black-100)",
  "--media-primary-color": "var(--color-white-100)",
  "--media-range-padding-left": "12px",
  "--media-range-padding-right": "12px",
  "--media-range-track-border-radius": "4px",
  "--media-secondary-color": "var(--color-black-100)",
  contain: "paint",
} as CSSProperties;

const CONTROL: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  height: "var(--media-control-height)",
  padding: "var(--media-control-padding)",
  color: "var(--media-primary-color)",
  cursor: "pointer",
  transition: "background .15s linear",
  verticalAlign: "middle",
};

function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

function PlayIcon12() {
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

function ChromeButton({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      className="careers-chrome-control rounded-lg"
      style={CONTROL}
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress();
        }
      }}
    >
      {children}
    </div>
  );
}

type Player = {
  playing: boolean;
  muted: boolean;
  current: number;
  duration: number;
  buffered: number;
};

function useFilm(frame: React.RefObject<HTMLIFrameElement | null>, onEnded: () => void) {
  const [state, setState] = useState<Player>({ playing: false, muted: false, current: 0, duration: 0, buffered: 0 });
  const ended = useRef(onEnded);
  useEffect(() => {
    ended.current = onEnded;
  }, [onEnded]);

  // Commands wait for the player's "ready" handshake (before it the frame still
  // holds a blank document, which rejects messages aimed at the player origin).
  const ready = useRef(false);
  const queue = useRef<string[]>([]);
  const post = useCallback(
    (method: string, value?: unknown) => {
      const msg = JSON.stringify(value === undefined ? { method } : { method, value });
      if (!ready.current) {
        queue.current.push(msg);
        return;
      }
      frame.current?.contentWindow?.postMessage(msg, PLAYER_ORIGIN);
    },
    [frame],
  );

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== PLAYER_ORIGIN || e.source !== frame.current?.contentWindow) return;
      let msg: { event?: string; method?: string; value?: unknown; data?: Record<string, number> };
      try {
        msg = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (msg.event === "ready") {
        ready.current = true;
        for (const m of queue.current.splice(0)) frame.current?.contentWindow?.postMessage(m, PLAYER_ORIGIN);
        for (const ev of ["play", "pause", "ended", "timeupdate", "progress", "volumechange"]) post("addEventListener", ev);
        post("getDuration");
        return;
      }
      if (msg.method === "getDuration" && typeof msg.value === "number") {
        setState((s) => ({ ...s, duration: msg.value as number }));
        return;
      }
      const data = msg.data ?? {};
      switch (msg.event) {
        case "play":
          setState((s) => ({ ...s, playing: true }));
          break;
        case "pause":
          setState((s) => ({ ...s, playing: false }));
          break;
        case "ended":
          setState((s) => ({ ...s, playing: false }));
          ended.current();
          break;
        case "timeupdate":
          setState((s) => ({ ...s, current: data.seconds ?? s.current, duration: data.duration ?? s.duration }));
          break;
        case "progress":
          setState((s) => ({ ...s, buffered: data.percent ?? s.buffered }));
          break;
        case "volumechange":
          setState((s) => ({ ...s, muted: (data.volume ?? 1) === 0 }));
          break;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [frame, post]);

  return { state, setState, post };
}

function TimeRange({ current, duration, buffered, onSeek }: { current: number; duration: number; buffered: number; onSeek: (t: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const ratio = drag ?? (duration > 0 ? current / duration : 0);

  const at = (e: ReactPointerEvent) => {
    const el = ref.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(ratio * duration)}
      className="careers-chrome-control rounded-lg"
      style={{
        ...CONTROL,
        flexGrow: 1,
        minWidth: 0,
        paddingLeft: "var(--media-range-padding-left)",
        paddingRight: "var(--media-range-padding-right)",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(at(e));
      }}
      onPointerMove={(e) => {
        if (drag !== null) setDrag(at(e));
      }}
      onPointerUp={(e) => {
        if (drag === null) return;
        const r = at(e);
        setDrag(null);
        if (duration > 0) onSeek(r * duration);
      }}
      onKeyDown={(e) => {
        if (!duration) return;
        if (e.key === "ArrowRight") onSeek(Math.min(duration, current + 10));
        if (e.key === "ArrowLeft") onSeek(Math.max(0, current - 10));
      }}
    >
      <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", minWidth: 40 }}>
        <div style={{ position: "absolute", width: "100%", height: 4 }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "var(--media-range-track-border-radius)", background: "rgb(255 255 255 / .2)" }}>
            <div style={{ position: "absolute", height: "100%", width: `${buffered * 100}%`, background: "rgb(255 255 255 / .4)" }} />
            <div style={{ position: "absolute", height: "100%", width: `${ratio * 100}%`, background: "var(--media-primary-color)" }} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${ratio * 100}%`,
              width: 10,
              height: 10,
              borderRadius: 10,
              translate: "-50% -50%",
              background: "var(--media-primary-color)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function VideoShelf({ title, description }: { title: string; description: string }) {
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const inView = useInView(root, { amount: 0.8, once: true });
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef(0);
  const onEnded = useCallback(() => setPlaying(false), []);
  const { state, setState, post } = useFilm(frame, onEnded);

  // The overlay button drives playback, like the source's `playing` prop.
  useEffect(() => {
    if (!mounted) return;
    post(playing ? "play" : "pause");
  }, [playing, mounted, post]);

  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), AUTOHIDE_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const hideChrome = idle && state.playing;

  const start = () => {
    setMounted(true);
    setPlaying(true);
    wake();
  };

  const togglePlay = () => {
    if (state.playing) post("pause");
    else post("play");
  };
  const toggleMute = () => {
    const next = !state.muted;
    post("setVolume", next ? 0 : 1);
    setState((s) => ({ ...s, muted: next }));
  };
  const toggleFullscreen = () => {
    const el = controller.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };
  const seek = (t: number) => {
    post("setCurrentTime", t);
    setState((s) => ({ ...s, current: t }));
  };

  const chromeStyle: CSSProperties = {
    opacity: hideChrome ? 0 : 1,
    transition: hideChrome ? "opacity 1s" : "opacity 0.25s",
    pointerEvents: "auto",
  };

  return (
    <div ref={root} className="relative grid aspect-video w-full overflow-hidden rounded-2xl bg-black-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: easeOutCubic }}
        className="contents"
      >
        <div
          ref={controller}
          className="relative flex flex-col justify-end"
          style={{ ...CHROME_VARS, cursor: hideChrome ? "none" : undefined }}
          onPointerMove={wake}
          onPointerDown={wake}
        >
          <div className="absolute inset-0 size-full" style={{ display: "block", width: "100%", height: "100%" }}>
            {mounted ? (
              <iframe
                ref={frame}
                src={`${PLAYER_ORIGIN}/video/${VIDEO_ID}?autoplay=1&controls=0&byline=0&portrait=0&title=0&vimeo_logo=0&autopause=0&playsinline=1&dnt=1`}
                title="Team film"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                className="absolute inset-0 size-full border-0"
                tabIndex={-1}
              />
            ) : null}
          </div>
          <div className="relative w-full p-4" style={chromeStyle}>
            <div className="w-full gap-x-2" style={{ display: "flex", alignItems: "center" }}>
              <ChromeButton label={state.playing ? "pause" : "play"} onPress={togglePlay}>
                <span className="p-1.5">
                  <Icon d={state.playing ? PLAYER_ICONS.pause : PLAYER_ICONS.play} />
                </span>
              </ChromeButton>
              <TimeRange current={state.current} duration={state.duration} buffered={state.buffered} onSeek={seek} />
              <ChromeButton label={state.muted ? "unmute" : "mute"} onPress={toggleMute}>
                <span className="p-1.5">
                  <Icon d={state.muted ? PLAYER_ICONS.off : PLAYER_ICONS.high} />
                </span>
              </ChromeButton>
              <ChromeButton label="enter fullscreen mode" onPress={toggleFullscreen}>
                <span className="p-1.5">
                  <Icon d={PLAYER_ICONS.enter} />
                </span>
              </ChromeButton>
            </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {!playing ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeInOutCubic, when: "beforeChildren" }}
            className="absolute inset-0 grid size-full place-items-center bg-black-0"
          >
            <video
              src="/media/vid-d3fb4be81e.mp4"
              aria-label="Video preview"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 size-full object-cover brightness-[0.6]"
            />
            <div className="relative flex w-full max-w-md flex-col items-center justify-center">
              {inView ? (
                <>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ bounce: 0, duration: 0.3 }}
                    className="mb-3 text-center text-overline text-white-900 max-md:hidden"
                  >
                    {title}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ bounce: 0, delay: 0.1, duration: 0.5 }}
                    className="mb-5 text-balance text-center font-semibold text-lg text-white-100 md:text-2xl"
                  >
                    {description}
                  </motion.p>
                  <motion.button
                    aria-label="Play video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ bounce: 0, delay: 0.2, duration: 0.3 }}
                    className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-full border-[0.5px] border-white-100/20 text-white-100 outline-[0.5px] outline-white-200/20 bg-radial-[at_50%_90%] bg-size-[200%_200%] bg-top from-white-100/20 via-white-100/12 to-70% to-white-100/8 cursor-pointer hover:bg-bottom focus-visible:bg-bottom active:border-white-100/32 active:opacity-75 transition-all duration-150 ease-in-out"
                    onClick={start}
                  >
                    <PlayIcon12 />
                    <span className="font-normal text-sm">{"Play video"}</span>
                  </motion.button>
                </>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-default-stroke outline-4 outline-white-300" />
    </div>
  );
}
