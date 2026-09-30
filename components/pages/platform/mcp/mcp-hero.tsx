"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

// CSS module class names (compiled into site.css).
const S = {
  boxReveal: "shelf-hero-for-mcp-module__lRYFwa__boxReveal",
  character: "shelf-hero-for-mcp-module__lRYFwa__character",
  chatgpt: "shelf-hero-for-mcp-module__lRYFwa__chatgpt",
  claude: "shelf-hero-for-mcp-module__lRYFwa__claude",
  contentRegion: "shelf-hero-for-mcp-module__lRYFwa__contentRegion",
  gemini: "shelf-hero-for-mcp-module__lRYFwa__gemini",
  grid: "shelf-hero-for-mcp-module__lRYFwa__grid",
  gridReveal: "shelf-hero-for-mcp-module__lRYFwa__gridReveal",
  grok: "shelf-hero-for-mcp-module__lRYFwa__grok",
  hero: "shelf-hero-for-mcp-module__lRYFwa__hero",
  logoCell: "shelf-hero-for-mcp-module__lRYFwa__logoCell",
  logoEntrance: "shelf-hero-for-mcp-module__lRYFwa__logoEntrance",
  logoTile: "shelf-hero-for-mcp-module__lRYFwa__logoTile",
  logoTileActive: "shelf-hero-for-mcp-module__lRYFwa__logoTileActive",
  perplexity: "shelf-hero-for-mcp-module__lRYFwa__perplexity",
  promptBox: "shelf-hero-for-mcp-module__lRYFwa__promptBox",
  promptButton: "shelf-hero-for-mcp-module__lRYFwa__promptButton",
  promptRegion: "shelf-hero-for-mcp-module__lRYFwa__promptRegion",
  promptSubmit: "shelf-hero-for-mcp-module__lRYFwa__promptSubmit",
  promptText: "shelf-hero-for-mcp-module__lRYFwa__promptText",
  visible: "shelf-hero-for-mcp-module__lRYFwa__visible",
};

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const LOGOS = [
  { className: S.chatgpt, name: "ChatGPT", src: "/img/img-1417977c46.svg", w: 24, h: 24 },
  { className: S.grok, name: "Grok", src: "/img/img-7538fceba4.svg", w: 24, h: 24 },
  { className: S.claude, name: "Claude", src: "/img/img-00e82ce3ea.svg", w: 44, h: 44 },
  { className: S.perplexity, name: "Perplexity", src: "/img/img-531d6fb68f.svg", w: 24, h: 24 },
  { className: S.gemini, name: "Gemini", src: "/img/img-f87d95f165.svg", w: 24, h: 24 },
];

type SendIcon = "up" | "right" | "send";
type Client = {
  accent: string;
  buttonColor: string;
  controlRadius: string;
  name: string;
  prompt: string;
  radius: string;
  sendIcon: SendIcon;
  shadow: string;
  stroke: string;
  surface: string;
  textColor: string;
};

const CLIENTS: Client[] = [
  {
    accent: "oklch(0.280940 0.000000 0.0000)",
    buttonColor: "oklch(1.000000 0.000000 0.0000)",
    controlRadius: "50%",
    name: "ChatGPT",
    prompt: "Find warm leads in Joshuattio",
    radius: "2rem",
    sendIcon: "up",
    shadow: "0 2px 8px oklch(0.000000 0.000000 0.0000 / 0.050980)",
    stroke: "oklch(0.921906 0.000000 0.0000)",
    surface: "oklch(1.000000 0.000000 0.0000)",
    textColor: "oklch(0.260325 0.000000 0.0000)",
  },
  {
    accent: "oklch(0.617148 0.137546 39.0427)",
    buttonColor: "oklch(0.987568 0.008520 67.7269)",
    controlRadius: "0.5rem",
    name: "Claude",
    prompt: "Update that deal in Joshuattio",
    radius: "0.875rem",
    sendIcon: "up",
    shadow: "0 2px 5px oklch(0.343767 0.026936 95.7226 / 0.078431)",
    stroke: "oklch(0.873134 0.015541 90.2483)",
    surface: "oklch(0.981775 0.005392 95.0986)",
    textColor: "oklch(0.343767 0.026936 95.7226)",
  },
  {
    accent: "oklch(0.552731 0.085969 208.6104)",
    buttonColor: "oklch(1.000000 0.000000 0.0000)",
    controlRadius: "0.375rem",
    name: "Perplexity",
    prompt: "Enrich accounts in Joshuattio",
    radius: "0.75rem",
    sendIcon: "right",
    shadow: "none",
    stroke: "oklch(0.857106 0.013305 185.0407)",
    surface: "oklch(0.990239 0.003949 106.4713)",
    textColor: "oklch(0.303872 0.040140 213.6814)",
  },
  {
    accent: "oklch(0.000000 0.000000 0.0000)",
    buttonColor: "oklch(1.000000 0.000000 0.0000)",
    controlRadius: "50%",
    name: "Grok",
    prompt: "Create a report in Joshuattio",
    radius: "1.5rem",
    sendIcon: "up",
    shadow: "none",
    stroke: "oklch(0.921906 0.000000 0.0000)",
    surface: "oklch(1.000000 0.000000 0.0000)",
    textColor: "oklch(0.000000 0.000000 0.0000)",
  },
  {
    accent: "oklch(0.911934 0.039562 260.1467)",
    buttonColor: "oklch(0.343328 0.086166 262.0955)",
    controlRadius: "50%",
    name: "Gemini",
    prompt: "Search my notes in Joshuattio",
    radius: "2rem",
    sendIcon: "send",
    shadow: "none",
    stroke: "transparent",
    surface: "oklch(0.965550 0.007946 253.8530)",
    textColor: "oklch(0.239292 0.000000 0.0000)",
  },
];

