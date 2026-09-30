"use client";
import { useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/components/hero/cn";
import { BLUR_IMAGE, EASE_UI } from "@/components/hero/ease";
import { Img, type StaticImage } from "@/components/hero/img";

function CallVideo({ canPlay: e, playbackTime: a }: { canPlay: boolean; playbackTime: number }) {
  let s: number,
    i = ((a - 600) / 2 + 37) / 100;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[3px] bg-black-100 lg:rounded-md">
      {e ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          preload="none"
          poster="/img/img-946fe5829c.jpg"
        >
          <source src="/media/vid-a389d1d543.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div
        className="absolute inset-x-0 bottom-0 flex h-[18px] flex-col justify-end gap-y-0.5 px-1 pb-[3px] lg:h-9 lg:gap-y-1 lg:px-2 lg:pb-1.5"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(35,37,41,0) 0%, rgba(35,37,41,0.75) 100%)",
        }}
      >
        <div className="flex w-full justify-between font-medium text-[4.5px] text-white-100 leading-none lg:text-[9px]">
          <span>{((s = Math.floor(a / 60)), `${s}:${(a % 60).toString().padStart(2, "0")}`)}</span>
          <span>{"28:14"}</span>
        </div>
        <div className="flex w-full items-center gap-x-0.5 lg:gap-x-1">
          <div className="h-[1.5px] grow rounded-full bg-white-100 lg:h-[3px]" />
          <div className="relative flex h-[1.5px] grow-[0.37] items-center rounded-full bg-white-100/40 lg:h-[3px]">
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white-100"
              animate={{ scaleX: i }}
            >
              <motion.div
                className="absolute top-1/2 -right-[1.5px] -mt-[1.5px] size-[3px] rounded-full border-[0.75px] border-white-500 bg-black-800 lg:-right-[3px] lg:-mt-[3px] lg:size-1.5 lg:border-[1.5px]"
                animate={{ scaleX: 1 / i }}
              />
            </motion.div>
          </div>
          <div className="h-[1.5px] grow-[0.63] rounded-full bg-white-100/40 lg:h-[3px]" />
          <div className="h-[1.5px] grow-[0.37] rounded-full bg-white-100/40 lg:h-[3px]" />
          <div className="h-[1.5px] grow-[0.63] rounded-full bg-white-100/40 lg:h-[3px]" />
          <div className="h-[1.5px] grow-[0.25] rounded-full bg-white-100/40 lg:h-[3px]" />
        </div>
      </div>
    </div>
  );
}
let callTabs = [
  {
    icon: function ({ ...e }) {
      return (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden={true} {...e}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H9V1.5C9 1.22386 9.22386 1 9.5 1C9.77614 1 10 1.22386 10 1.5V2.00544C10.2526 2.01019 10.479 2.01908 10.6827 2.03572C11.1305 2.07231 11.5123 2.14884 11.862 2.32698C12.4265 2.6146 12.8854 3.07354 13.173 3.63803C13.3512 3.98765 13.4277 4.36949 13.4643 4.81729C13.5 5.25457 13.5 5.79657 13.5 6.47806V6.47811V6.5V8.5V8.52189V8.52194C13.5 9.20343 13.5 9.74543 13.4643 10.1827C13.4277 10.6305 13.3512 11.0123 13.173 11.362C12.8854 11.9265 12.4265 12.3854 11.862 12.673C11.5123 12.8512 11.1305 12.9277 10.6827 12.9643C10.2454 13 9.70343 13 9.02194 13H9.02189H9H5H4.97811H4.97806C4.29657 13 3.75457 13 3.31729 12.9643C2.86949 12.9277 2.48765 12.8512 2.13803 12.673C1.57354 12.3854 1.1146 11.9265 0.826981 11.362C0.648839 11.0123 0.572308 10.6305 0.535721 10.1827C0.499993 9.74542 0.499996 9.2034 0.5 8.52188V8.5V6.5V6.47812C0.499996 5.7966 0.499993 5.25458 0.535721 4.81729C0.572308 4.36949 0.648839 3.98765 0.826981 3.63803C1.1146 3.07354 1.57354 2.6146 2.13803 2.32698C2.48765 2.14884 2.86949 2.07231 3.31729 2.03572C3.52097 2.01908 3.74737 2.01019 4 2.00544V1.5C4 1.22386 4.22386 1 4.5 1ZM9 3V3.5C9 3.77614 9.22386 4 9.5 4C9.77614 4 10 3.77614 10 3.5V3.00561C10.2282 3.01006 10.4257 3.01806 10.6013 3.0324C10.9872 3.06393 11.2228 3.12365 11.408 3.21799C11.7843 3.40973 12.0903 3.71569 12.282 4.09202C12.3764 4.27717 12.4361 4.51276 12.4676 4.89872C12.4996 5.29052 12.5 5.79168 12.5 6.5V8.5C12.5 9.20832 12.4996 9.70948 12.4676 10.1013C12.4361 10.4872 12.3764 10.7228 12.282 10.908C12.0903 11.2843 11.7843 11.5903 11.408 11.782C11.2228 11.8764 10.9872 11.9361 10.6013 11.9676C10.2095 11.9996 9.70832 12 9 12H5C4.29168 12 3.79052 11.9996 3.39872 11.9676C3.01276 11.9361 2.77717 11.8764 2.59202 11.782C2.2157 11.5903 1.90973 11.2843 1.71799 10.908C1.62365 10.7228 1.56393 10.4872 1.5324 10.1013C1.50039 9.70948 1.5 9.20832 1.5 8.5V6.5C1.5 5.79168 1.50039 5.29052 1.5324 4.89872C1.56393 4.51276 1.62365 4.27717 1.71799 4.09202C1.90973 3.71569 2.2157 3.40973 2.59202 3.21799C2.77717 3.12365 3.01276 3.06393 3.39872 3.0324C3.57426 3.01806 3.77176 3.01006 4 3.00561V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H9ZM3.49989 5.00002C3.22375 5.00002 2.99989 5.22388 2.99989 5.50002C2.99989 5.77616 3.22375 6.00002 3.49989 6.00002H10.4999C10.776 6.00002 10.9999 5.77616 10.9999 5.50002C10.9999 5.22388 10.776 5.00002 10.4999 5.00002H3.49989Z"
            fill="currentColor"
          />
        </svg>
      );
    },
    label: "Meeting",
  },
  {
    icon: function ({ ...e }) {
      return (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden={true} {...e}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 1.5C7.27614 1.5 7.5 1.72386 7.5 2V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V2C6.5 1.72386 6.72386 1.5 7 1.5ZM4.5 3C4.77614 3 5 3.22386 5 3.5V10.5C5 10.7761 4.77614 11 4.5 11C4.22386 11 4 10.7761 4 10.5V3.5C4 3.22386 4.22386 3 4.5 3ZM2.5 5.5C2.5 5.22386 2.27614 5 2 5C1.72386 5 1.5 5.22386 1.5 5.5V8.5C1.5 8.77614 1.72386 9 2 9C2.27614 9 2.5 8.77614 2.5 8.5V5.5ZM9.5 3C9.77614 3 10 3.22386 10 3.5V10.5C10 10.7761 9.77614 11 9.5 11C9.22386 11 9 10.7761 9 10.5V3.5C9 3.22386 9.22386 3 9.5 3ZM12.5 5.5C12.5 5.22386 12.2761 5 12 5C11.7239 5 11.5 5.22386 11.5 5.5V8.5C11.5 8.77614 11.7239 9 12 9C12.2761 9 12.5 8.77614 12.5 8.5V5.5Z"
            fill="currentColor"
          />
        </svg>
      );
    },
    label: "Transcript",
  },
  {
    icon: function ({ ...e }) {
      return (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden={true} {...e}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 2.5C6.17157 2.5 5.5 3.17157 5.5 4C5.5 4.82843 6.17157 5.5 7 5.5C7.82843 5.5 8.5 4.82843 8.5 4C8.5 3.17157 7.82843 2.5 7 2.5ZM4.5 4C4.5 2.61929 5.61929 1.5 7 1.5C8.38071 1.5 9.5 2.61929 9.5 4C9.5 5.38071 8.38071 6.5 7 6.5C5.61929 6.5 4.5 5.38071 4.5 4ZM6.22222 9C4.99492 9 4 9.99492 4 11.2222C4 11.3756 4.12437 11.5 4.27778 11.5H9.72222C9.87564 11.5 10 11.3756 10 11.2222C10 9.99492 9.00508 9 7.77778 9H6.22222ZM3 11.2222C3 9.44264 4.44264 8 6.22222 8H7.77778C9.55736 8 11 9.44264 11 11.2222C11 11.9279 10.4279 12.5 9.72222 12.5H4.27778C3.57208 12.5 3 11.9279 3 11.2222ZM1 10.5C1 9.67157 1.67157 9 2.5 9H2.51C2.78614 9 3.01 8.77614 3.01 8.5C3.01 8.22386 2.78614 8 2.51 8H2.5C1.11929 8 0 9.11929 0 10.5V10.75C0 11.4404 0.559644 12 1.25 12H1.5C1.77614 12 2 11.7761 2 11.5C2 11.2239 1.77614 11 1.5 11H1.25C1.11193 11 1 10.8881 1 10.75V10.5ZM11.45 8C11.1739 8 10.95 8.22386 10.95 8.5C10.95 8.77614 11.1739 9 11.45 9H11.5C12.3284 9 13 9.67157 13 10.5V10.75C13 10.8881 12.8881 11 12.75 11H12.5C12.2239 11 12 11.2239 12 11.5C12 11.7761 12.2239 12 12.5 12H12.75C13.4404 12 14 11.4404 14 10.75V10.5C14 9.11929 12.8807 8 11.5 8H11.45ZM3.43197 5.48568C3.26266 5.5116 3.08981 5.50226 2.92427 5.45826C2.75874 5.41426 2.60407 5.33655 2.46997 5.22998C2.33587 5.12342 2.22522 4.9903 2.14497 4.83898C2.06472 4.68766 2.01658 4.52139 2.00359 4.3506C1.99059 4.17981 2.01301 4.00817 2.06944 3.84645C2.12588 3.68473 2.2151 3.5364 2.33154 3.41077C2.44797 3.28515 2.58909 3.18492 2.74607 3.11638C2.90304 3.04784 3.07248 3.01246 3.24377 3.01246C3.51991 3.01246 3.74377 2.7886 3.74377 2.51246C3.74377 2.23632 3.51991 2.01246 3.24377 2.01246C2.93477 2.01246 2.6291 2.07628 2.34591 2.19993C2.06273 2.32358 1.80814 2.50439 1.59809 2.73102C1.38805 2.95766 1.22708 3.22523 1.12528 3.51698C1.02347 3.80873 0.983022 4.11837 1.00647 4.42648C1.02991 4.73459 1.11675 5.03453 1.26153 5.30752C1.4063 5.58051 1.60591 5.82064 1.84783 6.01289C2.08975 6.20513 2.36877 6.34533 2.6674 6.42471C2.96603 6.50408 3.27784 6.52092 3.58328 6.47416C3.85625 6.43238 4.04365 6.17723 4.00187 5.90426C3.96009 5.6313 3.70493 5.44389 3.43197 5.48568ZM11.0831 5.45629C10.9181 5.5012 10.7457 5.51165 10.5766 5.48696C10.3034 5.44708 10.0495 5.63627 10.0096 5.90951C9.96977 6.18276 10.1589 6.4366 10.4322 6.47648C10.7373 6.52101 11.0483 6.50217 11.3458 6.42115C11.6433 6.34013 11.9209 6.19865 12.1613 6.00556C12.4017 5.81247 12.5998 5.5719 12.743 5.29887C12.8863 5.02584 12.9718 4.72621 12.9941 4.41867C13.0164 4.11114 12.9751 3.8023 12.8728 3.51144C12.7704 3.22058 12.6092 2.95394 12.3992 2.72815C12.1893 2.50237 11.935 2.32229 11.6523 2.19915C11.3696 2.07601 11.0646 2.01246 10.7562 2.01246C10.4801 2.01246 10.2562 2.23632 10.2562 2.51246C10.2562 2.7886 10.4801 3.01246 10.7562 3.01246C10.9271 3.01246 11.0962 3.04769 11.2529 3.11594C11.4096 3.1842 11.5506 3.28403 11.667 3.40918C11.7834 3.53434 11.8727 3.68215 11.9295 3.84338C11.9862 4.00461 12.0091 4.1758 11.9967 4.34627C11.9844 4.51675 11.937 4.68284 11.8576 4.83419C11.7781 4.98553 11.6684 5.11889 11.5351 5.22592C11.4019 5.33296 11.248 5.41138 11.0831 5.45629Z"
            fill="currentColor"
          />
        </svg>
      );
    },
    label: "Speakers",
  },
];
function Initials({ className: e, initials: a }: { className?: string; initials: string }) {
  return (
    <span
      className={cn(
        "grid size-2 shrink-0 place-items-center rounded-full font-semibold text-[3px] text-white-100 leading-none ring-[0.5px] ring-black/10 lg:size-3.5 lg:text-[6px]",
        e,
      )}
    >
      {a}
    </span>
  );
}
let transcript = [
  {
    avatarClassName: "bg-red-500",
    initials: "A",
    name: "Ashley",
    text: "Everything's in spreadsheets right now and it's getting unmanageable. I'd like the whole team moved over by Monday if we can.",
    time: "0:02",
  },
  {
    avatarClassName: "bg-blue-500",
    initials: "S",
    name: "Sam",
    text: "We can have you live well before then. How many seats are you thinking?",
    time: "0:11",
  },
  {
    avatarClassName: "bg-red-500",
    initials: "A",
    name: "Ashley",
    text: "Six, on the Pro plan. I'll be the one signing off.",
    time: "0:24",
  },
  {
    avatarClassName: "bg-blue-500",
    initials: "S",
    name: "Sam",
    text: "Perfect, I'll send a Pro quote over today. It covers the workflow automations you flagged.",
    time: "0:38",
  },
  {
    avatarClassName: "bg-red-500",
    initials: "A",
    name: "Ashley",
    text: "Can we bring our existing deal history across too?",
    time: "0:55",
  },
  {
    avatarClassName: "bg-blue-500",
    initials: "S",
    name: "Sam",
    text: "Yep, we'll map it during onboarding, and I'll include a migration checklist.",
    time: "1:09",
  },
  {
    avatarClassName: "bg-red-500",
    initials: "A",
    name: "Ashley",
    text: "Love it. Looking forward to finally getting off spreadsheets.",
    time: "1:23",
  },
];
function Transcript({ playbackTime: e }: { playbackTime: number }) {
  let a = useRef<HTMLDivElement>(null),
    s = useRef<HTMLDivElement>(null),
    [i, n] = useState([0]),
    [l, o] = useState(0);
  (useEffect(() => {
    let e = a.current,
      t = s.current;
    if (!e || !t) return;
    let r = () => {
      let a = Math.max(0, t.offsetHeight - e.clientHeight),
        s = Array.from(t.children) as HTMLElement[],
        r = s[0]?.offsetTop ?? 0,
        i = s.map((e) => Math.min(e.offsetTop - r, a)),
        l = i.filter((e, t) => 0 === t || e !== i[t - 1]);
      n(l.length > 0 ? l : [0]);
    };
    r();
    let i = new ResizeObserver(r);
    return (i.observe(e), i.observe(t), () => i.disconnect());
  }, []),
    useEffect(() => {
      let t = Math.min(1, Math.max(0, (e - 600) / 17)),
        a = i.length,
        s = Math.min(a - 1, Math.floor(t * a));
      o((e) => (e === s ? e : s));
    }, [e, i.length]));
  let d = -(i[Math.min(l, i.length - 1)] ?? 0);
  return (
    <div className="px-1.5 pb-[7px] lg:px-3 lg:pb-3.5">
      <div
        ref={a}
        className="h-[58px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_9%,#000_84%,transparent)] lg:h-[112px]"
      >
        <motion.div
          ref={s}
          className="relative flex flex-col gap-y-1.5 pt-1 lg:gap-y-3 lg:pt-2"
          animate={{ y: d }}
          transition={{ bounce: 0, duration: 0.6, type: "spring" }}
        >
          {transcript.map((e) => (
            <div key={`${e.name}-${e.time}`} className="flex flex-col gap-y-0.5 lg:gap-y-1">
              <div className="flex items-center gap-x-[3px] lg:gap-x-1.5">
                <Initials className={e.avatarClassName} initials={e.initials} />
                <span className="font-semibold text-[5.5px] text-primary-foreground leading-none lg:text-[11px]">
                  {e.name}
                </span>
                <span className="ml-auto shrink-0 text-[4.5px] text-black-800 leading-none lg:text-[9px]">
                  {e.time}
                </span>
              </div>
              <p className="text-[5px] text-black-700 leading-[1.5] lg:text-[10px]">{e.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
export function CallWindowBody({ isActive: e }: { isActive: boolean }) {
  let a = useRef(null),
    s = useInView(a, { amount: 0.1, margin: "200px" }),
    [r, n] = useState(600),
    l = e && s;
  return (
    useEffect(() => {
      if (!l) return;
      let e = setInterval(() => {
        n((e) => (e >= 617 ? 600 : e + 1));
      }, 1e3);
      return () => clearInterval(e);
    }, [l]),
    (
      <div ref={a} className="flex flex-col">
        <div className="flex h-3.5 items-center border-subtle-stroke border-b px-1.5 lg:h-7 lg:px-3">
          <span className="truncate font-semibold text-[5.5px] text-primary-foreground lg:text-[11px]">
            {"Product Demo w/ GreenLeaf"}
          </span>
        </div>
        <div className="px-[3px] py-[3px] lg:px-1.5 lg:py-1.5">
          <CallVideo canPlay={l} playbackTime={r} />
        </div>
        <div className="flex items-center gap-x-0.5 border-subtle-stroke border-b px-1 pb-[3px] lg:gap-x-1 lg:px-2 lg:pb-1.5">
          {callTabs.map(({ icon: Icon, label: a }) => {
            let s = "Transcript" === a;
            return (
              <div
                key={a}
                className={cn(
                  "relative flex items-center gap-x-0.5 rounded-[3px] px-[3px] py-0.5 lg:gap-x-1 lg:rounded-md lg:px-1 lg:py-1",
                  { "border border-subtle-stroke bg-white-300": s },
                )}
              >
                <Icon
                  className={cn(
                    "size-1.5 lg:size-2.5",
                    s ? "text-primary-foreground" : "text-tertiary-foreground",
                  )}
                />
                <span
                  className={cn(
                    "font-medium text-[5px] leading-none lg:text-[10px]",
                    s ? "text-primary-foreground" : "text-tertiary-foreground",
                  )}
                >
                  {a}
                </span>
                {s && <div className="absolute inset-x-0 -bottom-[5px] h-px bg-black-50 lg:-bottom-2" />}
              </div>
            );
          })}
        </div>
        <Transcript playbackTime={r} />
      </div>
    )
  );
}
const slackAvatar: StaticImage = {
  src: "/img/img-1f497b5f04.avif",
  width: 382,
  height: 382,
};
function LogoMark({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 37 30" fill="none" aria-hidden={true} {...e}>
      <path
        fill="currentColor"
        d="m35.705 20.45-3.014-4.778s-.011-.02-.018-.029l-.238-.375a2.44 2.44 0 0 0-2.072-1.142l-4.854-.015-.34.537-5.8 9.195-.32.509 2.43 3.846a2.43 2.43 0 0 0 2.079 1.142h6.803c.839 0 1.633-.438 2.077-1.14l.24-.38s.009-.01.01-.015l3.02-4.784a2.41 2.41 0 0 0 0-2.572zm-.92 2-3.018 4.784q-.021.032-.042.058a.41.41 0 0 1-.652-.06l-3.02-4.784a1.3 1.3 0 0 1-.154-.344 1.37 1.37 0 0 1 0-.737c.034-.118.085-.236.152-.342l3.014-4.78.007-.01a.38.38 0 0 1 .24-.172c.031-.009.058-.011.08-.015h.034c.07 0 .243.022.35.195l3.014 4.777a1.34 1.34 0 0 1 0 1.43z"
      />
      <path
        fill="currentColor"
        d="M26.786 8.89a2.42 2.42 0 0 0 0-2.572l-3.014-4.777-.251-.402A2.44 2.44 0 0 0 21.442 0H14.64c-.85 0-1.626.426-2.08 1.142L.378 20.452A2.4 2.4 0 0 0 0 21.738c0 .453.13.9.374 1.284l3.268 5.181a2.44 2.44 0 0 0 2.076 1.14h6.804c.854 0 1.63-.427 2.079-1.142l.248-.391v-.005s.005-.006.005-.008l2.429-3.847 7.198-11.409 2.3-3.649zm-.71-1.286c0 .247-.07.496-.212.715L13.93 27.237a.41.41 0 0 1-.35.19c-.07 0-.24-.02-.35-.19l-3.016-4.786a1.35 1.35 0 0 1 0-1.428L22.15 2.11a.41.41 0 0 1 .35-.193c.069 0 .242.02.352.195l3.013 4.777c.142.22.211.469.211.715"
      />
    </svg>
  );
}
function useCycle<T>(e: T[], t: number, a: boolean): T {
  let [s, r] = useState(0);
  return (
    useEffect(() => {
      if (!a) return void r(0);
      let s = window.setInterval(() => {
        r((t) => (t + 1) % e.length);
      }, t);
      return () => window.clearInterval(s);
    }, [t, a, e.length]),
    e[s]
  );
}
function SlackMessage({
  avatar: e,
  name: a,
  timestamp: s,
  isApp: r,
  children: i,
}: {
  avatar: ReactNode;
  name: string;
  timestamp: string;
  isApp?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-1 lg:gap-2">
      {e}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-0.5 lg:gap-1">
          <span className="font-semibold text-[5.5px] text-primary-foreground leading-[8px] lg:text-[11px] lg:leading-4">
            {a}
          </span>
          {r && (
            <span className="rounded-[2px] bg-white-400 px-0.5 py-px font-semibold text-[4px] text-tertiary-foreground uppercase leading-none tracking-wide lg:rounded lg:px-1 lg:text-[8px]">
              {"App"}
            </span>
          )}
          <span className="text-[4.5px] text-tertiary-foreground leading-[8px] lg:text-[9px] lg:leading-4">{s}</span>
        </p>
        <p className="text-[5.5px] text-secondary-foreground leading-[7.5px] lg:text-[11px] lg:leading-[15px]">{i}</p>
      </div>
    </div>
  );
}
function SquareAvatar({ className: e, initials: a }: { className?: string; initials: string }) {
  return (
    <span
      className={cn(
        "grid size-3.5 shrink-0 place-items-center rounded font-semibold text-[6px] text-white-100 lg:size-7 lg:rounded-lg lg:text-[11px]",
        e,
      )}
    >
      {a}
    </span>
  );
}
type SlackExchangeData = { avatar: ReactNode; channel: string; name: string; prompt: string; reply: ReactNode; time: string };
const slackExchanges: SlackExchangeData[] = [
    {
      avatar: (
        <Img
          src={slackAvatar}
          alt=""
          width={28}
          height={28}
          className="size-3.5 shrink-0 rounded object-cover lg:size-7 lg:rounded-lg"
        />
      ),
      channel: "# pipeline",
      name: "Marcus",
      prompt: "what deals should I focus on today?",
      reply: (
        <>
          <span className="font-semibold text-primary-foreground">{"GreenLeaf"}</span>
          {" (verbal yes, no quote out) and Ramp (stalled in Legal 5d)."}
        </>
      ),
      time: "10:24",
    },
    {
      avatar: <SquareAvatar className="bg-green-600" initials="S" />,
      channel: "# revenue",
      name: "Sarah",
      prompt: "are we tracking to hit Q3?",
      reply: (
        <>
          {"Commit's at "}
          <span className="font-semibold text-primary-foreground">{"$785k"}</span>{" "}
          {"against your $1M target. The gap rides on two slipping deals, want me to flag?"}
        </>
      ),
      time: "10:26",
    },
    {
      avatar: <SquareAvatar className="bg-blue-500" initials="A" />,
      channel: "# deal-risk",
      name: "Alex",
      prompt: "anything at risk this week?",
      reply: (
        <>
          <span className="font-semibold text-primary-foreground">{"Replit"}</span>
          {", champion hasn't replied for a week after PTO. Want me to draft a follow-up?"}
        </>
      ),
      time: "10:31",
    },
  ],
  slackVariants = {
    exit: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
    hidden: {},
    visible: {},
  };
function SlackExchange({ exchange: e }: { exchange: SlackExchangeData }) {
  let a = `blur(${BLUR_IMAGE}px)`,
    s = {
      exit: {
        filter: a,
        opacity: 0,
        transition: { duration: 0.3, ease: EASE_UI },
      },
      hidden: { filter: a, opacity: 0, y: 8 },
      visible: (e: number) => ({
        filter: "blur(0px)",
        opacity: 1,
        transition: { delay: e, duration: 0.45, ease: EASE_UI },
        y: 0,
      }),
    };
  return (
    <div className="relative px-1.5 pt-1 pb-1.5 lg:px-3 lg:pt-2 lg:pb-3">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={e.channel}
          className="flex min-h-[66px] flex-col gap-1.5 lg:min-h-[132px] lg:gap-3"
          variants={slackVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.p
            variants={s}
            custom={0.2}
            className="font-semibold text-[5.5px] text-primary-foreground leading-[8px] lg:text-[11px] lg:leading-4"
          >
            {e.channel}
          </motion.p>
          <motion.div variants={s} custom={0.5}>
            <SlackMessage name={e.name} timestamp={e.time} avatar={e.avatar}>
              <span className="relative mr-[1px] font-medium text-blue-600 lg:mr-0.5">
                <span
                  aria-hidden={true}
                  className="absolute -inset-x-[1px] -inset-y-[1px] rounded-[3px] bg-blue-100 lg:-inset-x-0.5 lg:-inset-y-0.5 lg:rounded-md"
                />
                <span className="relative">{"@Joshuattio"}</span>
              </span>{" "}
              {e.prompt}
            </SlackMessage>
          </motion.div>
          <motion.div variants={s} custom={1.8}>
            <SlackMessage
              name="Joshuattio"
              timestamp={e.time}
              isApp={true}
              avatar={
                <span className="grid size-3.5 shrink-0 place-items-center rounded bg-primary-foreground text-white-100 lg:size-7 lg:rounded-lg">
                  <LogoMark className="size-[7px] lg:size-3.5" />
                </span>
              }
            >
              {e.reply}
            </SlackMessage>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export function SlackWindowBody({ isActive: e }: { isActive: boolean }) {
  let a = useCycle(slackExchanges, 5e3, e);
  return <SlackExchange exchange={a} />;
}
function TypeLine({
  text: e,
  speed: a = 26,
  startDelay: s = 0,
  className: i,
  onDone: n,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  onDone?: () => void;
}) {
  let [l, o] = useState(0),
    d = useRef(n);
  ((d.current = n),
    useEffect(() => {
      let t = 0,
        r: ReturnType<typeof setInterval> | null = null,
        i = setTimeout(() => {
          r = setInterval(() => {
            (o((t += 1)), t >= e.length && r && (clearInterval(r), d.current?.()));
          }, a);
        }, s);
      return () => {
        (clearTimeout(i), r && clearInterval(r));
      };
    }, [e.length, a, s]));
  let c = l >= e.length;
  return (
    <span className={i}>
      {e.slice(0, l)}
      {!c && (
        <motion.span
          aria-hidden={true}
          className="ml-px inline-block h-[0.95em] w-px translate-y-px bg-current align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.55, repeat: Infinity }}
        />
      )}
    </span>
  );
}
type TerminalExchangeData = { answer: string; churned: string; commands: string[]; prompt: string };
const terminalExchanges: TerminalExchangeData[] = [
  {
    answer: "Pulled the transcript, flagged a pricing objection, and queued the AE's follow-up.",
    churned: "41s · ↓ 13k tokens",
    commands: ["search-call-recordings-by-metadata", "get-call-recording", "create-task"],
    prompt: "Find yesterday's demo call and create the right follow-up task.",
  },
  {
    answer: "213 companies were missing firmographic data, backfilled the ones with a verified source.",
    churned: "1m 18s · ↓ 19k tokens",
    commands: ["list-records", "update-record"],
    prompt: "Fill in missing firmographic data for companies we can verify.",
  },
  {
    answer: "12 workspaces are past their seat limit, queued expansion tasks for the owning AEs.",
    churned: "47s · ↓ 16k tokens",
    commands: ["list-records", "create-task"],
    prompt: "Find accounts at the seat limit and create expansion tasks for the AE.",
  },
  {
    answer: "Ranked companies by engagement drop-off and pushed updated health scores to Joshuattio.",
    churned: "1m 04s · ↓ 22k tokens",
    commands: ["search-notes-by-metadata", "search-emails-by-metadata", "update-record"],
    prompt: "Score companies from recent activity and write the score back to Joshuattio.",
  },
];
function exchangeLength(e: TerminalExchangeData) {
  return e.prompt.length + e.answer.length + e.commands.join("").length;
}
let longestExchange = terminalExchanges.reduce((e, t) => (exchangeLength(t) > exchangeLength(e) ? t : e)),
  longestPrompt = terminalExchanges.reduce((e, t) => (t.prompt.length > e.length ? t.prompt : e), "");
function TerminalExchange({
  exchange: e,
  isStatic: a,
  animate: s,
  responding: r = false,
  step: i,
  advanceTo: n,
}: {
  exchange: TerminalExchangeData;
  isStatic: boolean;
  animate: boolean;
  responding?: boolean;
  step: number;
  advanceTo?: (n: number) => void;
}) {
  let l = s && !a,
    o = a || !s,
    d = o || r,
    c = e.commands.length,
    x = d && (o || i >= c + 1);
  return (
    <div className="flex flex-col gap-1 lg:gap-2">
      <p className="-mx-0.5 flex gap-[3px] rounded-[2px] bg-white-100/5 px-0.5 py-[1px] lg:-mx-1 lg:gap-1.5 lg:rounded lg:px-1 lg:py-0.5">
        <span className="shrink-0 text-white-900">{">"}</span>
        <span className="text-white-100">{e.prompt}</span>
      </p>
      {d && (
        <div className="space-y-[1px] lg:space-y-0.5">
          <p className="flex items-center gap-[3px] text-white-900 lg:gap-1.5">
            <span className="text-[#D97757]">{"●"}</span>
            {l ? <TypeLine startDelay={250} text={`Ran ${c} commands`} onDone={() => n?.(1)} /> : `Ran ${c} commands`}
          </p>
          {e.commands.map((e, a) =>
            o || i >= a + 1 ? (
              <p key={e} className="pl-1 text-black-800 lg:pl-2">
                {"⎿ "}
                {l ? <TypeLine speed={18} text={e} onDone={() => n?.(a + 2)} /> : e}
              </p>
            ) : null,
          )}
        </div>
      )}
      {x && (
        <p className="relative flex gap-[3px] text-white-900 lg:gap-1.5">
          <span className="shrink-0 text-[#D97757]">{"●"}</span>
          <span className="relative flex-1">
            <span aria-hidden={true} className="invisible">
              {e.answer}
            </span>
            <span className="absolute inset-0">{l ? <TypeLine text={e.answer} /> : e.answer}</span>
          </span>
        </p>
      )}
    </div>
  );
}
let spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
function ChurnStatus({ active: e, churned: a }: { active: boolean; churned: string }) {
  let s,
    r,
    i,
    [n, l] = useState(0),
    o =
      ((s = a.match(/(\d+)m/)?.[1]),
      (r = a.match(/(\d+)s/)?.[1]),
      (i = a.match(/↓\s*(\d+)k/)?.[1]),
      {
        seconds: 60 * Number(s ?? 0) + Number(r ?? 0),
        tokens: Number(i ?? 0),
      });
  if (
    (useEffect(() => {
      if (!e) return;
      l(0);
      let t = setInterval(() => l((e) => Math.min(e + 90, 1800)), 90);
      return () => clearInterval(t);
    }, [e]),
    e)
  ) {
    let e = Math.min(n / 1800, 1),
      a = Math.max(1, Math.round(o.seconds * e)),
      s = Math.max(1, Math.round(o.tokens * e)),
      r = spinnerFrames[Math.floor(n / 90) % spinnerFrames.length];
    return (
      <p className="flex items-center gap-[3px] text-[#D97757] lg:gap-1.5">
        <span className="inline-block w-1 text-center lg:w-2">{r}</span>
        <span>
          {"Churning… ("}
          {a}
          {"s · ↓ "}
          {s}
          {"k tokens)"}
        </span>
      </p>
    );
  }
  return (
    <p className="flex items-center gap-[3px] text-black-700 lg:gap-1.5">
      <span className="inline-block w-1 text-center lg:w-2">{"·"}</span>
      <span>
        {"Churned ("}
        {a}
        {")"}
      </span>
    </p>
  );
}
function TerminalSession({ exchange: e }: { exchange: TerminalExchangeData }) {
  let [a, s] = useState("typing"),
    [r, i] = useState(0);
  useEffect(() => {
    if ("typed" === a) {
      let e = setTimeout(() => s("thinking"), 650);
      return () => clearTimeout(e);
    }
    if ("thinking" === a) {
      let e = setTimeout(() => {
        (s("responding"), i(0));
      }, 1800);
      return () => clearTimeout(e);
    }
  }, [a]);
  let n = "thinking" === a || "responding" === a;
  return (
    <div className="flex flex-col gap-1 px-1.5 py-[5px] lg:gap-2 lg:px-3 lg:py-2.5">
      <div className="grid grid-cols-1">
        <div aria-hidden={true} className="invisible [grid-area:1/1]">
          <TerminalExchange exchange={longestExchange} isStatic={true} animate={false} step={3} />
        </div>
        {n && (
          <div className="[grid-area:1/1]">
            <TerminalExchange
              exchange={e}
              isStatic={false}
              animate={true}
              responding={"responding" === a}
              step={r}
              advanceTo={(e) => i((t) => (t < e ? e : t))}
            />
          </div>
        )}
      </div>
      <div className="flex h-[7.5px] items-center lg:h-[15px]">
        {n && <ChurnStatus active={"thinking" === a} churned={e.churned} />}
      </div>
      <div className="grid grid-cols-1 rounded-[3px] border border-white-100/10 px-[3px] py-0.5 lg:rounded-md lg:px-1.5 lg:py-1">
        <p aria-hidden={true} className="invisible flex items-start gap-[3px] [grid-area:1/1] lg:gap-1.5">
          <span className="shrink-0">{">"}</span>
          <span>{longestPrompt}</span>
        </p>
        <p className="flex items-start gap-[3px] text-white-100 [grid-area:1/1] lg:gap-1.5">
          <span className="shrink-0 text-white-900">{">"}</span>
          {!n && <TypeLine text={e.prompt} onDone={() => s("typed")} />}
        </p>
      </div>
    </div>
  );
}
function TerminalBody({ exchange: e }: { exchange: TerminalExchangeData }) {
  return (
    <div className="flex flex-col bg-black-50 font-mono text-[5px] leading-[7.5px] lg:text-[10px] lg:leading-[15px]">
      <TerminalSession key={e.prompt} exchange={e} />
      <div className="border-white-100/10 border-t px-1.5 pt-[5px] pb-1.5 lg:px-3 lg:pt-2.5 lg:pb-3">
        <p className="flex items-center gap-[3px] text-black-700 lg:gap-1.5">
          <span className="text-[#D97757]">{"▶▶ auto"}</span>
          <span>{"Opus 4.8 · 1M context"}</span>
        </p>
      </div>
    </div>
  );
}
export function TerminalWindowBody({ isActive: e }: { isActive: boolean }) {
  let a = useCycle(terminalExchanges, 9e3, e);
  return <TerminalBody exchange={a} />;
}