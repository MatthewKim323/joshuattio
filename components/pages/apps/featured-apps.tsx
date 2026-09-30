"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type FeaturedApp = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  logo: string;
  image: string;
};

const FEATURED: FeaturedApp[] = [
  {
    slug: "typeform",
    title: "Typeform",
    description: "Link and respond to Typeform form submissions inside Joshuattio.",
    icon: "/img/img-6cd7ea2402.svg",
    logo: "/img/img-32d1694106.avif",
    image: "/img/img-d0c64fe8cc.avif",
  },
  {
    slug: "zapier",
    title: "Zapier",
    description: "Create workflows and automate tasks within Joshuattio, without the need for code.",
    icon: "/img/img-dd811c7bc3.svg",
    logo: "/img/img-503fcd5b98.avif",
    image: "/img/img-afe485c37e.png",
  },
  {
    slug: "slack",
    title: "Slack",
    description: "Receive Slack notifications when data in Joshuattio changes.",
    icon: "/img/img-e618daf58f.svg",
    logo: "/img/img-ff043b2ce9.avif",
    image: "/img/img-99230e90a2.png",
  },
  {
    slug: "aircall",
    title: "Aircall",
    description: "Make phone calls, bulk dial multiple records, and gain insights on every call.",
    icon: "/img/img-76179e0b49.svg",
    logo: "/img/img-4e1750f7a0.avif",
    image: "/img/img-fdff4da917.png",
  },
  {
    slug: "mailchimp",
    title: "Mailchimp",
    description: "Turn your Mailchimp emails into revenue with Joshuattio’s powerful automations.",
    icon: "/img/img-22c57e6463.svg",
    logo: "/img/img-0ee3629d21.avif",
    image: "/img/img-6721b4c268.png",
  },
];

const TAB =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-outline group !border-subtle-stroke hover:!border-subtle-stroke hover:!bg-secondary-background data-[active='true']:!border-strong-stroke data-[active='false']:!text-tertiary-foreground lg:!text-secondary-foreground lg:text-sm";
const LEARN_MORE =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-outline";
const TRANSITION = { duration: 0.3, ease: "easeInOut" } as const;

function DashedLine({ vertical = false, className }: { vertical?: boolean; className?: string }) {
  return (
    <svg width={vertical ? "1" : "100%"} height={vertical ? "100%" : "1"} className={`text-subtle-stroke${className ? ` ${className}` : ""}`}>
      <line x1={vertical ? "0.5" : "0"} y1={vertical ? "0" : "0.5"} x2={vertical ? "0.5" : "100%"} y2={vertical ? "100%" : "0.5"} stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
    </svg>
  );
}

/** Featured app tabs: picking a tab slides the detail, logo and artwork in from the side of travel. */
export function FeaturedApps() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"positive" | "negative">("positive");
  const current = FEATURED[active];

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-[2/-2] pb-5 max-lg:items-center">
          <div className="flex gap-2 mx-lg:gap-1.5 max-lg:flex-wrap max-lg:justify-center">
            {FEATURED.map((app, i) => (
              <div key={app.slug} className="relative">
                <button
                  className={`${TAB}${i === active ? " pointer-events-none" : ""}`}
                  data-active={i === active ? "true" : "false"}
                  onClick={() => {
                    setDirection(i > active ? "positive" : "negative");
                    setActive(i);
                  }}
                >
                  <img alt="" loading="eager" width="18" height="18" decoding="async" className="size-4 group-data-[active='false']:opacity-80" style={{ color: "transparent" }} src={app.icon} />
                  <span>{app.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mt-5 grid w-full grid-cols-12 max-lg:mt-0">
        <div aria-hidden="true" className="grid h-40 w-full grid-cols-12 overflow-hidden max-xl:h-30 max-lg:h-25 !h-5 absolute -top-5 max-lg:hidden">
          <div className="col-[2/-2] flex justify-between">
            <DashedLine vertical />
            <DashedLine vertical />
          </div>
        </div>
        <DashedLine className="absolute top-0 left-1/2 w-screen -translate-x-1/2" />
        <DashedLine className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2" />
        <div className="relative col-[2/-2] flex aspect-[2.39/1] w-full border border-subtle-stroke max-xl:col-[2/-2] max-lg:col-[1/-1] max-lg:aspect-video max-lg:border-x-0 max-md:aspect-5/4">
          <svg width="100%" height="100%" className="text-muted-strong-background absolute inset-0">
            <defs>
              <pattern id="apps-featured-dots" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect x="5.5" y="5.5" width="1" height="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#apps-featured-dots)" />
          </svg>
          <div className="relative my-px w-2/5 bg-white-100 max-lg:hidden">
            <DashedLine vertical className="absolute inset-y-0 right-0" />
            {FEATURED.map((app, i) => (
              <AnimatePresence key={app.slug} initial={false}>
                {active === i && (
                  <motion.div
                    key={app.slug}
                    initial={{ filter: "blur(2px)", opacity: 0, x: direction === "positive" ? "4px" : "-4px" }}
                    animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                    exit={{ filter: "blur(3px)", opacity: 0 }}
                    transition={TRANSITION}
                    className="absolute top-15 left-10 flex items-center gap-2 max-xl:top-15 max-xl:left-7.5"
                  >
                    <div className="relative size-8 overflow-hidden rounded-[30%]">
                      <img alt={app.title} loading="eager" width="512" height="512" decoding="async" className="size-full object-cover" style={{ color: "transparent" }} src={app.logo} />
                      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px] shadow-black-100/10" />
                    </div>
                    <h3 className="font-display font-semibold text-2xl">{app.title}</h3>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
            <div className="absolute inset-x-10 bottom-10 max-xl:inset-x-7.5 max-xl:bottom-7.5">
              <AnimatePresence initial={false}>
                <motion.p
                  key={current.slug}
                  initial={{ filter: "blur(1.5px)", opacity: 0, x: direction === "positive" ? "4px" : "-4px" }}
                  animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                  exit={{ filter: "blur(2px)", opacity: 0 }}
                  transition={TRANSITION}
                  className="absolute -top-16 max-w-sm text-balance text-tertiary-foreground max-xl:-top-24"
                >
                  {current.description}
                </motion.p>
              </AnimatePresence>
              <a className={LEARN_MORE} href={`/apps/${current.slug}`}>
                {"Learn more"}
              </a>
            </div>
          </div>
          <div className="relative flex w-3/5 overflow-hidden max-lg:aspect-video max-lg:w-full max-lg:justify-center max-md:aspect-square">
            {FEATURED.map((app, i) => (
              <AnimatePresence key={app.slug} initial={false}>
                {active === i && (
                  <motion.div
                    key={i}
                    initial={{ filter: "blur(2px)", opacity: 0, x: direction === "positive" ? "100%" : "-100%" }}
                    animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                    exit={{ filter: "blur(3px)", opacity: 0 }}
                    transition={TRANSITION}
                    className="absolute inset-0"
                  >
                    <a className="absolute flex size-full items-center justify-center lg:pointer-events-none lg:p-[5%]" href={`/apps/${app.slug}`}>
                      <img alt="" loading="eager" width="2000" height="2000" decoding="async" className="size-full object-contain" style={{ color: "transparent" }} src={app.image} />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