type Layout = { columns: number; contentRows: number; logoRows: number; topRows: number };
const INITIAL_LAYOUT: Layout = { columns: 4, contentRows: 6, logoRows: 1, topRows: 0 };

const totalRows = ({ contentRows, logoRows, topRows }: Layout) => topRows + contentRows + logoRows + 2;

function metrics(l: Layout) {
  const inset = l.columns / 4 - 1;
  return {
    contentEnd: l.topRows + l.contentRows,
    insetLeft: Math.max(0, inset - 1),
    insetRight: l.columns - Math.max(0, inset - 1),
    promptInset: inset,
    promptRow: l.topRows + l.contentRows + l.logoRows,
    rows: totalRows(l),
  };
}

function gridPath(l: Layout) {
  const { columns, topRows } = l;
  const { contentEnd, insetLeft, insetRight, promptInset, promptRow, rows } = metrics(l);
  const d: string[] = [];
  for (let e = 1; e < columns; e++) {
    if (e > insetLeft && e < insetRight) {
      if (topRows > 0) d.push(`M${e} 0V${topRows}`);
    } else d.push(`M${e} 0V${contentEnd}`);
    if (e > promptInset && e < columns - promptInset) d.push(`M${e} ${contentEnd}V${promptRow}`, `M${e} ${promptRow + 1}V${rows}`);
    else d.push(`M${e} ${contentEnd}V${rows}`);
  }
  for (let e = 1; e < rows; e++) {
    if (e > topRows && e < contentEnd) d.push(`M0 ${e}H${insetLeft}`, `M${insetRight} ${e}H${columns}`);
    else d.push(`M0 ${e}H${columns}`);
  }
  return d.join(" ");
}

function Grid({ activeApp, visible, layout }: { activeApp: string; visible: boolean; layout: Layout }) {
  return (
    <div aria-hidden="true" className={cx(S.grid, S.gridReveal, visible && S.visible)}>
      <svg className="absolute inset-0 h-full w-full text-subtle-stroke" viewBox={`0 0 ${layout.columns} ${totalRows(layout)}`} preserveAspectRatio="none" fill="none" shapeRendering="crispEdges">
        <path d={gridPath(layout)} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {LOGOS.map((logo, i) => (
        <div key={logo.name} data-mcp-logo={logo.name} className={cx(S.logoCell, S.logoEntrance, logo.className)} style={{ animationDelay: `${1600 + 80 * i}ms` }}>
          <div className={cx(S.logoTile, activeApp === logo.name && S.logoTileActive)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" loading="lazy" width={logo.w} height={logo.h} decoding="async" className={cx("h-full w-full object-contain", logo.name === "ChatGPT" && "brightness-0")} style={{ color: "transparent" }} src={logo.src} />
          </div>
        </div>
      ))}
    </div>
  );
}

const ICON_UP = "M6.52029 1.35461C6.74186 1.09971 7.04291 1.12433 7.23807 1.31949L11.237 5.31852C11.4601 5.54159 11.4601 5.90305 11.237 6.12613C11.014 6.34918 10.6526 6.34918 10.4295 6.12613L7.40604 3.1027V12.007C7.40578 12.3222 7.15002 12.5782 6.83475 12.5783C6.5194 12.5783 6.26371 12.3223 6.26346 12.007V3.1027L3.24002 6.12613C3.01694 6.34918 2.65451 6.34918 2.43143 6.12613C2.20878 5.90304 2.20858 5.54148 2.43143 5.31852L6.43045 1.31949L6.52029 1.35461Z";
const ICON_SEND = "M0.909424 2.94067C0.263132 1.64598 1.64375 0.276495 2.93286 0.933838L12.2278 5.67407C13.3192 6.23124 13.3181 7.79126 12.2258 8.34692L2.93384 13.0706C1.64391 13.726 0.265383 12.3546 0.91333 11.0608L2.94067 7.01001L0.909424 2.94067ZM3.8147 7.50024L1.80688 11.509C1.591 11.9403 2.05078 12.3974 2.48071 12.179L11.6858 7.50024H3.8147ZM2.47876 1.82544C2.04917 1.60638 1.58895 2.06195 1.80396 2.49341L3.80396 6.50024H11.6477L2.47876 1.82544Z";

function SendGlyph({ kind }: { kind: SendIcon }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      {kind === "right" ? (
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
      ) : (
        <path d={kind === "send" ? ICON_SEND : ICON_UP} fill="currentColor" />
      )}
    </svg>
  );
}

