"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Cell = { label: string | null; type: "person" | "stage" | "date" | "plain"; w: number };
type Row = { company: string; logo: string; data: Cell[] };

// Row data in source order. `w` is the resting width of each skeleton bar.
const ROWS: Row[] = [
  { company: "Vercel", logo: "/img/img-851c9eba53.avif", data: [
    { label: null, type: "person", w: 106 }, { label: null, type: "stage", w: 68 }, { label: null, type: "date", w: 70 }, { label: null, type: "plain", w: 72 }, { label: null, type: "plain", w: 113 },
  ] },
  { company: "DigitalOcean", logo: "/img/img-d52602bfd4.avif", data: [
    { label: null, type: "person", w: 91 }, { label: null, type: "stage", w: 73 }, { label: null, type: "date", w: 75 }, { label: null, type: "plain", w: 117 }, { label: null, type: "plain", w: 98 },
  ] },
  { company: "Github", logo: "/img/img-f5d2dac2b5.avif", data: [
    { label: null, type: "person", w: 107 }, { label: null, type: "stage", w: 69 }, { label: null, type: "date", w: 71 }, { label: null, type: "plain", w: 73 }, { label: null, type: "plain", w: 114 },
  ] },
  { company: "GreenLeaf", logo: "/img/img-01801621cb.avif", data: [
    { label: "Ashley Lawson", type: "person", w: 0 }, { label: "Lead", type: "stage", w: 0 }, { label: "in 7 days", type: "date", w: 0 }, { label: null, type: "plain", w: 97 }, { label: null, type: "plain", w: 78 },
  ] },
  { company: "Stripe", logo: "/img/img-88118d80ba.avif", data: [
    { label: null, type: "person", w: 67 }, { label: null, type: "stage", w: 69 }, { label: null, type: "date", w: 71 }, { label: null, type: "plain", w: 113 }, { label: null, type: "plain", w: 94 },
  ] },
];

function Underlined({ label, className }: { label: string; className?: string }) {
  return (
    <div className={className ? `relative ${className}` : "relative"}>
      <span className="font-medium text-primary-foreground text-sm">
        {label}
      </span>
      <span className="absolute inset-x-0 bottom-0 h-px rounded-full bg-weak-stroke" />
    </div>
  );
}

function PersonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M7.62793 0C9.30796 4.93112e-10 10.1483 0.000180683 10.79 0.327148C11.3543 0.614723 11.813 1.07347 12.1006 1.6377C12.4276 2.27941 12.4277 3.11978 12.4277 4.7998V7.2002C12.4277 8.88025 12.4276 9.72059 12.1006 10.3623C11.813 10.9265 11.3543 11.3853 10.79 11.6729C10.1483 11.9998 9.30796 12 7.62793 12H5.22754C3.54751 12 2.70714 11.9998 2.06543 11.6729C1.5012 11.3853 1.04245 10.9265 0.754883 10.3623C0.427913 9.72059 0.427734 8.88025 0.427734 7.2002V4.7998C0.427734 3.11978 0.427915 2.27941 0.754883 1.6377C1.04246 1.07347 1.50121 0.614723 2.06543 0.327148C2.70714 0.00018066 3.54751 4.91312e-10 5.22754 0H7.62793ZM5.39941 6.56152C4.16 6.56152 3.15527 7.56625 3.15527 8.80566C3.15552 9.3218 3.57369 9.7401 4.08984 9.74023H8.76562C9.28181 9.74013 9.69995 9.32182 9.7002 8.80566C9.7002 7.56625 8.69547 6.56152 7.45605 6.56152H5.39941ZM6.42773 2.25977C5.48651 2.25977 4.7238 3.02269 4.72363 3.96387C4.72363 4.90518 5.48641 5.66894 6.42773 5.66895C7.36907 5.66895 8.13184 4.90519 8.13184 3.96387C8.13167 3.02269 7.36897 2.25977 6.42773 2.25977Z" fill="currentColor" />
    </svg>
  );
}

