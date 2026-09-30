"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useId, useState, type ReactNode } from "react";

// "Start building" flow: a REST API / SDK segmented control over five numbered
// steps. Switching flows exits the current steps bottom-up, then the new ones
// type in top-down (title letters on an ease-out-sqrt curve, then the copy).

type Part = { text: string; href?: string };
type Step = { title: string; description: Part[] };
type Flow = { title: string; icon: ReactNode; link: string; steps: Step[] };

const LISTING: Step = {
  title: "Configure your listing",
  description: [{ text: "Give your app a logo, a description, and screenshots, to show users what it does." }],
};
const PUBLISH: Step = {
  title: "Publish",
  description: [{ text: "Submit your app for review via the developer console, and share it with your users." }],
};
const CREATE: Step = {
  title: "Create your app",
  description: [
    { text: "Head over to our " },
    { text: "developer console", href: "/" },
    { text: " and sign in with your Joshuattio account. Create your app and give it a unique name." },
  ],
};

const API_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
                      <path d="M5.6709 1.74512C6.05904 1.75198 6.43681 1.89339 6.81738 2.08203C7.25629 2.29959 7.79192 2.62954 8.45899 3.04004L13.5488 6.17285L14.3789 6.68848C14.6249 6.84577 14.8399 6.9902 15.0225 7.12695C15.3868 7.39992 15.698 7.69622 15.8672 8.08789L15.9492 8.30957C16.0906 8.75889 16.0906 9.24111 15.9492 9.69043L15.8672 9.91211C15.698 10.3038 15.3868 10.6001 15.0225 10.873C14.8399 11.0098 14.6249 11.1542 14.3789 11.3115L13.5488 11.8271L8.45899 14.96C7.79192 15.3705 7.25629 15.7004 6.81738 15.918C6.43682 16.1066 6.05903 16.248 5.6709 16.2549L5.50391 16.249C4.92793 16.1999 4.39435 15.9366 4.00684 15.5156L3.84961 15.3252C3.5828 14.9643 3.48773 14.5165 3.44336 14.0332C3.39862 13.5455 3.39941 12.9159 3.39942 12.1328V5.86719C3.39941 5.08408 3.39862 4.45455 3.44336 3.9668C3.48773 3.48352 3.58281 3.03568 3.84961 2.6748L4.00684 2.48438C4.39435 2.06341 4.92792 1.8001 5.50391 1.75098L5.6709 1.74512ZM5.60547 2.94629C5.32985 2.96982 5.07499 3.09631 4.88965 3.29785L4.81445 3.38867C4.74837 3.47826 4.67657 3.65343 4.6377 4.07715C4.59921 4.49703 4.59863 5.06056 4.59863 5.86719V12.1328C4.59863 12.9394 4.5992 13.503 4.6377 13.9229C4.67657 14.3466 4.74836 14.5218 4.81445 14.6113L4.88965 14.7021C5.07499 14.9037 5.32986 15.0302 5.60547 15.0537L5.70508 15.0518C5.82213 15.0381 5.9982 14.9845 6.28418 14.8428C6.66206 14.6555 7.14273 14.3605 7.83008 13.9375L12.9199 10.8057L13.7324 10.2998C13.96 10.1544 14.1474 10.0285 14.3027 9.91211C14.6141 9.67883 14.722 9.53739 14.7656 9.43652L14.8047 9.33008C14.8723 9.11528 14.8723 8.88472 14.8047 8.66992L14.7656 8.56348C14.722 8.46261 14.6141 8.32117 14.3027 8.08789C14.1474 7.97152 13.96 7.84562 13.7324 7.7002L12.9199 7.19434L7.83008 4.0625C7.14273 3.63951 6.66206 3.34453 6.28418 3.15723C5.99819 3.01548 5.82213 2.96187 5.70508 2.94824L5.60547 2.94629Z" fill="currentColor" />
                    </svg>
);

const SDK_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
                      <g clipPath="url(#clip0_883_6505)">
                        <path d="M8.99999 15.9999H11.2C12.8801 15.9999 13.7202 15.9999 14.362 15.6729C14.9264 15.3853 15.3854 14.9264 15.673 14.3619C16 13.7202 16 12.8801 16 11.1999V6.8C16 5.11984 16 4.27976 15.673 3.63803C15.3854 3.07354 14.9264 2.6146 14.362 2.32698C13.7202 2 12.8801 2 11.2 2H8.99999M8.99999 15.9999H6.8C5.11984 15.9999 4.27976 15.9999 3.63803 15.6729C3.07354 15.3853 2.6146 14.9264 2.32698 14.3619C2 13.7202 2 12.8801 2 11.1999V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H8.99999M8.99999 15.9999V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 7.25H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 10.75H8.99999" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip0_883_6505">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
);