// Typed prompt loop: each client's prompt types in (450ms lead, 30ms per
// character, 800ms hold), then the box morphs to the next client over 850ms.
function runSequence(box: HTMLElement, shell: HTMLElement, onClient: (name: string) => void) {
  const surfaces = Array.from(box.querySelectorAll<HTMLElement>("[data-surface]"));
  const prompts = Array.from(box.querySelectorAll<HTMLElement>("[data-prompt]"));
  const sends = Array.from(box.querySelectorAll<HTMLElement>("[data-send]"));
  const chars = prompts.map((p) => Array.from(p.querySelectorAll<HTMLElement>("[data-character]")));
  const running = new Set<Animation>();
  let idx = 0;
  let phase: "typing" | "send" = "typing";
  let elapsed = 0;
  let typed = 0;
  let last: number | null = null;
  let inView = false;
  let raf = 0;

  function anim(el: Element, frames: Keyframe[], duration: number, easing = "cubic-bezier(0.65, 0, 0.35, 1)") {
    const a = el.animate(frames, { duration, easing, fill: "forwards" });
    running.add(a);
    a.onfinish = () => {
      a.commitStyles();
      a.cancel();
      running.delete(a);
    };
  }

  function tick(now: number) {
    elapsed += last === null ? 0 : now - last;
    last = now;
    if (phase === "typing") {
      const count = Math.max(0, Math.min(chars[idx].length, Math.floor((elapsed - 450) / 30)));
      if (count !== typed) {
        const row = chars[idx];
        row[typed - 1]?.removeAttribute("data-caret");
        for (let t = typed; t < count; t++) row[t].style.visibility = "visible";
        row[count - 1]?.setAttribute("data-caret", "");
        typed = count;
      }
      if (elapsed >= 450 + 30 * chars[idx].length + 800) {
        phase = "send";
        elapsed = 0;
        box.dataset.phase = "send";
        const next = (idx + 1) % prompts.length;
        chars[idx].at(-1)?.removeAttribute("data-caret");
        onClient(CLIENTS[next].name);
        anim(
          prompts[idx],
          [
            { filter: "blur(0px)", opacity: 1, transform: "translateY(0)" },
            { filter: "blur(2px)", opacity: 0, transform: "translateY(-3px)" },
          ],
          240,
          "cubic-bezier(0.32, 0, 0.67, 0)",
        );
        anim(shell, [{ borderRadius: CLIENTS[idx].radius }, { borderRadius: CLIENTS[next].radius }], 850);
        anim(surfaces[idx], [{ opacity: 1 }, { opacity: 0 }], 850);
        anim(surfaces[next], [{ opacity: 0 }, { opacity: 1 }], 850);
        anim(
          sends[idx],
          [
            { filter: "blur(0px)", opacity: 1 },
            { filter: "blur(2px)", opacity: 0 },
          ],
          850,
        );
        anim(
          sends[next],
          [
            { filter: "blur(2px)", opacity: 0 },
            { filter: "blur(0px)", opacity: 1 },
          ],
          850,
        );
      }
    } else if (elapsed >= 850) {
      for (const c of chars[idx]) c.style.visibility = "hidden";
      idx = (idx + 1) % prompts.length;
      prompts[idx].style.opacity = "1";
      prompts[idx].style.transform = "none";
      prompts[idx].style.filter = "none";
      typed = 0;
      elapsed = 0;
      phase = "typing";
      box.dataset.phase = "typing";
      box.dataset.client = CLIENTS[idx].name;
    }
    raf = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(raf);
    last = null;
    const play = inView && !document.hidden;
    for (const a of running) {
      if (play) a.play();
      else a.pause();
    }
    if (play) raf = requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      sync();
    },
    { threshold: 0.1 },
  );
  io.observe(box);
  document.addEventListener("visibilitychange", sync);

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
    cancelAnimationFrame(raf);
    for (const a of running) a.cancel();
    box.dataset.client = CLIENTS[0].name;
    box.dataset.phase = "typing";
    shell.style.borderRadius = CLIENTS[0].radius;
    onClient(CLIENTS[0].name);
    prompts.forEach((p, t) => {
      surfaces[t].style.opacity = t === 0 ? "1" : "0";
      sends[t].style.opacity = t === 0 ? "1" : "0";
      sends[t].style.filter = "none";
      p.style.opacity = t === 0 ? "1" : "0";
      p.style.transform = "none";
      p.style.filter = "none";
      for (const c of chars[t]) {
        c.style.visibility = "";
        c.removeAttribute("data-caret");
      }
    });
  };
}