const BAR_IN = { delay: 0.5, duration: 0.3, ease: "easeOut" } as const;

function CellBody({ label, type, w }: Cell) {
  switch (type) {
    case "person":
      if (label)
        return (
          <span className="flex items-center gap-x-1.5 text-blue-500">
            <PersonIcon />
            <Underlined className="text-primary-foreground" label={label} />
          </span>
        );
      return (
        <span className="flex items-center gap-x-1.5 text-subtle-stroke">
          <PersonIcon />
          <motion.div
            className="h-[7px] rounded-full bg-weak-stroke"
            initial={{ opacity: 0, width: 7 }}
            animate={{ opacity: 1, width: w }}
            transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
          />
        </span>
      );
    case "stage":
      if (label)
        return (
          <span className="flex items-center gap-x-1.5">
            <div className="grid size-3 place-items-center">
              <span className="size-[7.5px] rounded-full bg-[#F97514]" />
            </div>
            <span className="font-medium text-secondary-foreground text-sm">
              {label}
            </span>
          </span>
        );
      break;
    case "date":
      if (label)
        return (
          <span className="font-medium text-secondary-foreground text-sm">
            {label}
          </span>
        );
      break;
  }
  return (
    <motion.div
      className="h-5 rounded-lg border border-subtle-stroke bg-secondary-background"
      initial={{ opacity: 0, width: 20 }}
      animate={{ opacity: 1, width: w }}
      transition={BAR_IN}
    />
  );
}