const FLOWS: Record<"api" | "sdk", Flow> = {
  api: {
    title: "REST API",
    icon: API_ICON,
    link: "/rest-api/",
    steps: [
      CREATE,
      {
        title: "Configure OAuth",
        description: [
          { text: "Configure OAuth for your app", href: "/rest-api/tutorials/connect-an-app-through-oauth" },
          { text: " and make authenticated requests to the Joshuattio API." },
        ],
      },
      {
        title: "Develop",
        description: [
          { text: "Use the " },
          { text: "REST API", href: "/rest-api/" },
          { text: " to read and write data in Joshuattio." },
        ],
      },
      LISTING,
      PUBLISH,
    ],
  },
  sdk: {
    title: "SDK",
    icon: SDK_ICON,
    link: "/sdk/",
    steps: [
      CREATE,
      {
        title: "Develop",
        description: [
          { text: "Use React, TypeScript, and our " },
          { text: "App SDK", href: "/sdk/" },
          { text: " to build your app that runs natively inside of Joshuattio." },
        ],
      },
      { title: "Manage authentication", description: [{ text: "Connect to your service by configuring OAuth or access tokens." }] },
      LISTING,
      PUBLISH,
    ],
  },
};

const KEYS = ["api", "sdk"] as const;

const BUTTON =
  "inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-accent-foreground !bg-transparent relative z-10 w-full text-sm hover:!text-tertiary-foreground active:!text-primary-foreground disabled:!text-primary-foreground";