function PromptBox({ active, onClientChange }: { active: boolean; onClientChange: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  useEffect(() => {
    const box = ref.current;
    if (!box || !active || reduce) return;
    const shell = box.querySelector<HTMLElement>("[data-shell]");
    if (!shell) return;
    return runSequence(box, shell, onClientChange);
  }, [active, reduce, onClientChange]);

  return (
    <div ref={ref} data-mcp-prompt-box="true" data-client="ChatGPT" data-phase="typing" className={S.promptBox}>
      <p className="sr-only">{"Use Joshuattio from your AI tools to find deals, log calls, and draft follow-ups."}</p>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div data-shell="true" className="absolute inset-0" style={{ borderRadius: CLIENTS[0].radius }}>
          {CLIENTS.map((c, i) => (
            <div key={c.name} data-surface="true" className="absolute inset-0 border" style={{ background: c.surface, borderColor: c.stroke, borderRadius: "inherit", boxShadow: c.shadow, opacity: i === 0 ? 1 : 0 }} />
          ))}
        </div>
        <div data-content="true" className="absolute inset-0 flex items-center">
          {CLIENTS.map((c, i) => (
            <p key={c.name} data-prompt="true" className={S.promptText} style={{ color: c.textColor, opacity: i === 0 ? 1 : 0 }}>
              {c.prompt.split(/(\s+)/).map((word, w) =>
                /^\s+$/.test(word) ? (
                  word
                ) : (
                  <span key={w} className="inline-block whitespace-nowrap">
                    {Array.from(word).map((ch, k) => (
                      <span key={k} data-character="true" className={S.character}>
                        {ch}
                      </span>
                    ))}
                  </span>
                ),
              )}
            </p>
          ))}
        </div>
        <div data-submit="true" className={S.promptSubmit}>
          <div className={S.promptButton}>
            {CLIENTS.map((c, i) => (
              <div key={c.name} data-send="true" className="absolute inset-0 flex items-center justify-center" style={{ background: c.accent, borderRadius: c.controlRadius, color: c.buttonColor, opacity: i === 0 ? 1 : 0 }}>
                <SendGlyph kind={c.sendIcon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function McpHeroSequence({ header }: { header: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>(INITIAL_LAYOUT);
  const reduce = useReducedMotion() ?? false;
  const [gridVisible, setGridVisible] = useState(false);
  const [boxVisible, setBoxVisible] = useState(false);
  const [activeApp, setActiveApp] = useState(CLIENTS[0].name);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setGridVisible(true));
    const t = setTimeout(() => setBoxVisible(true), 2100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const cs = getComputedStyle(el);
      const next: Layout = {
        columns: Number(cs.getPropertyValue("--columns")),
        contentRows: Number(cs.getPropertyValue("--content-rows")),
        logoRows: Number(cs.getPropertyValue("--logo-rows")),
        topRows: Number(cs.getPropertyValue("--top-rows")),
      };
      setLayout((prev) =>
        prev.columns === next.columns && prev.contentRows === next.contentRows && prev.logoRows === next.logoRows && prev.topRows === next.topRows ? prev : next,
      );
    };
    const ro = new ResizeObserver(read);
    ro.observe(el);
    read();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} data-mcp-hero="true" className={S.hero}>
      <Grid activeApp={activeApp} visible={gridVisible} layout={layout} />
      <div data-mcp-content-region="true" className={S.contentRegion}>
        <div className="relative z-10 flex w-full flex-col items-center">{header}</div>
      </div>
      <div data-mcp-prompt-region="true" className={S.promptRegion}>
        <div className={cx("relative h-full w-full", S.boxReveal, boxVisible && S.visible)}>
          <PromptBox active={boxVisible || reduce} onClientChange={setActiveApp} />
        </div>
      </div>
    </div>
  );
}
