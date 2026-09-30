"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Section = { icon: string; title: string };
type Slide = { id: string; title: string; image: string | null; sections: Section[] };

const TEXT = "/img/img-8f37cc77e0.png";
const PARAGRAPH = "/img/img-b2fe05f436.png";

const SLIDES: Slide[] = [
  {
    id: "spiced",
    title: "SPICED",
    image: "/img/img-6aa9e3deff.avif",
    sections: [
      { icon: TEXT, title: "Situation" },
      { icon: PARAGRAPH, title: "Pain" },
      { icon: TEXT, title: "Impact" },
      { icon: TEXT, title: "Critical Event" },
      { icon: PARAGRAPH, title: "Decision" },
    ],
  },
  {
    id: "product-demo",
    title: "Product demo",
    image: "/img/img-e84c026710.png",
    sections: [
      { icon: TEXT, title: "Feedback" },
      { icon: PARAGRAPH, title: "Questions" },
      { icon: PARAGRAPH, title: "Concerns" },
    ],
  },
  {
    id: "customer-onboarding",
    title: "Customer onboarding",
    image: "/img/img-80477d9ed8.png",
    sections: [
      { icon: PARAGRAPH, title: "Challenges" },
      { icon: PARAGRAPH, title: "Usability Issues" },
      { icon: PARAGRAPH, title: "Product Requests" },
      { icon: PARAGRAPH, title: "Next Steps" },
    ],
  },
];

type Dir = "positive" | "negative";

const BUTTON = "inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-outline group relative border-subtle-stroke! hover:border-subtle-stroke! hover:bg-secondary-background! data-[active='true']:border-strong-stroke! data-[active='false']:text-tertiary-foreground! lg:text-secondary-foreground! lg:text-sm";

// Template tabs: picking a tab slides the title, the section list and the
// artwork in from the side of travel (blur 2px, 4px / 100% offset, 0.3s).
export function CiTemplates() {
  const [dir, setDir] = useState<Dir>("positive");
  const [index, setIndex] = useState(0);
  const select = (i: number) => {
    setDir(i > index ? "positive" : "negative");
    setIndex(i);
  };
  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-[2/-2] pb-5 max-lg:items-center">
          <div className="flex gap-2 mx-lg:gap-1.5 max-lg:flex-wrap max-lg:justify-center">
            {SLIDES.map((s, i) => (
              <button key={s.id} className={i === index ? `${BUTTON} pointer-events-none` : BUTTON} data-active={i === index ? "true" : "false"} onClick={() => select(i)}>
                <span>
                  {s.title}
                </span>
              </button>
            ))}
            <a href="#" className="inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost group relative gap-1 text-tertiary-foreground! hover:bg-secondary-background! lg:text-sm">
              <span>
                {"More"}
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="relative grid w-full grid-cols-12 mt-5 max-lg:mt-0">
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
          <svg width="100%" height="1" className="text-subtle-stroke absolute top-0 left-1/2 w-screen -translate-x-1/2">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
          <svg width="100%" height="1" className="text-subtle-stroke absolute bottom-0 left-1/2 w-screen -translate-x-1/2">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
        <div className="relative col-[2/-2] flex w-full border border-subtle-stroke max-xl:col-[2/-2] max-lg:col-span-full max-lg:aspect-video max-lg:border-x-0 max-md:aspect-5/4">
          <div className="relative my-px bg-white-100 w-3/10 max-lg:hidden">
            <svg width="1" height="100%" className="text-subtle-stroke absolute inset-y-0 right-0">
              <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
            </svg>
            {SLIDES.map((s, i) => (
              <AnimatePresence key={s.id} initial={false}>
                {index === i && (
                  <motion.div
                    key={s.id}
                    initial={{ filter: "blur(2px)", opacity: 0, x: dir === "positive" ? "4px" : "-4px" }}
                    animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                    exit={{ filter: "blur(3px)", opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-12 left-10 flex items-center gap-2 max-xl:top-12 max-xl:left-7.5"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="max-w-[20em] text-balance pr-6 font-display font-semibold text-2xl">
                        {s.title}
                      </h3>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
            <div className="absolute inset-x-10 bottom-10 max-xl:inset-x-7.5 max-xl:bottom-7.5">
              {SLIDES.map((s, i) => (
                <AnimatePresence key={s.id} initial={false}>
                  {index === i && (
                    <motion.div
                      key={s.id}
                      initial={{ filter: "blur(1.5px)", opacity: 0, x: dir === "positive" ? "4px" : "-4px" }}
                      animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                      exit={{ filter: "blur(2px)", opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute bottom-0 flex max-w-sm flex-col text-balance text-tertiary-foreground"
                    >
                      <h4 className="mt-2 mb-3 text-caption-foreground lg:max-xl:mb-2.5">
                        {"Sections"}
                      </h4>
                      {s.sections.map((sec) => (
                        <div key={sec.title} className="mb-2.5 flex items-center gap-2 last-of-type:mb-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt="" loading="eager" width="56" height="56" decoding="async" className="size-4 object-contain" style={{ color: "transparent" }} srcSet={`${sec.icon} 1x, ${sec.icon} 2x`} src={sec.icon} />
                          <p className="font-medium text-secondary-foreground lg:max-xl:text-sm">
                            {sec.title}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>
          <div className="relative flex overflow-hidden bg-secondary-background max-lg:aspect-video max-lg:w-full max-lg:justify-center max-md:aspect-square aspect-golden w-7/10">
            <svg width="100%" height="100%" className="text-muted-strong-background mask-[radial-gradient(circle,transparent_00%,black_100%)] absolute inset-0">
              <defs>
                <pattern id="_R_3aiqnpfiv9f9k7ivb_" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect x="5.5" y="5.5" width="1" height="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#_R_3aiqnpfiv9f9k7ivb_)" />
            </svg>
            {SLIDES.map((s, i) => (
              <AnimatePresence key={s.id} initial={false}>
                {index === i && (
                  <motion.div
                    key={s.id}
                    initial={{ filter: "blur(2px)", opacity: 0, x: dir === "positive" ? "100%" : "-100%" }}
                    animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                    exit={{ filter: "blur(3px)", opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {s.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="" loading="eager" width="3356" height="2056" decoding="async" className="size-full object-contain" style={{ color: "transparent" }} srcSet={`${s.image} 1x`} src={s.image} />
                    )}
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