function TypedTitle({ text, delay }: { text: string; delay: number }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="inline-block">
        {text.split("").map((ch, i) => (
          <motion.span
            key={`${text}-${i}`}
            className="inline-flex"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 1 - Math.sqrt(1 - i / text.length) + delay, duration: 0.01, ease: "easeInOut" },
            }}
            exit={{
              opacity: 0,
              transition: { delay: (0.24 / text.length) * (text.length - i), duration: 0.01, ease: "easeInOut" },
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
    </>
  );
}

function Description({ parts, delay }: { parts: Part[]; delay: number }) {
  return (
    <div>
      <motion.p
        className="text-pretty text-accent-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay, duration: 0.24, ease: "easeInOut" } }}
        exit={{ opacity: 0, transition: { delay: 0, duration: 0.24, ease: "easeInOut" } }}
      >
        {parts.map((p, i) =>
          p.href ? (
            <a
              key={i}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-px rounded-sm px-px underline transition-colors duration-400 hover:duration-150 active:duration-50 hover:decoration-transparent"
            >
              {p.text}
            </a>
          ) : (
            <Fragment key={i}>{p.text}</Fragment>
          ),
        )}
      </motion.p>
    </div>
  );
}

export function StartBuildingFlow() {
  const [selected, setSelected] = useState<"api" | "sdk">("sdk");
  const id = useId();
  const flow = FLOWS[selected];
  const n = flow.steps.length;
  return (
    <>
      <div className="relative mb-10 grid grid-cols-12">
        <div className="relative col-[2/-2]">
          <motion.div
            layout
            className="relative isolate grid w-fit gap-0.5 rounded-xl bg-surface-subtle p-0.5"
            style={{ gridTemplateColumns: `repeat(${KEYS.length}, 1fr)` }}
          >
            {KEYS.map((key) => (
              <div key={key} className="relative">
                {selected === key && (
                  <motion.div
                    layoutId={`segmented-control-background-${id}`}
                    className="absolute inset-0 z-0 rounded-[10px] bg-primary-background"
                    style={{
                      boxShadow:
                        "0px 0px 0px 1px rgba(28, 29, 31, 0.04),0px 1px 1px -0.5px rgba(28, 29, 31, 0.04),0px 3px 3px -1.5px rgba(28, 29, 31, 0.04)",
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                )}
                <button className={BUTTON} disabled={selected === key} onClick={() => setSelected(key)}>
                  <span>{FLOWS[key].icon}</span>
                  <span>{FLOWS[key].title}</span>
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="relative grid grid-cols-12">
        <div aria-hidden="true" className="grid h-40 w-full grid-cols-12 overflow-hidden max-xl:h-30 max-lg:h-25 absolute -top-5 h-5! max-lg:hidden">
          <div className="col-[2/-2] flex justify-between">
            <svg width="1" height="100%" className="text-subtle-stroke">
              <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
            </svg>
            <svg width="1" height="100%" className="text-subtle-stroke">
              <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <svg width="100%" height="1" className="text-subtle-stroke absolute top-0 max-lg:hidden">
          <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
        </svg>
        <svg width="100%" height="1" className="text-subtle-stroke absolute bottom-0 max-lg:hidden">
          <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
        </svg>
        <div
          className="size-full text-surface-subtle absolute inset-0 max-lg:hidden"
          style={{ backgroundImage: "repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)" }}
        />
        <div className="relative col-span-full flex flex-col border-subtle-stroke border-t bg-primary-background lg:col-[2/-2] lg:border">
          <div className="relative grid auto-rows-fr">
            <AnimatePresence mode="wait">
              {/* One keyed flow at a time; display:contents keeps the steps as the grid's rows. */}
              <motion.div key={selected} className="contents">
              {flow.steps.map((step, i) => (
                <motion.div key={selected + step.title} className="min-h-30">
                  <div className="relative grid h-full grid-cols-12 gap-y-2 py-5 max-lg:grid-rows-[auto_1fr] lg:grid-cols-20">
                    <div className="col-[2/3] flex items-start pt-1 max-lg:row-span-2 lg:col-[2/3] lg:pt-1.5">
                      <span className="relative inline-block h-full text-overline text-primary-foreground">
                        <motion.span
                          initial={{ opacity: 0.4 }}
                          animate={{ opacity: 1, transition: { delay: 0.4 * i + 0.2, duration: 0.2, ease: "easeInOut" } }}
                          exit={{ opacity: 0.4, transition: { delay: (n - i) * 0.08, duration: 0.08, ease: "easeInOut" } }}
                        >
                          {`0${i + 1}`}
                        </motion.span>
                        <span
                          className={`absolute top-6 left-1/2 block h-full w-px -translate-x-1/2 bg-subtle-stroke${i === n - 1 ? " hidden" : ""}`}
                        >
                          <motion.span
                            className="block h-full w-full bg-black-100"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1, transition: { delay: 0.4 * i + 0.2, duration: 0.3, ease: "easeInOut" } }}
                            exit={{ scaleY: 0, transition: { delay: (n - i) * 0.08, duration: 0.08, ease: "easeInOut" } }}
                            style={{ transformOrigin: "top center" }}
                          />
                        </span>
                      </span>
                    </div>
                    <div className="col-[3/-2] max-lg:pl-2 lg:col-[3/10]">
                      <h3 className="font-semibold text-base lg:text-lg">
                        <TypedTitle text={step.title} delay={0.4 * i + 0.1} />
                      </h3>
                    </div>
                    <p className="col-11 text-center text-overline leading-5 max-lg:hidden">{"//"}</p>
                    <div className="col-[3/-2] max-w-xs max-lg:pl-2 lg:col-[13/-2]">
                      <Description parts={step.description} delay={0.4 * i + 0.1} />
                    </div>
                    <svg
                      width="100%"
                      height="1"
                      className={`text-subtle-stroke absolute top-0 col-[3/-1] lg:col-[3/-1]${i === 0 ? " hidden" : ""}`}
                    >
                      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
                    </svg>
                  </div>
                </motion.div>
              ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <a
            href={flow.link}
            target="_blank"
            rel="noreferrer"
            className="group relative grid cursor-pointer grid-cols-12 items-baseline border-subtle-stroke border-t py-5 lg:grid-cols-20 max-lg:border-y"
          >
            <div className="pointer-events-none absolute inset-0 bg-secondary-background opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-80 group-hover:duration-50 group-active:opacity-100 group-active:duration-50" />
            <div className="relative col-[2/-2] flex items-center gap-2 mix-blend-multiply">
              <p className="font-medium text-base text-tertiary-foreground">
                {"Learn more "}
                <span className="max-sm:hidden">{"on docs.joshuattio.com"}</span>
                <span className="sm:hidden">{"in the docs"}</span>
              </p>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-[translate] duration-400 ease-in-out group-hover:translate-x-px group-hover:duration-150 group-active:translate-x-px group-active:duration-50"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