// Hero records table: rows grow their skeleton bars in, then after 2s the
// GreenLeaf row slides up to second place and is highlighted for 1.8s.
export function HeroTableWidget() {
  const [rows, setRows] = useState(ROWS);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const green = ROWS[3];
    const [first, ...rest] = ROWS.slice(0, 3).concat(ROWS.slice(4));
    let inner: ReturnType<typeof setTimeout> | undefined;
    const t = setTimeout(() => {
      setFocus(true);
      setRows([first, green, ...rest]);
      inner = setTimeout(() => setFocus(false), 1800);
    }, 2e3);
    return () => {
      clearTimeout(t);
      if (inner) clearTimeout(inner);
    };
  }, []);

  return (
    <div className="grid w-full overflow-hidden [mask-composite:intersect] lg:[mask-image:linear-gradient(to_right,black,black_50%,transparent_70%,transparent),linear-gradient(to_bottom,black,black_75%,transparent)] sm:[mask-image:linear-gradient(to_right,black,black_80%,transparent),linear-gradient(to_bottom,black,black_60%,transparent)] [mask-image:linear-gradient(to_right,black,black_80%,transparent),linear-gradient(to_bottom,black,black_40%,transparent_85%,transparent)]" data-visual-test="blackout">
      <motion.div
        initial={{ filter: "blur(2px)", opacity: 0, y: 40 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="flex w-full min-w-280 origin-top-left flex-col gap-y-px overflow-hidden rounded-2xl border-2 border-subtle-stroke bg-primary-background max-sm:scale-85"
      >
        <div className="grid w-full gap-px" style={{"gridTemplateColumns":"repeat(6, 1fr)"}}>
          <div className="flex items-center justify-between bg-primary-background px-3 py-2.5 outline outline-weak-stroke">
            <div className="flex items-center">
              <span className="ml-1.5 font-medium text-primary-foreground text-sm">
                {"Company"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-primary-background px-3 py-2.5 outline outline-weak-stroke">
            <div className="flex items-center">
              <div className="grid size-3.5 place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.42578 4.15853C3.41512 2.42138 5.28366 1.25 7.42578 1.25C9.5679 1.25 11.4364 2.42138 12.4258 4.15853M2.42578 9.84146C3.41512 11.5786 5.28366 12.75 7.42578 12.75C9.5679 12.75 11.4364 11.5786 12.4258 9.84146" stroke="#717A88" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.3652 7.00001L8.67494 7.00001M8.67494 7.00001L10.6749 5M8.67494 7.00001L10.6749 9.00002" stroke="#717A88" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1.48828 7.00001L6.1722 7.00001M6.1722 7.00001L4.17219 5M6.1722 7.00001L4.17219 9.00002" stroke="#717A88" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="ml-1.5 font-medium text-primary-foreground text-sm">
                {"Associated People"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-primary-background px-3 py-2.5 outline outline-weak-stroke">
            <div className="flex items-center">
              <div className="grid size-3.5 place-items-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.35742" y="2" width="2.5" height="8" rx="1" stroke="#717A88" strokeWidth="1.1" />
                  <rect x="6.60742" y="2" width="2.5" height="11" rx="1" stroke="#717A88" strokeWidth="1.1" />
                  <rect x="10.8574" y="2" width="2.5" height="5" rx="1" stroke="#717A88" strokeWidth="1.1" />
                </svg>
              </div>
              <span className="ml-1.5 font-medium text-primary-foreground text-sm">
                {"Deal Stage"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-primary-background px-3 py-2.5 outline outline-weak-stroke">
            <div className="flex items-center">
              <div className="grid size-3.5 place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                  <path d="M6.28516 12.55C6.58891 12.55 6.83516 12.3038 6.83516 12C6.83516 11.6962 6.58891 11.45 6.28516 11.45V12.55ZM1.55764 10.635L1.06759 10.8847L1.06759 10.8847L1.55764 10.635ZM2.65018 11.7275L2.89987 11.2375L2.89987 11.2375L2.65018 11.7275ZM11.5577 2.12236L11.7277 1.59928L11.7277 1.59928L11.5577 2.12236ZM13.1628 3.72746L13.6859 3.5575L13.6859 3.5575L13.1628 3.72746ZM2.65018 2.27248L2.89987 2.76254L2.89987 2.76254L2.65018 2.27248ZM1.55764 3.36502L2.04769 3.61472L2.04769 3.61472L1.55764 3.36502ZM12.7342 5.00345C12.7361 5.3072 12.9839 5.55189 13.2877 5.54999C13.5914 5.54808 13.8361 5.3003 13.8342 4.99655L12.7342 5.00345ZM5.28516 2V2.55L9.78516 2.55V2V1.45L5.28516 1.45V2ZM1.28516 8H1.83516L1.83516 6H1.28516H0.735156L0.735156 8H1.28516ZM6.28516 12V11.45H5.28516V12V12.55H6.28516V12ZM1.28516 8H0.735156C0.735156 8.69099 0.734728 9.24231 0.771043 9.68678C0.807883 10.1377 0.885254 10.5268 1.06759 10.8847L1.55764 10.635L2.04769 10.3853C1.95754 10.2083 1.89867 9.98008 1.86739 9.59721C1.83558 9.20792 1.83516 8.70914 1.83516 8H1.28516ZM5.28516 12V11.45C4.57602 11.45 4.07724 11.4496 3.68795 11.4178C3.30508 11.3865 3.07681 11.3276 2.89987 11.2375L2.65018 11.7275L2.40049 12.2176C2.75833 12.3999 3.14748 12.4773 3.59837 12.5141C4.04285 12.5504 4.59417 12.55 5.28516 12.55V12ZM1.55764 10.635L1.06759 10.8847C1.36 11.4586 1.82659 11.9252 2.40049 12.2176L2.65018 11.7275L2.89987 11.2375C2.53296 11.0505 2.23465 10.7522 2.04769 10.3853L1.55764 10.635ZM9.78516 2V2.55C10.7586 2.55 11.1149 2.55679 11.3877 2.64544L11.5577 2.12236L11.7277 1.59928C11.2473 1.44321 10.673 1.45 9.78516 1.45V2ZM11.5577 2.12236L11.3877 2.64544C11.9814 2.83833 12.4468 3.30376 12.6397 3.89742L13.1628 3.72746L13.6859 3.5575C13.3842 2.62896 12.6562 1.90098 11.7277 1.59928L11.5577 2.12236ZM5.28516 2V1.45C4.59417 1.45 4.04285 1.44957 3.59837 1.48589C3.14748 1.52273 2.75833 1.6001 2.40049 1.78243L2.65018 2.27248L2.89987 2.76254C3.07681 2.67239 3.30508 2.61352 3.68795 2.58223C4.07724 2.55043 4.57602 2.55 5.28516 2.55V2ZM1.28516 6H1.83516C1.83516 5.29086 1.83558 4.79208 1.86739 4.40279C1.89867 4.01992 1.95754 3.79165 2.04769 3.61472L1.55764 3.36502L1.06759 3.11533C0.885254 3.47318 0.807883 3.86232 0.771043 4.31322C0.734728 4.75769 0.735156 5.30901 0.735156 6H1.28516ZM2.65018 2.27248L2.40049 1.78243C1.82659 2.07484 1.36 2.54143 1.06759 3.11533L1.55764 3.36502L2.04769 3.61472C2.23465 3.2478 2.53296 2.94949 2.89987 2.76254L2.65018 2.27248ZM13.2842 5L13.8342 4.99655C13.8304 4.39706 13.8145 3.95325 13.6859 3.5575L13.1628 3.72746L12.6397 3.89742C12.7075 4.10603 12.7303 4.38086 12.7342 5.00345L13.2842 5Z" fill="#5C5E63" />
                  <path d="M3.78516 5.25L10.7852 5.25" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.48438 1V2.75" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.0859 1V2.75" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10.7844" cy="9.8" r="2.8" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.134 8.75L11.134 9.8L10.084 9.8" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="ml-1.5 font-medium text-primary-foreground text-sm">
                {"Est. Close Date"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-primary-background px-3 py-2.5 outline outline-weak-stroke">
            <div className="flex items-center">
              <span className="ml-1.5 font-medium text-primary-foreground text-sm">
                {"Domains"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-primary-background px-3 py-2.5 outline outline-weak-stroke">
            <div className="flex items-center">
              <span className="ml-1.5 font-medium text-primary-foreground text-sm">
                {"Associated Deals"}
              </span>
            </div>
          </div>
        </div>
        {rows.map(({ company, logo, data }) => {
          const green = company === "GreenLeaf";
          return (
            <motion.div
              key={company}
              layout="position"
              animate={{
                opacity: focus ? (green ? 1 : 0.4) : 1,
                outline: focus && green ? 0 : 1,
                scale: focus && green ? 0.996 : 1,
              }}
              transition={{
                layout: { delay: 0.4, duration: 0.9, ease: "easeInOut" },
                opacity: { duration: 0.5, ease: "easeOut" },
                outline: { duration: 0.01 },
                scale: { duration: 0.5, ease: "easeOut" },
              }}
              className="relative grid w-full gap-px outline outline-weak-stroke"
              style={{ gridTemplateColumns: "repeat(6, 1fr)", zIndex: green ? 999 : 1 }}
            >
              <div className="flex items-center gap-x-1.5 bg-primary-background px-4 py-2.5">
                <div className="relative grid size-4 place-items-center rounded-[5px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={company} loading="lazy" width="16" height="16" decoding="async" className="size-4 rounded-[5px]" style={{ color: "transparent" }} srcSet={`${logo} 1x`} src={logo} />
                  <div className="absolute inset-0 rounded-[5px] border border-black-0/10" />
                </div>
                <Underlined label={company} />
              </div>
              {data.map((cell, i) => (
                <div key={i} className="flex items-center bg-primary-background px-3.5 py-2.5 outline outline-weak-stroke">
                  <CellBody {...cell} />
                </div>
              ))}
              {green && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: +!!focus }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 rounded-xl border border-blue-500/60 bg-blue-500/5"
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
