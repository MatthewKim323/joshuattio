"use client";
// Framed Ask demo for the "Intelligence built for how you work" block: the home Ask scene
// running in loop mode (idle until in view, restarts 13s after the answer), inside a window
// whose top bar swaps between Home and the chat title.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/components/hero/cn";
import { EASE_UI, EASE_UI_EXIT } from "@/components/hero/ease";
import { Img, type StaticImage } from "@/components/hero/img";

type AskState = "idle" | "initial" | "typing" | "complete" | "submitting" | "thinking" | "response";

const avatarOne: StaticImage = {
    src: "/img/img-e6e6910ff9.avif",
    width: 60,
    height: 60,
  },
  avatarTwo: StaticImage = {
    src: "/img/img-71f2d01f7e.avif",
    width: 60,
    height: 60,
  },
  greenleafThumb: StaticImage = {
    src: "/img/img-432aa6b64c.avif",
    width: 140,
    height: 100,
  };
function VideoSmallIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
      <path
        d="M4.91309 1.2256C5.27653 1.2256 5.51933 1.22378 5.72852 1.26564C6.53874 1.42805 7.17252 2.06187 7.33496 2.87208C7.3484 2.93916 7.35541 3.01018 7.36133 3.08693L7.96191 2.84669C8.10501 2.78945 8.23827 2.73572 8.35059 2.70216C8.46402 2.66831 8.61099 2.63783 8.77051 2.67091C8.95535 2.70939 9.12099 2.81 9.23926 2.95509L9.28613 3.02052L9.34277 3.12306C9.38849 3.22726 9.40503 3.33243 9.41309 3.42091C9.42368 3.53768 9.42285 3.68171 9.42285 3.83595V5.99708C9.42285 6.15102 9.42363 6.29451 9.41309 6.41114C9.40238 6.52908 9.37618 6.67664 9.28613 6.81251C9.16685 6.99234 8.98178 7.11816 8.77051 7.16212C8.61095 7.19524 8.46404 7.16375 8.35059 7.12989C8.23833 7.09633 8.10488 7.04255 7.96191 6.98536L7.36035 6.74513C7.3546 6.81785 7.34854 6.8853 7.33594 6.94923C7.17499 7.76408 6.5375 8.40157 5.72266 8.56251C5.51625 8.60323 5.27737 8.6006 4.91895 8.6006H3.85059C3.39871 8.6006 3.03493 8.60114 2.74121 8.57716C2.44276 8.55276 2.18006 8.50149 1.9375 8.37794C1.55215 8.18153 1.23835 7.86782 1.04199 7.48243C0.918467 7.23985 0.867161 6.97721 0.842773 6.67872C0.8188 6.385 0.818359 6.02121 0.818359 5.56935V4.25782C0.818359 3.80595 0.818791 3.44217 0.842773 3.14845C0.867174 2.84997 0.918428 2.58731 1.04199 2.34474C1.23839 1.95934 1.5521 1.64562 1.9375 1.44923C2.18008 1.32566 2.44273 1.27441 2.74121 1.25001C3.03493 1.22603 3.3987 1.2256 3.85059 1.2256H4.91309ZM3.85059 2.04591C3.38509 2.04591 3.06028 2.04577 2.80762 2.06642C2.55987 2.08668 2.41743 2.12475 2.30957 2.1797C2.07836 2.29753 1.8903 2.4856 1.77246 2.71681C1.71752 2.82466 1.67944 2.96712 1.65918 3.21486C1.63854 3.46752 1.63867 3.79234 1.63867 4.25782V5.56935C1.63867 6.03475 1.63855 6.35967 1.65918 6.61232C1.67942 6.85995 1.71757 7.00252 1.77246 7.11036C1.89026 7.34154 2.07842 7.52963 2.30957 7.64747C2.41742 7.7024 2.55992 7.7405 2.80762 7.76075C3.06028 7.7814 3.38509 7.78126 3.85059 7.78126H4.91895C5.31634 7.78126 5.45644 7.77913 5.56445 7.75782C6.05293 7.66111 6.43456 7.27952 6.53125 6.79103C6.55256 6.68301 6.55469 6.54293 6.55469 6.14552V3.68751C6.55469 3.28459 6.55317 3.14267 6.53125 3.03321C6.43377 2.5471 6.05351 2.16679 5.56738 2.06935C5.45794 2.04747 5.31592 2.04591 4.91309 2.04591H3.85059ZM8.58496 3.48732C8.51665 3.50774 8.42398 3.54448 8.2666 3.60743L7.37402 3.96388V5.8672L8.2666 6.22462C8.42388 6.28753 8.51665 6.32429 8.58496 6.34474C8.58806 6.34566 8.59191 6.34594 8.59473 6.34669C8.59506 6.34396 8.5964 6.34096 8.59668 6.3379C8.60311 6.2669 8.60351 6.16669 8.60352 5.99708V3.83595C8.60352 3.66609 8.60313 3.56617 8.59668 3.49513C8.5963 3.49136 8.59508 3.48767 8.59473 3.48439C8.59179 3.48522 8.58826 3.48633 8.58496 3.48732Z"
        fill="currentColor"
      />
    </svg>
  );
}
let meetingAvatars = [avatarOne, avatarTwo],
  metaClass = cn(
    "shrink-0 whitespace-nowrap font-medium text-[rgba(0,0,0,0.4)]",
    "text-[6px] leading-[8px]",
    "lg:text-[12px] lg:leading-[16px]",
  );
function MeetingCard({ title: e, time: r, duration: i, delay: l = 0 }: { title: string; time: string; duration: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: l, duration: 0.3, ease: EASE_UI }}
      className={cn(
        "flex w-full items-start bg-white-100",
        "max-w-[260px] gap-[4px] rounded-[6px] border-[#EEEFF1] border-[0.5px] py-[5px] pr-[6px] pl-[5px]",
        "lg:max-w-[520px] lg:gap-[8px] lg:rounded-[12px] lg:border lg:py-[10px] lg:pr-[12px] lg:pl-[10px]",
      )}
    >
      <div className={cn("shrink-0 self-stretch rounded-full bg-[#00D17E]", "w-[1.5px]", "lg:w-[3px]")} />
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          "h-[18px] w-[25px] rounded-[3px]",
          "lg:h-[36px] lg:w-[50px] lg:rounded-[6px]",
        )}
      >
        <Img src={greenleafThumb} alt="" fill={true} sizes="(min-width: 1024px) 100px, 50px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <div className={cn("flex w-full items-center", "gap-[6px]", "lg:gap-[12px]")}>
          <span
            className={cn(
              "min-w-0 flex-1 truncate font-medium text-[#242629]",
              "text-[7px] leading-[10px] tracking-[-0.07px]",
              "lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]",
            )}
          >
            {e}
          </span>
          <div className="flex shrink-0 items-center">
            {meetingAvatars.map((e, r) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: l + 0.1 + 0.1 * r,
                  duration: 0.25,
                  ease: EASE_UI,
                }}
                className={cn("rounded-full border border-white-100", "-ml-[2px] first:ml-0", "lg:-ml-[4px]")}
              >
                <Img
                  src={e}
                  alt=""
                  className={cn(
                    "rounded-full object-cover ring-1 ring-[rgba(0,0,0,0.05)]",
                    "size-[8px]",
                    "lg:size-[16px]",
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>
        <div className={cn("flex w-full flex-wrap items-center", "gap-[2px]", "lg:gap-[4px]")}>
          <span className={metaClass}>{r}</span>
          <span className={metaClass}>{"·"}</span>
          <div className={cn("flex items-center", "gap-[2px]", "lg:gap-[4px]")}>
            <VideoSmallIcon className={cn("shrink-0 text-[rgba(0,0,0,0.4)]", "size-[6px]", "lg:size-[12px]")} />
            <span className={metaClass}>{i}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
function useTypewriter({
  textLength: e,
  delay: t = 0,
  speed: a = 25,
  resetKey: r = String(e),
  onComplete: l,
  onProgress: n,
}: {
  textLength: number;
  delay?: number;
  speed?: number;
  resetKey?: string;
  onComplete?: () => void;
  onProgress?: (n: number) => void;
}) {
  let [s, o] = useState({ isComplete: 0 === e, isStarted: false }),
    d = useRef(l);
  d.current = l;
  let c = useRef(n);
  return (
    (c.current = n),
    useEffect(() => {
      let r = 0,
        i = 0,
        l = 0,
        n = -1,
        s = false,
        C = (e: number) => {
          e !== n && ((n = e), c.current?.(e));
        },
        u = () => {
          s || ((s = true), C(e), o({ isComplete: true, isStarted: true }), d.current?.());
        },
        h = (t: number) => {
          let i = Math.min(e, Math.floor((t - l) / a));
          (C(i), i >= e) ? u() : (r = requestAnimationFrame(h));
        };
      return (
        o({ isComplete: 0 === e, isStarted: false }),
        (i = window.setTimeout(() => {
          0 === e
            ? u()
            : ((l = performance.now()),
              o({ isComplete: false, isStarted: true }),
              C(0),
              (r = requestAnimationFrame(h)));
        }, t)),
        () => {
          (window.clearTimeout(i), cancelAnimationFrame(r));
        }
      );
    }, [t, r, a, e]),
    s
  );
}
function Caret() {
  return (
    <span aria-hidden={true} className="relative inline-block h-0 w-0 overflow-visible align-baseline">
      <span
        className={cn(
          "absolute bottom-[-0.05em] left-px block animate-caret-blink bg-[#266DF0]",
          "h-[0.9em] w-px",
          "lg:w-[2px]",
        )}
      />
    </span>
  );
}
function TypedText({
  text: e,
  delay: a = 0,
  speed: r = 25,
  onComplete: l,
  className: n,
}: {
  text: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  let s = useRef<HTMLSpanElement>(null),
    { isComplete: o, isStarted: d } = useTypewriter({
      delay: a,
      onComplete: l,
      onProgress: (t) => {
        let a = s.current;
        a && (a.textContent = e.slice(0, t));
      },
      resetKey: e,
      speed: r,
      textLength: e.length,
    });
  return d ? (
    <span className={n}>
      <span ref={s}>{o ? e : ""}</span>
      {!o && <Caret />}
    </span>
  ) : null;
}
function Delayed({ delay: e, children: a }: { delay: number; children: ReactNode }) {
  let [r, l] = useState(0 === e);
  return (useEffect(() => {
    if (0 === e) return void l(true);
    l(false);
    let t = window.setTimeout(() => l(true), e);
    return () => window.clearTimeout(t);
  }, [e]),
  r) ? (
    <>{a}</>
  ) : null;
}
function BodyText({ className: e, style: a, children: r }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <span
      className={cn(
        "font-medium text-[7px] leading-[9px] tracking-[-0.14px]",
        "lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]",
        e,
      )}
      style={a}
    >
      {r}
    </span>
  );
}
let actionIcons = [
    function ({ ...e }: SVGProps<SVGSVGElement>) {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
          <g clipPath="url(#clip0_19835_2091)">
            <path
              d="M9 3.5C9.6916 3.49995 10.2407 3.50006 10.6826 3.53613C11.1303 3.5727 11.5128 3.64907 11.8623 3.82715C12.4264 4.11473 12.8853 4.57353 13.1729 5.1377C13.351 5.4873 13.4273 5.8696 13.4639 6.31738C13.5 6.75934 13.5 7.30823 13.5 8V9.66406C13.5 10.4086 13.5045 10.8799 13.3975 11.2783C13.1197 12.3119 12.3119 13.1197 11.2783 13.3975C10.88 13.5044 10.4092 13.5 9.66504 13.5H8C7.30838 13.5 6.75928 13.4999 6.31738 13.4639C5.86967 13.4273 5.48727 13.3509 5.1377 13.1729C4.57352 12.8853 4.11473 12.4265 3.82715 11.8623C3.64901 11.5127 3.57272 11.1304 3.53613 10.6826C3.50003 10.2407 3.5 9.69176 3.5 9V7.52832C3.5 6.61146 3.4936 6.03086 3.65527 5.54785C3.9542 4.65524 4.65523 3.95418 5.54785 3.65527C6.0308 3.49373 6.61163 3.5 7.52832 3.5H9ZM7.52832 4.5C6.53168 4.5 6.15476 4.50671 5.86523 4.60352C5.27016 4.80278 4.80281 5.27017 4.60352 5.86523C4.50658 6.1548 4.50001 6.53134 4.5 7.52832V9C4.5 9.70825 4.50022 10.2098 4.53223 10.6016C4.56377 10.9873 4.62346 11.2231 4.71777 11.4082C4.90952 11.7844 5.21559 12.0905 5.5918 12.2822C5.77687 12.3765 6.0128 12.4363 6.39844 12.4678C6.79019 12.4997 7.29189 12.5 8 12.5H9.66504C10.4732 12.5 10.7798 12.4957 11.0186 12.4316C11.7076 12.2464 12.2465 11.7077 12.4316 11.0186C12.4958 10.7797 12.5 10.473 12.5 9.66406V8C12.5 7.2917 12.4998 6.79024 12.4678 6.39844C12.4362 6.01267 12.3765 5.7769 12.2822 5.5918C12.0905 5.2156 11.7844 4.90952 11.4082 4.71777C11.2231 4.62349 10.9872 4.56375 10.6016 4.53223C10.2098 4.50025 9.70811 4.49995 9 4.5H7.52832ZM7 0.5C7.44531 0.5 7.72676 0.498644 7.96973 0.537109C8.46385 0.615447 8.91764 0.812962 9.2998 1.09961C9.52697 1.2701 9.7299 1.47303 9.90039 1.7002C10.0658 1.92103 10.0205 2.23474 9.7998 2.40039C9.57897 2.56573 9.26622 2.5205 9.10059 2.2998C8.98695 2.14841 8.85157 2.01405 8.7002 1.90039C8.44539 1.7092 8.1425 1.57668 7.8125 1.52441C7.66691 1.50142 7.48303 1.5 7 1.5H4.52832C3.53145 1.5 3.15479 1.50663 2.86523 1.60352C2.27021 1.80278 1.80282 2.27023 1.60352 2.86523C1.50664 3.15477 1.50001 3.53155 1.5 4.52832V7C1.5 7.48292 1.50144 7.66693 1.52441 7.8125C1.57666 8.14237 1.70913 8.44528 1.90039 8.7002C2.01419 8.85176 2.14857 8.98707 2.2998 9.10059C2.52047 9.26619 2.56563 9.57897 2.40039 9.7998C2.23474 10.0205 1.92104 10.0658 1.7002 9.90039C1.47285 9.72976 1.27095 9.5268 1.10059 9.2998C0.813834 8.91765 0.615496 8.46417 0.537109 7.96973C0.498663 7.72679 0.499998 7.44524 0.5 7V4.52832C0.500002 3.61158 0.493659 3.03082 0.655273 2.54785C0.954221 1.6553 1.65528 0.954172 2.54785 0.655273C3.03084 0.493646 3.61151 0.499998 4.52832 0.5H7Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_19835_2091">
              <rect width="14" height="14" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    },
    function ({ ...e }: SVGProps<SVGSVGElement>) {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
          <path
            d="M6.64258 0.771973C7.06883 0.239201 7.83161 0.120272 8.39941 0.498535C9.09726 0.963764 9.45716 1.79527 9.31934 2.62256L9.07617 4.08154L11.8262 4.50537L11.8477 4.50928C12.5525 4.65024 13.25 5.29356 13.25 6.25049C13.2499 6.66063 13.1167 7.078 12.8779 7.40283C13.2359 7.68971 13.5 8.13451 13.5 8.75049C13.4998 9.45875 13.1496 9.93856 12.71 10.2144C12.9063 10.5102 13 10.867 13 11.2505C12.9998 11.995 12.4509 13.0005 11.25 13.0005H3.5L2 12.9995C1.17179 12.9995 0.500272 12.3287 0.5 11.5005V6.50049C0.50001 5.67207 1.17158 4.99951 2 4.99951H3.25879L6.64258 0.771973ZM7.84473 1.33057C7.70851 1.24003 7.52507 1.26826 7.42285 1.396L4 5.67432V12.0005H11.25C11.7486 12.0005 11.9998 11.6058 12 11.2505C12 10.998 11.9321 10.8298 11.8447 10.7222C11.7584 10.6159 11.6218 10.5298 11.4131 10.4927C11.158 10.4474 10.9794 10.2146 11.002 9.95654C11.0247 9.69841 11.2409 9.50049 11.5 9.50049H11.75C12.107 9.50047 12.4998 9.24948 12.5 8.75049C12.5 8.31367 12.1991 8.06706 11.8848 8.01221L11.75 8.00049L11.6494 7.98975C11.4216 7.94322 11.2502 7.74197 11.25 7.50049C11.25 7.22437 11.4739 7.00049 11.75 7.00049L11.8223 6.98975C12.003 6.93954 12.2498 6.70903 12.25 6.25049C12.25 5.82889 11.95 5.55261 11.6562 5.4917L8.42383 4.99463C8.29175 4.97429 8.1731 4.9017 8.09473 4.79346C8.01636 4.68516 7.98485 4.54934 8.00684 4.41748L8.33301 2.4585C8.4062 2.01932 8.21519 1.57754 7.84473 1.33057ZM1.89941 6.01025C1.67166 6.05678 1.50025 6.25807 1.5 6.49951V11.4995C1.50001 11.7756 1.72391 11.9995 2 11.9995H3V5.99951H2L1.89941 6.01025Z"
            fill="currentColor"
          />
        </svg>
      );
    },
    function ({ ...e }: SVGProps<SVGSVGElement>) {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
          <path
            d="M11.25 1.00098C12.4509 1.00099 12.9998 2.00645 13 2.75098C12.9999 3.13435 12.9062 3.49142 12.71 3.78711C13.1496 4.06293 13.4998 4.54282 13.5 5.25098C13.4999 5.86673 13.2358 6.31182 12.8779 6.59863C13.1166 6.92343 13.2499 7.34095 13.25 7.75098C13.2498 8.70767 12.5524 9.35124 11.8477 9.49219L11.8262 9.49609L9.07617 9.91992L9.31934 11.3789C9.45697 12.2061 9.09714 13.0378 8.39941 13.5029C7.83173 13.881 7.06882 13.762 6.64258 13.2295L3.25879 9.00195H2C1.17172 9.00195 0.500247 8.32919 0.5 7.50098V2.50098C0.500272 1.67281 1.17179 1.00201 2 1.00195L3.5 1.00098H11.25ZM4 2.00098V8.32715L7.42285 12.6055C7.52506 12.7329 7.70863 12.7612 7.84473 12.6709C8.21507 12.424 8.40601 11.982 8.33301 11.543L8.00684 9.58398C7.98487 9.45224 8.01651 9.31626 8.09473 9.20801C8.17309 9.09978 8.29177 9.02719 8.42383 9.00684L11.6562 8.50977C11.9499 8.44888 12.2498 8.17233 12.25 7.75098C12.2498 7.29253 12.003 7.06199 11.8223 7.01172L11.75 7.00098C11.474 7.00098 11.2503 6.77689 11.25 6.50098C11.2502 6.25953 11.4217 6.05828 11.6494 6.01172L11.75 6.00098L11.8848 5.98926C12.199 5.93443 12.4998 5.68752 12.5 5.25098C12.4998 4.75199 12.107 4.50099 11.75 4.50098H11.5C11.241 4.50098 11.0249 4.30284 11.002 4.04492C10.9794 3.78694 11.1581 3.55408 11.4131 3.50879C11.6216 3.47169 11.7584 3.38543 11.8447 3.2793C11.932 3.17177 11.9999 3.00319 12 2.75098C11.9998 2.39568 11.7486 2.00099 11.25 2.00098H4ZM2 2.00195C1.72391 2.00201 1.50001 2.22585 1.5 2.50195V7.50195C1.50045 7.7432 1.6718 7.94471 1.89941 7.99121L2 8.00195H3V2.00195H2Z"
            fill="currentColor"
          />
        </svg>
      );
    },
    function ({ ...e }: SVGProps<SVGSVGElement>) {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
          <path
            d="M2 6.50012C2.27614 6.50012 2.5 6.72398 2.5 7.00012V7.40051C2.50029 9.11222 3.88789 10.4999 5.59961 10.5001H8.79297L7.64648 9.35364L7.58203 9.27551C7.45389 9.08146 7.47569 8.81747 7.64648 8.64661C7.81735 8.47574 8.08131 8.45399 8.27539 8.58215L8.35352 8.64661L10.3535 10.6466C10.5487 10.8419 10.5488 11.1584 10.3535 11.3536L8.35352 13.3536C8.15827 13.5488 7.84173 13.5488 7.64648 13.3536C7.45125 13.1584 7.4513 12.8419 7.64648 12.6466L8.79297 11.5001H5.59961C3.3356 11.4999 1.50029 9.6645 1.5 7.40051V7.00012C1.5 6.72398 1.72386 6.50012 2 6.50012ZM5.64648 0.646606C5.84175 0.451344 6.15825 0.451344 6.35352 0.646606C6.5487 0.841875 6.54875 1.1584 6.35352 1.35364L5.20703 2.50012H8.40039C10.6644 2.50033 12.4998 4.33567 12.5 6.59973V7.00012C12.4999 7.2762 12.2761 7.50012 12 7.50012C11.7239 7.50012 11.5001 7.2762 11.5 7.00012V6.59973C11.4998 4.88796 10.1122 3.50033 8.40039 3.50012H5.20703L6.35352 4.64661L6.41797 4.72473C6.54606 4.9188 6.52435 5.18281 6.35352 5.35364C6.18267 5.52441 5.91865 5.54619 5.72461 5.41809L5.64648 5.35364L3.64648 3.35364C3.45125 3.1584 3.4513 2.84187 3.64648 2.64661L5.64648 0.646606Z"
            fill="currentColor"
          />
        </svg>
      );
    },
  ],
  FOLLOW_UP = "Want me to draft an agenda with talking points?",
  MEETING_DURATION = "48m",
  MEETING_TIME = "Dec 12, 10:40 - 11:32 AM",
  MEETING_TITLE = "GreenLeaf Intro",
  signals = [
    { label: "Large startup deal", text: "52 seats, global AI startup." },
    {
      label: "Active migration intent",
      text: "Leaving their current stack.",
    },
    { label: "Strong ICP fit", text: "80+ employees, engaged buyers." },
    {
      label: "Recent engagement",
      text: "Met the Basepoint team this month.",
    },
  ],
  SIGNALS_HEADING = "Key opportunity signals:",
  STRATEGY_TITLE = "Strategy to win GreenLeaf",
  CONTEXT_HEADING = "Deal context:",
  textMedium = cn("font-medium text-[#101112]", "text-[7px] leading-[9px]", "lg:text-[14px] lg:leading-5"),
  textSemibold = cn("font-semibold text-[#101112]", "text-[7px] leading-[9px]", "lg:text-[14px] lg:leading-5"),
  textSize = cn("text-[7px] leading-[9px]", "lg:text-[14px] lg:leading-5");
function FadeIn({ delay: e, children: r }: { delay: number; children: ReactNode }) {
  return (
    <Delayed delay={e}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE_UI }}>
        {r}
      </motion.div>
    </Delayed>
  );
}
function TypedSegments({
  segments: e,
  delay: a = 0,
  speed: r = 6,
  onComplete: l,
  className: n,
  showCaret: s = true,
}: {
  segments: { className?: string; text: string }[];
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  showCaret?: boolean;
}) {
  let o = e.map((e) => e.text).join(""),
    d = useRef<(HTMLSpanElement | null)[]>([]),
    { isComplete: c, isStarted: C } = useTypewriter({
      delay: a,
      onComplete: l,
      onProgress: (t) => {
        let a = t;
        e.forEach((e, t) => {
          let r = d.current[t],
            i = a > 0 ? e.text.slice(0, Math.min(a, e.text.length)) : "";
          ((a -= i.length), r && r.textContent !== i && (r.textContent = i));
        });
      },
      resetKey: o,
      speed: r,
      textLength: o.length,
    });
  return C ? (
    <span className={n}>
      {e.map((e, a) => (
        <span
          key={`${e.text}-${a}`}
          ref={(e) => {
            d.current[a] = e;
          }}
          className={e.className}
        >
          {c ? e.text : ""}
        </span>
      ))}
      {!c && s ? <Caret /> : null}
    </span>
  ) : null;
}
function SignalItem({
  number: e,
  label: a,
  text: r,
  subItems: i,
  delay: l,
  speed: n = 6,
}: {
  number: number;
  label: string;
  text: string;
  subItems?: string[];
  delay: number;
  speed?: number;
}) {
  let s = `${e}. `,
    o = `${a} - `,
    d = l + `${s}${o}${r}`.length * n + 120,
    c = 0;
  return (
    <li className="flex flex-col">
      <TypedSegments
        segments={[
          { className: textMedium, text: s },
          { className: textMedium, text: o },
          { className: textMedium, text: r },
        ]}
        delay={l}
        speed={n}
      />
      {i && i.length > 0 ? (
        <Delayed delay={d}>
          <ol className="mt-0.5 flex flex-col lg:mt-1">
            {i.map((e, a) => {
              let r = `${String.fromCharCode(97 + a)}. `,
                l = `${r}${e}`,
                s = c;
              return (
                (c += l.length * n),
                a < i.length - 1 && (c += 120),
                (
                  <li key={e}>
                    <TypedSegments
                      segments={[
                        { className: textMedium, text: r },
                        { className: textMedium, text: e },
                      ]}
                      delay={s}
                      speed={n}
                    />
                  </li>
                )
              );
            })}
          </ol>
        </Delayed>
      ) : null}
    </li>
  );
}
function ResponseActions({ delay: e }: { delay: number }) {
  return (
    <Delayed delay={e}>
      <div className="flex items-center gap-1.5 px-0.5 lg:gap-3 lg:px-1">
        {actionIcons.map((Icon, a) => (
          <button
            key={a}
            type="button"
            className="text-[rgba(0,0,0,0.4)] transition-colors hover:text-[rgba(0,0,0,0.55)]"
          >
            <Icon className="size-1.5 lg:size-3" />
          </button>
        ))}
      </div>
    </Delayed>
  );
}
function AgentResponse() {
  let e: number,
    a = (e = 0 + (6 * STRATEGY_TITLE.length + 120)),
    r = (e += 6 * CONTEXT_HEADING.length + 180),
    i = (e += 400);
  e += 6 * SIGNALS_HEADING.length + 120;
  let l = signals.map((t, a) => {
      let r = e;
      return (
        (e +=
          (({ number: e, label: t, text: a, subItems: r, speed: i }: { number: number; label: string; text: string; subItems?: string[]; speed: number }) => {
            let l,
              n = (l = `${e}. ${t} - ${a}`).length * i;
            return (
              r &&
                0 !== r.length &&
                ((n += 120),
                r.forEach((e: string, t: number) => {
                  let a = `${String.fromCharCode(97 + t)}. `;
                  ((n += `${a}${e}`.length * i), t < r.length - 1 && (n += 120));
                })),
              n
            );
          })({ label: t.label, number: a + 1, speed: 6, text: t.text }) + 120),
        r
      );
    }),
    n = e,
    s = (e += 5 * FOLLOW_UP.length + 120),
    o = l[0] ?? i;
  return (
    <div key={"response"} className={cn("flex flex-col gap-1.5 lg:gap-3", textSize)}>
      <Delayed delay={0}>
        <div className="flex flex-col">
          <TypedSegments segments={[{ className: textMedium, text: STRATEGY_TITLE }]} delay={0} speed={6} />
          <TypedSegments segments={[{ className: textSemibold, text: CONTEXT_HEADING }]} delay={a - 0} speed={6} />
        </div>
      </Delayed>
      <FadeIn delay={r}>
        <MeetingCard title={MEETING_TITLE} time={MEETING_TIME} duration={MEETING_DURATION} delay={0} />
      </FadeIn>
      <Delayed delay={i}>
        <div className="flex flex-col gap-0.5 lg:gap-1">
          <TypedSegments segments={[{ className: textSemibold, text: SIGNALS_HEADING }]} delay={0} speed={6} />
          <Delayed delay={o - i}>
            <ol className="flex flex-col">
              {signals.map((e, a) => (
                <SignalItem key={e.label} number={a + 1} label={e.label} text={e.text} delay={(l[a] ?? o) - o} speed={6} />
              ))}
            </ol>
          </Delayed>
        </div>
      </Delayed>
      <TypedText text={FOLLOW_UP} delay={n} speed={5} className={textMedium} />
      <ResponseActions delay={s} />
    </div>
  );
}
function ChatReply({ isThinking: e }: { isThinking: boolean }) {
  return (
    <div className="flex max-w-[85%] flex-col gap-1.5 lg:gap-3">
      <AnimatePresence mode="wait">
        {e ? (
          <motion.span
            key={"thinking"}
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="pointer-events-none absolute inset-y-0 z-10 w-10 skew-x-[-20deg] bg-linear-to-r from-transparent via-white-100/60 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 0,
              }}
            />
            <BodyText className="text-black-0/55">{"Thinking"}</BodyText>
          </motion.span>
        ) : (
          <AgentResponse />
        )}
      </AnimatePresence>
    </div>
  );
}
function UserMessage({ message: e }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_UI }}
      className="mt-3 flex justify-end lg:mt-6"
    >
      <div
        className={cn(
          "flex bg-black-0/6",
          "rounded-[5px] px-[5px] py-[2.5px]",
          "lg:rounded-[10px] lg:px-[10px] lg:py-[5px]",
          "text-[7px] leading-[9px] lg:text-[14px] lg:leading-5",
        )}
      >
        <BodyText className="text-[#101112]">{e}</BodyText>
      </div>
    </motion.div>
  );
}
function ChatThread({ state: e, className: r }: { state: AskState; className?: string }) {
  let l = useRef<HTMLDivElement>(null);
  return (
    useEffect(() => {
      let e = l.current;
      if (!e) return;
      let t = 0,
        a = () => {
          ((t = 0), e.scrollTo({ behavior: "instant", top: e.scrollHeight }));
        },
        r = new MutationObserver(() => {
          0 === t && (t = requestAnimationFrame(a));
        });
      return (
        r.observe(e, { characterData: true, childList: true, subtree: true }),
        () => {
          (r.disconnect(), 0 !== t && cancelAnimationFrame(t));
        }
      );
    }, []),
    (
      <motion.div
        ref={l}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE_UI }}
        className={cn(
          "scrollbar-none flex h-[calc(100cqh-80px)] shrink-0 grow-0 flex-col gap-2 overflow-y-auto px-px lg:h-[calc(100cqh-188px)] lg:gap-4",
          "[mask-image:linear-gradient(to_bottom,transparent,black_24px,black_100%)]",
          r,
        )}
      >
        <AnimatePresence>
          {("thinking" === e || "response" === e) && (
            <motion.div
              key={"chat-content"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_UI }}
              className="flex flex-col gap-2 lg:gap-4"
            >
              <UserMessage message="How do I win my deal with GreenLeaf?" />
              <ChatReply isThinking={"thinking" === e} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  );
}
function Greeting({ isVisible: e }: { isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: +!!e }}
      transition={e ? { delay: 0.6, duration: 0.5, ease: "easeOut" } : { duration: 0.25, ease: "easeIn" }}
      className={cn("flex items-center", "mt-6 mb-[12px] px-[4px] lg:mt-12", "lg:mb-[24px] lg:px-[8px]")}
    >
      <span
        className={cn(
          "font-semibold text-[#242629]",
          "text-[10px] leading-[12px] tracking-[-0.1px]",
          "lg:text-[20px] lg:leading-[24px] lg:tracking-[-0.2px]",
        )}
      >
        {"Good morning, Alex"}
      </span>
    </motion.div>
  );
}
function DetailsIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
      <path
        d="M9 1.5C9.69178 1.5 10.2407 1.50003 10.6826 1.53613C11.1304 1.57272 11.5127 1.64901 11.8623 1.82715C12.4265 2.11472 12.8853 2.57347 13.1729 3.1377C13.351 3.48732 13.4273 3.86958 13.4639 4.31738C13.5 4.75934 13.5 5.30822 13.5 6V8C13.5 8.69178 13.5 9.24066 13.4639 9.68262C13.4273 10.1304 13.351 10.5127 13.1729 10.8623C12.8853 11.4265 12.4265 11.8853 11.8623 12.1729C11.5127 12.351 11.1304 12.4273 10.6826 12.4639C10.2407 12.5 9.69178 12.5 9 12.5H5C4.30822 12.5 3.75934 12.5 3.31738 12.4639C2.86958 12.4273 2.48732 12.351 2.1377 12.1729C1.57347 11.8853 1.11472 11.4265 0.827148 10.8623C0.649006 10.5127 0.57272 10.1304 0.536133 9.68262C0.500028 9.24066 0.5 8.69178 0.5 8V6C0.5 5.30822 0.500028 4.75934 0.536133 4.31738C0.57272 3.86958 0.649006 3.48732 0.827148 3.1377C1.11472 2.57347 1.57347 2.11472 2.1377 1.82715C2.48732 1.64901 2.86958 1.57272 3.31738 1.53613C3.75934 1.50003 4.30822 1.5 5 1.5H9ZM5 2.5C4.29168 2.5 3.79023 2.50022 3.39844 2.53223C3.01264 2.56377 2.77691 2.62345 2.5918 2.71777C2.21554 2.90951 1.90951 3.21554 1.71777 3.5918C1.62345 3.77691 1.56377 4.01264 1.53223 4.39844C1.50022 4.79023 1.5 5.29168 1.5 6V8C1.5 8.70832 1.50022 9.20977 1.53223 9.60156C1.56377 9.98736 1.62345 10.2231 1.71777 10.4082C1.90951 10.7845 2.21554 11.0905 2.5918 11.2822C2.77691 11.3765 3.01264 11.4362 3.39844 11.4678C3.79023 11.4998 4.29168 11.5 5 11.5H9C9.70832 11.5 10.2098 11.4998 10.6016 11.4678C10.9874 11.4362 11.2231 11.3765 11.4082 11.2822C11.7845 11.0905 12.0905 10.7845 12.2822 10.4082C12.3765 10.2231 12.4362 9.98736 12.4678 9.60156C12.4998 9.20977 12.5 8.70832 12.5 8V6C12.5 5.29168 12.4998 4.79023 12.4678 4.39844C12.4362 4.01264 12.3765 3.77691 12.2822 3.5918C12.0905 3.21554 11.7845 2.90951 11.4082 2.71777C11.2231 2.62345 10.9874 2.56377 10.6016 2.53223C10.2098 2.50022 9.70832 2.5 9 2.5H5ZM4.82031 3.5C5.10596 3.5 5.35068 3.49928 5.55078 3.51562C5.75655 3.53246 5.959 3.57 6.15332 3.66895C6.44497 3.81755 6.68245 4.05503 6.83105 4.34668C6.93 4.541 6.96754 4.74345 6.98438 4.94922C7.00072 5.14932 7 5.39404 7 5.67969V8.32031C7 8.60596 7.00072 8.85068 6.98438 9.05078C6.96754 9.25655 6.93 9.459 6.83105 9.65332C6.68245 9.94497 6.44497 10.1825 6.15332 10.3311C5.959 10.43 5.75655 10.4675 5.55078 10.4844C5.35068 10.5007 5.10596 10.5 4.82031 10.5H4.67969C4.39404 10.5 4.14932 10.5007 3.94922 10.4844C3.74345 10.4675 3.541 10.43 3.34668 10.3311C3.05503 10.1825 2.81755 9.94497 2.66895 9.65332C2.57 9.459 2.53246 9.25655 2.51562 9.05078C2.49928 8.85068 2.5 8.60596 2.5 8.32031V5.67969C2.5 5.39404 2.49928 5.14932 2.51562 4.94922C2.53246 4.74345 2.57 4.541 2.66895 4.34668C2.81755 4.05503 3.05503 3.81755 3.34668 3.66895C3.541 3.57 3.74345 3.53246 3.94922 3.51562C4.14932 3.49928 4.39404 3.5 4.67969 3.5H4.82031ZM4.67969 4.5C4.3777 4.5 4.18118 4.50046 4.03125 4.5127C3.88792 4.52441 3.83098 4.54428 3.80078 4.55957C3.69729 4.6123 3.6123 4.69729 3.55957 4.80078C3.54428 4.83098 3.52441 4.88792 3.5127 5.03125C3.50046 5.18118 3.5 5.3777 3.5 5.67969V8.32031C3.5 8.6223 3.50046 8.81882 3.5127 8.96875C3.52441 9.11208 3.54428 9.16901 3.55957 9.19922C3.6123 9.30271 3.69729 9.3877 3.80078 9.44043C3.83098 9.45572 3.88792 9.47559 4.03125 9.4873C4.18118 9.49954 4.3777 9.5 4.67969 9.5H4.82031C5.1223 9.5 5.31882 9.49954 5.46875 9.4873C5.61208 9.47559 5.66902 9.45572 5.69922 9.44043C5.80271 9.3877 5.8877 9.30271 5.94043 9.19922C5.95572 9.16901 5.97559 9.11208 5.9873 8.96875C5.99954 8.81882 6 8.6223 6 8.32031V5.67969C6 5.3777 5.99954 5.18118 5.9873 5.03125C5.97559 4.88792 5.95572 4.83098 5.94043 4.80078C5.8877 4.69729 5.80271 4.6123 5.69922 4.55957C5.66902 4.54428 5.61208 4.52441 5.46875 4.5127C5.31882 4.50046 5.1223 4.5 4.82031 4.5H4.67969ZM11 7.5C11.2761 7.5 11.5 7.72386 11.5 8C11.5 8.27614 11.2761 8.5 11 8.5H8.5C8.22386 8.5 8 8.27614 8 8C8 7.72386 8.22386 7.5 8.5 7.5H11ZM11 5.5C11.2761 5.5 11.5 5.72386 11.5 6C11.5 6.27614 11.2761 6.5 11 6.5H8.5C8.22386 6.5 8 6.27614 8 6C8 5.72386 8.22386 5.5 8.5 5.5H11Z"
        fill="currentColor"
      />
    </svg>
  );
}
function LinkIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
      <path
        d="M3.38306 5.9104C4.75706 4.53659 6.99219 4.61514 8.26978 6.04517L8.39087 6.18774L8.44556 6.27271C8.55146 6.47973 8.50139 6.73993 8.31274 6.89087C8.12421 7.0417 7.85964 7.03348 7.68091 6.88501L7.60962 6.81274L7.43579 6.61841C6.52607 5.70494 5.02475 5.68296 4.09009 6.61743L2.85376 7.85376C1.94445 8.76307 1.94445 10.2374 2.85376 11.1467C3.76308 12.0558 5.23749 12.056 6.14673 11.1467L7.14673 10.1467C7.34199 9.95147 7.6585 9.95147 7.85376 10.1467C8.04881 10.342 8.04895 10.6586 7.85376 10.8538L6.85376 11.8538C5.554 13.1535 3.44658 13.1534 2.14673 11.8538C0.846897 10.5539 0.846897 8.44656 2.14673 7.14673L3.38306 5.9104ZM7.14673 2.14673C8.44656 0.846898 10.5539 0.846897 11.8538 2.14673C13.1534 3.44658 13.1535 5.554 11.8538 6.85376L10.6174 8.09009C9.2435 9.46382 7.00834 9.38513 5.73071 7.95532L5.60962 7.81274L5.55493 7.72778C5.44885 7.52071 5.499 7.26062 5.68774 7.10962C5.87636 6.95875 6.14085 6.96683 6.31958 7.11548L6.39087 7.18774L6.5647 7.38208C7.47444 8.29534 8.97581 8.31745 9.9104 7.38306L11.1467 6.14673C12.056 5.23749 12.0558 3.76308 11.1467 2.85376C10.2374 1.94445 8.76307 1.94445 7.85376 2.85376L6.85376 3.85376C6.65857 4.04895 6.34201 4.04881 6.14673 3.85376C5.95147 3.6585 5.95147 3.34199 6.14673 3.14673L7.14673 2.14673Z"
        fill="currentColor"
      />
    </svg>
  );
}
let participants = [
  { avatar: avatarOne, name: "Dylan Parker", title: "CEO of Basepoint" },
  { avatar: avatarTwo, name: "Annie Zhang", title: "Product Manager at GreenLeaf" },
];
function MeetingDetails() {
  return (
    <div className={cn("px-[5px] pb-[3px]", "lg:px-[10px] lg:pb-[6px]")}>
      <div className="flex flex-col gap-[4px] lg:gap-[8px]">
        <span
          className={cn(
            "font-medium text-[rgba(0,0,0,0.4)]",
            "text-[6px] leading-[8px]",
            "lg:text-[12px] lg:leading-[16px]",
          )}
        >
          {"Details"}
        </span>
        <div className="flex items-start gap-[4px] text-[#505155] lg:gap-[8px]">
          <DetailsIcon className={cn("shrink-0", "mt-[1px] size-[6px]", "lg:mt-[2px] lg:size-[12px]")} />
          <p
            className={cn(
              "font-medium text-[#505155]",
              "text-[6.5px] leading-[8px]",
              "lg:text-[13px] lg:leading-[16px]",
            )}
          >
            {"Demo call with GreenLeaf team to help them get the most out of their PRO trial."}
          </p>
        </div>
        <div className="flex items-center gap-[4px] text-[#505155] lg:gap-[8px]">
          <LinkIcon className={cn("shrink-0", "size-[6px]", "lg:size-[12px]")} />
          <p
            className={cn(
              "font-medium text-[#505155] underline",
              "text-[6.5px] leading-[8px]",
              "lg:text-[13px] lg:leading-[16px]",
            )}
          >
            {"https://meet.google.com/psn-zfzb-yaw"}
          </p>
        </div>
      </div>
      <div className="mt-[8px] flex flex-col gap-[4px] lg:mt-[16px] lg:gap-[8px]">
        <div className="flex items-center gap-[4px] lg:gap-[8px]">
          <span
            className={cn(
              "font-medium text-[rgba(0,0,0,0.4)]",
              "text-[6px] leading-[8px]",
              "lg:text-[12px] lg:leading-[16px]",
            )}
          >
            {"Participants"}
          </span>
          <span
            className={cn(
              "font-medium text-[rgba(0,0,0,0.55)]",
              "rounded-[2.5px] border-[0.5px] border-black-0/5 bg-[#F8F9FA] px-[1.5px] text-[5.5px] leading-[8px]",
              "lg:rounded-[5px] lg:border lg:px-[3px] lg:text-[11px] lg:leading-[16px]",
            )}
          >
            {"8"}
          </span>
        </div>
        {participants.map((e) => (
          <div key={e.name} className="flex items-center gap-[4px] lg:gap-[8px]">
            <Img
              src={e.avatar}
              alt=""
              className={cn("shrink-0 rounded-full ring-black-0/5 ring-inset", "size-[8px]", "lg:size-[16px]")}
            />
            <span
              className={cn(
                "font-medium text-[#505155]",
                "text-[6.5px] leading-[8px]",
                "lg:text-[13px] lg:leading-[16px]",
              )}
            >
              {e.name}
            </span>
            <span
              className={cn(
                "font-medium text-[rgba(0,0,0,0.4)]",
                "text-[6px] leading-[8px]",
                "lg:text-[12px] lg:leading-[16px]",
              )}
            >
              {e.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function MeetingRow({
  name: e,
  time: a,
  dotColor: r,
  isActive: i = false,
}: {
  name: string;
  time: string;
  dotColor: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "gap-[6px] rounded-[5px] py-[3px] pr-[5px] pl-[3px]",
        "lg:gap-[12px] lg:rounded-[10px] lg:py-[6px] lg:pr-[10px] lg:pl-[6px]",
      )}
    >
      <div className="flex items-center gap-[2px] lg:gap-[4px]">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            "size-[10px] min-w-[10px] rounded-[3px]",
            "lg:size-[20px] lg:min-w-[20px] lg:rounded-[6px]",
          )}
        >
          <div className={cn("rounded-full", "size-[4px]", "lg:size-[8px]")} style={{ backgroundColor: r }} />
        </div>
        <span
          className={cn(
            "font-medium text-[#242629]",
            "text-[7px] leading-[10px] tracking-[-0.07px]",
            "lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]",
            { "line-through opacity-30": !i },
          )}
        >
          {e}
        </span>
      </div>
      <span
        className={cn(
          "font-medium text-[rgba(0,0,0,0.4)]",
          "text-[6px] leading-[8px]",
          "lg:text-[12px] lg:leading-[16px]",
        )}
      >
        {a}
      </span>
    </div>
  );
}
function ChevronLeftIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
      <path
        d="M8.14648 3.14673C8.34175 2.95147 8.65825 2.95147 8.85352 3.14673C9.04863 3.342 9.04873 3.65855 8.85352 3.85376L5.70703 7.00024L8.85352 10.1467C9.04863 10.342 9.04873 10.6585 8.85352 10.8538C8.6583 11.049 8.34176 11.0489 8.14648 10.8538L4.64648 7.35376C4.45122 7.1585 4.45122 6.84199 4.64648 6.64673L8.14648 3.14673Z"
        fill="black"
        fillOpacity="0.55"
      />
    </svg>
  );
}
function ChevronRightIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
      <path
        d="M5.14648 3.14673C5.34175 2.95147 5.65825 2.95147 5.85352 3.14673L9.35352 6.64673C9.54863 6.842 9.54873 7.15855 9.35352 7.35376L5.85352 10.8538C5.6583 11.049 5.34176 11.0489 5.14648 10.8538C4.95122 10.6585 4.95122 10.342 5.14648 10.1467L8.29297 7.00024L5.14648 3.85376C4.95122 3.6585 4.95122 3.34199 5.14648 3.14673Z"
        fill="black"
        fillOpacity="0.55"
      />
    </svg>
  );
}
let meetings = [
    {
      dotColor: "#F5A300",
      isActive: false,
      name: "Basepoint x Stripe",
      time: "10:00 - 11:00 AM",
    },
    {
      dotColor: "#CDCED2",
      isActive: false,
      name: "Ashley & Martin",
      time: "10:20 - 10:40 AM",
    },
    {
      dotColor: "#00D17E",
      isActive: true,
      name: "GreenLeaf // Basepoint",
      time: "2:30 - 3:00 PM",
    },
  ];
function Meetings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE_UI_EXIT }, y: -20 }}
      transition={{ delay: 0.6, duration: 0.5, ease: EASE_UI }}
      className={cn("flex w-full flex-col", "mt-[8px]", "lg:mt-[16px]")}
    >
      <div className={cn("flex items-center justify-between", "mb-[6px]", "lg:mb-[12px]")}>
        <span
          className={cn(
            "font-medium text-[rgba(0,0,0,0.55)]",
            "text-[7px] leading-[10px] tracking-[-0.07px]",
            "lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]",
            "ml-1 lg:ml-2",
          )}
        >
          {"Meetings"}
        </span>
        <div className="flex items-center gap-[2px] lg:gap-[4px]">
          <span
            className={cn(
              "font-medium text-[rgba(0,0,0,0.55)]",
              "text-[6px] leading-[8px]",
              "lg:text-[12px] lg:leading-[16px]",
            )}
          >
            {"Today, Oct 14"}
          </span>
          <div className="flex items-center">
            <div
              className={cn(
                "flex shrink-0 items-center justify-center",
                "h-[10px] min-w-[10px] rounded-[3px] px-[2px]",
                "lg:h-[20px] lg:min-w-[20px] lg:rounded-[6px] lg:px-[4px]",
              )}
            >
              <ChevronLeftIcon className={cn("size-[7px]", "lg:size-[14px]")} />
            </div>
            <div
              className={cn(
                "flex shrink-0 items-center justify-center",
                "h-[10px] min-w-[10px] rounded-[3px] px-[2px]",
                "lg:h-[20px] lg:min-w-[20px] lg:rounded-[6px] lg:px-[4px]",
              )}
            >
              <ChevronRightIcon className={cn("size-[7px]", "lg:size-[14px]")} />
            </div>
          </div>
        </div>
      </div>
      <div className={cn("flex flex-col")}>
        {meetings.map((e) => (
          <div
            key={e.name}
            className={cn("rounded-[5px] p-[1px]", "lg:rounded-[10px] lg:p-[2px]", {
              "rounded-[7px] bg-white-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06),0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:rounded-[14px]":
                e.isActive,
            })}
          >
            <MeetingRow name={e.name} time={e.time} dotColor={e.dotColor} isActive={e.isActive} />
            {e.isActive && <MeetingDetails />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
let suggestions = [
    {
      action: "Prep for next meeting",
      color: "#215BC4",
      icon: function ({ ...e }: SVGProps<SVGSVGElement>) {
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
            <g clipPath="url(#clip0_18125_21422)">
              <rect x="0.5" y="0.5" width="15" height="15" rx="4.3" fill="#E5EEFF" />
              <rect x="0.5" y="0.5" width="15" height="15" rx="4.3" stroke="#D6E5FF" />
              <path
                d="M10 3.5C10.2761 3.5 10.5 3.72386 10.5 4V4.5C10.7969 4.51905 11.0068 4.60541 11.1855 4.69727C11.4664 4.84158 11.695 5.07101 11.8379 5.35254C12.0002 5.67254 12 6.09081 12 6.92676V9.62695C12 10.4703 12.0002 10.8923 11.8359 11.2139C11.6913 11.4967 11.4603 11.7268 11.1768 11.8701C11.0156 11.9516 10.8293 11.9914 10.5781 12.0107C10.3269 12.0301 10.0106 12.0294 9.58887 12.0273L6.38867 12.0117C5.55235 12.0077 5.13373 12.0058 4.81445 11.8418C4.5336 11.6975 4.30507 11.4681 4.16211 11.1865C3.9996 10.8664 4 10.4478 4 9.61133V6.91113C4 6.06777 3.99966 5.6458 4.16406 5.32422C4.30872 5.04132 4.53965 4.81127 4.82324 4.66797C5.0007 4.5783 5.20856 4.5169 5.5 4.5V4C5.5 3.72386 5.72386 3.5 6 3.5C6.27614 3.5 6.5 3.72386 6.5 4V4.5H9.5V4C9.5 3.72386 9.72386 3.5 10 3.5ZM6 6C5.72386 6 5.5 6.22386 5.5 6.5C5.5 6.77614 5.72386 7 6 7H10C10.2761 7 10.5 6.77614 10.5 6.5C10.5 6.22386 10.2761 6 10 6H6Z"
                fill="#215BC4"
              />
            </g>
            <defs>
              <clipPath id="clip0_18125_21422">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        );
      },
    },
    {
      action: "Recap last call",
      icon: function ({ ...e }: SVGProps<SVGSVGElement>) {
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
            <g clipPath="url(#clip0_18032_9782)">
              <rect x="0.5" y="0.5" width="15" height="15" rx="4.3" fill="#FEECF3" />
              <rect x="0.5" y="0.5" width="15" height="15" rx="4.3" stroke="#FDDDEA" />
              <path
                d="M11.5 6.34473C11.8616 6.34486 12.1553 6.63833 12.1553 7V7.5C12.1553 9.45726 10.8015 11.0976 8.97949 11.5381C8.99186 11.5902 9 11.6443 9 11.7002V12.2998C9 12.6863 8.68629 12.9999 8.2998 13H7.7002C7.31362 13 7 12.6864 7 12.2998V11.7002C7 11.6443 7.00815 11.5902 7.02051 11.5381C5.19861 11.0976 3.84473 9.45718 3.84473 7.5V7C3.84473 6.63833 4.13837 6.34486 4.5 6.34473C4.86163 6.34486 5.15527 6.63833 5.15527 7V7.5C5.15527 9.07117 6.42886 10.3446 8 10.3447C9.57114 10.3446 10.8447 9.07117 10.8447 7.5V7C10.8447 6.63833 11.1384 6.34486 11.5 6.34473ZM8 3C9.10446 3.00013 10 3.89551 10 5V7.5C10 8.60449 9.10446 9.49987 8 9.5C6.89552 9.49989 6 8.6045 6 7.5V5C6 3.8955 6.89552 3.00011 8 3Z"
                fill="#B81C5D"
              />
            </g>
            <defs>
              <clipPath id="clip0_18032_9782">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        );
      },
    },
  ];
function Suggestions({ className: e }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: EASE_UI }}
      className={cn("flex items-center justify-center", "gap-[4px]", "lg:gap-[8px]", e)}
    >
      {suggestions.map((e) => (
        <div
          key={e.action}
          className={cn(
            "flex shrink-0 items-center justify-center",
            "h-[14px] min-w-[14px] gap-[2px] rounded-[4px] border-[0.5px] border-[rgba(0,0,0,0.05)] pr-[3.5px] pl-[3px]",
            "lg:h-[28px] lg:min-w-[28px] lg:gap-[4px] lg:rounded-[8px] lg:border lg:pr-[7px] lg:pl-[6px]",
          )}
        >
          <e.icon className={cn("shrink-0", "size-[8px]", "lg:size-[16px]")} />
          <div className="flex shrink-0 items-center justify-center px-[0.5px] lg:px-px">
            <span
              className={cn(
                "font-medium text-[rgba(0,0,0,0.55)]",
                "text-[7px] leading-[10px] tracking-[-0.07px]",
                "lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]",
              )}
            >
              {e.action}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
function AttachIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
      <path
        d="M8.5 1C9.19178 1 9.74066 1.00003 10.1826 1.03613C10.6304 1.07272 11.0127 1.14901 11.3623 1.32715C11.9265 1.61472 12.3853 2.07347 12.6729 2.6377C12.851 2.98732 12.9273 3.36958 12.9639 3.81738C13 4.25934 13 4.80822 13 5.5V8.5C13 9.19178 13 9.74066 12.9639 10.1826C12.9273 10.6304 12.851 11.0127 12.6729 11.3623C12.3853 11.9265 11.9265 12.3853 11.3623 12.6729C11.0127 12.851 10.6304 12.9273 10.1826 12.9639C9.74066 13 9.19178 13 8.5 13H5.5C4.80822 13 4.25934 13 3.81738 12.9639C3.36958 12.9273 2.98732 12.851 2.6377 12.6729C2.07347 12.3853 1.61472 11.9265 1.32715 11.3623C1.14901 11.0127 1.07272 10.6304 1.03613 10.1826C1.00003 9.74066 1 9.19178 1 8.5V5.5C1 4.80822 1.00003 4.25934 1.03613 3.81738C1.07272 3.36958 1.14901 2.98732 1.32715 2.6377C1.61472 2.07347 2.07347 1.61472 2.6377 1.32715C2.98732 1.14901 3.36958 1.07272 3.81738 1.03613C4.25934 1.00003 4.80822 1 5.5 1H8.5ZM5.5 2C4.79168 2 4.29023 2.00022 3.89844 2.03223C3.51264 2.06377 3.27691 2.12345 3.0918 2.21777C2.71554 2.40951 2.40951 2.71554 2.21777 3.0918C2.12345 3.27691 2.06377 3.51264 2.03223 3.89844C2.00022 4.29023 2 4.79168 2 5.5V8.5C2 9.20832 2.00022 9.70977 2.03223 10.1016C2.06377 10.4874 2.12345 10.7231 2.21777 10.9082C2.40951 11.2845 2.71554 11.5905 3.0918 11.7822C3.27691 11.8765 3.51264 11.9362 3.89844 11.9678C4.29023 11.9998 4.79168 12 5.5 12H8.5C9.20832 12 9.70977 11.9998 10.1016 11.9678C10.4874 11.9362 10.7231 11.8765 10.9082 11.7822C11.2845 11.5905 11.5905 11.2845 11.7822 10.9082C11.8765 10.7231 11.9362 10.4874 11.9678 10.1016C11.9998 9.70977 12 9.20832 12 8.5V5.5C12 4.79168 11.9998 4.29023 11.9678 3.89844C11.9362 3.51264 11.8765 3.27691 11.7822 3.0918C11.5905 2.71554 11.2845 2.40951 10.9082 2.21777C10.7231 2.12345 10.4874 2.06377 10.1016 2.03223C9.70977 2.00022 9.20832 2 8.5 2H5.5ZM7.52539 3.8418C7.61271 3.57983 7.89623 3.43807 8.1582 3.52539C8.42017 3.61271 8.56193 3.89623 8.47461 4.1582L6.47461 10.1582C6.38729 10.4202 6.10377 10.5619 5.8418 10.4746C5.57983 10.3873 5.43807 10.1038 5.52539 9.8418L7.52539 3.8418Z"
        fill="black"
        fillOpacity="0.55"
      />
    </svg>
  );
}
function SendIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...e}>
      <path
        d="M6.72461 2.08154C6.91862 1.9537 7.18277 1.97532 7.35352 2.146L10.8535 5.646C11.0487 5.84114 11.0484 6.15774 10.8535 6.35303C10.6583 6.54829 10.3417 6.54829 10.1465 6.35303L7.5 3.70654V11.4995C7.5 11.7756 7.27601 11.9994 7 11.9995C6.72386 11.9995 6.5 11.7757 6.5 11.4995V3.70654L3.85352 6.35303C3.65825 6.54829 3.34175 6.54829 3.14648 6.35303C2.95129 6.15776 2.95125 5.84123 3.14648 5.646L6.64648 2.146L6.72461 2.08154Z"
        fill="white"
      />
    </svg>
  );
}
let PROMPT = "How do I win my deal with GreenLeaf?";
function PromptBox({ state: e, onTypingComplete: r }: { state: AskState; onTypingComplete?: () => void }) {
  let [l, n] = useState(""),
    [s, o] = useState(false),
    [d, c] = useState(false),
    C = useRef(e),
    u = "thinking" === e || "response" === e,
    h = !u;
  (useEffect(() => {
    let t = "thinking" === C.current || "response" === C.current,
      a = "initial" === e,
      r = "idle" === e;
    (((t && a) || r) && (n(""), o(false), c(false)), (C.current = e));
  }, [e]),
    useEffect(() => {
      if ("initial" !== e) return;
      let t = 0,
        a = window.setTimeout(() => {
          o(true);
          let e = 0;
          t = window.setInterval(() => {
            e < PROMPT.length ? (n(PROMPT.slice(0, e + 1)), e++) : (window.clearInterval(t), o(false), c(true), r?.());
          }, 40);
        }, 1200);
      return () => {
        (window.clearTimeout(a), window.clearInterval(t));
      };
    }, [e, r]));
  let p = !u && l,
    m = u || !l,
    x = s || d;
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        "gap-[5px]",
        "lg:gap-[10px]",
        "transition-transform duration-[550ms] ease-in-out",
        { "-translate-y-7 lg:-translate-y-14": u, "translate-y-0": !u },
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: EASE_UI }}
        className={cn(
          "flex w-full flex-col bg-white-100",
          "h-[58px] rounded-[7px] border-[0.5px] shadow-[0px_6px_15px_0px_rgba(0,0,0,0.04)]",
          "lg:h-[116px] lg:rounded-[14px] lg:border lg:shadow-[0px_12px_30px_0px_rgba(0,0,0,0.04)]",
          l && !u ? "border-[rgba(38,109,240,0.32)]" : "border-[#E5E7EB]",
        )}
      >
        <div
          className={cn(
            "flex flex-1 items-start",
            "h-[36px] rounded-[5px] px-[6px] py-[4.5px]",
            "lg:h-[72px] lg:rounded-[10px] lg:px-[12px] lg:py-[9px]",
          )}
        >
          <div className="flex h-[11px] flex-1 items-center overflow-clip lg:h-[22px]">
            {p ? (
              <span
                className={cn(
                  "overflow-hidden text-ellipsis font-medium text-[#242629]",
                  "text-[7px] leading-[10px] tracking-[-0.07px]",
                  "lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]",
                )}
              >
                {l}
                {s && (
                  <span className="ml-px inline-block h-[1em] w-px translate-y-[1px] bg-[#266DF0] lg:translate-y-[2px]" />
                )}
              </span>
            ) : (
              <span
                className={cn(
                  "overflow-hidden text-ellipsis font-medium text-[rgba(0,0,0,0.4)]",
                  "text-[7px] leading-[10px] tracking-[-0.07px]",
                  "lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]",
                )}
              >
                {m ? "Ask anything..." : "Ask or search anything"}
              </span>
            )}
          </div>
        </div>
        <div className={cn("flex items-end", "gap-[6px] p-[4px]", "lg:gap-[12px] lg:p-[8px]")}>
          <div className="flex flex-1 items-center justify-end gap-px">
            <div
              className={cn(
                "flex items-center justify-center",
                "h-[14px] min-w-[14px] gap-[2px] rounded-[4px] px-[3.5px]",
                "lg:h-[28px] lg:min-w-[28px] lg:gap-[4px] lg:rounded-[8px] lg:px-[7px]",
              )}
            >
              <div className="flex shrink-0 items-center justify-center px-[0.5px] lg:px-px">
                <span
                  className={cn(
                    "font-medium text-[rgba(0,0,0,0.55)]",
                    "text-[7px] leading-[10px] tracking-[-0.07px]",
                    "lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]",
                  )}
                >
                  {"Auto"}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-[2px] lg:gap-[4px]">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center overflow-clip",
                  "size-[14px] min-w-[14px] rounded-[4px]",
                  "lg:size-[28px] lg:min-w-[28px] lg:rounded-[8px]",
                )}
              >
                <AttachIcon className={cn("size-[7px]", "lg:size-[14px]")} />
              </div>
              <motion.div
                className={cn(
                  "flex shrink-0 items-center justify-center overflow-clip bg-[#266DF0] text-white-100",
                  "size-[14px] min-w-[14px] rounded-[4px] border-[0.5px] border-[rgba(0,0,0,0.1)] shadow-[0px_1px_2px_-1px_rgba(15,107,233,0.12),0px_1.5px_3px_-1px_rgba(15,107,233,0.08)]",
                  "lg:size-[28px] lg:min-w-[28px] lg:rounded-[8px] lg:border lg:shadow-[0px_2px_4px_-2px_rgba(15,107,233,0.12),0px_3px_6px_-2px_rgba(15,107,233,0.08)]",
                )}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: x || u ? 1 : 0.4 }}
                transition={{ duration: 0.3, ease: EASE_UI }}
              >
                <SendIcon className={cn("size-[7px]", "lg:size-[14px]")} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      <Suggestions className={cn({ invisible: !h })} />
    </div>
  );
}
function AskDemoScene({
  className: e,
  loop: l = false,
  onStateChange: n,
}: {
  className?: string;
  loop?: boolean;
  onStateChange: (s: AskState) => void;
}) {
  let s = useRef<HTMLDivElement>(null),
    o = useInView(s, { amount: 0.1, once: false }),
    [d, c] = useState<AskState>(l ? "idle" : "initial");
  useEffect(() => {
    n(d);
  }, [d, n]);
  let C = useCallback(() => {
    c("complete");
  }, []);
  (useEffect(() => {
    l && (o && "idle" === d ? c("initial") : o || "idle" === d || c("idle"));
  }, [o, d, l]),
    useEffect(() => {
      if ("complete" === d) {
        let e = setTimeout(() => {
          c("submitting");
        }, 600);
        return () => clearTimeout(e);
      }
      if ("submitting" === d) {
        let e = setTimeout(() => {
          c("thinking");
        }, 400);
        return () => clearTimeout(e);
      }
      if ("thinking" === d) {
        let e = setTimeout(() => {
          c("response");
        }, 2100);
        return () => clearTimeout(e);
      }
      if ("response" === d && l) {
        let e = setTimeout(() => {
          c("initial");
        }, 13e3);
        return () => clearTimeout(e);
      }
    }, [d, l]));
  let u = "idle" === d || "initial" === d || "typing" === d || "complete" === d || "submitting" === d;
  return (
    <motion.div
      ref={l ? s : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE_UI } }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_UI_EXIT } }}
      className={cn("relative h-full w-full [container-type:size]", e)}
    >
      <div
        className={cn(
          "mx-auto flex h-full w-full max-w-[360px] flex-col lg:max-w-[720px]",
          "px-3",
          "lg:px-6",
          "transition-transform duration-[550ms] ease-in-out",
          {
            "-translate-y-[calc(100cqh-80px)] lg:-translate-y-[calc(100cqh-188px)]": u,
            "translate-y-0": !u,
          },
        )}
      >
        <ChatThread state={d} />
        <Greeting isVisible={u} />
        <PromptBox state={d} onTypingComplete={C} />
        <Meetings />
      </div>
    </motion.div>
  );
}
function StarIcon({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...e}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.89194 1.77422C6.26909 0.729628 7.74639 0.729486 8.12339 1.77422L9.09214 4.45977C9.1181 4.53147 9.18583 4.58038 9.26206 4.58281L12.1146 4.67363C13.2247 4.70935 13.6819 6.11519 12.805 6.79668L10.5501 8.54766C10.4901 8.59433 10.4639 8.67279 10.4847 8.7459L11.2806 11.4881C11.59 12.5551 10.3942 13.4235 9.47495 12.7996L7.11265 11.1971C7.04964 11.1543 6.96677 11.1545 6.90366 11.1971L4.54136 12.7996C3.6221 13.4236 2.42627 12.5552 2.73569 11.4881L3.53062 8.7459C3.55143 8.67293 3.52601 8.59434 3.46616 8.54766L1.21128 6.79668C0.333755 6.11527 0.790306 4.70917 1.90073 4.67363L4.75425 4.58281C4.83027 4.58023 4.89724 4.53126 4.92319 4.45977L5.89194 1.77422ZM7.18296 2.11309C7.12362 1.94947 6.89181 1.94956 6.83237 2.11309L5.8646 4.79863C5.69976 5.25575 5.2721 5.56605 4.78648 5.58184L1.93296 5.67266C1.75857 5.67823 1.68675 5.89962 1.82456 6.00664L4.07944 7.75762C4.46315 8.0557 4.62667 8.55849 4.49155 9.0252L3.69566 11.7664C3.64706 11.934 3.83547 12.0705 3.97984 11.9725L6.34116 10.3689C6.7433 10.0962 7.2721 10.0961 7.67417 10.3689L10.0365 11.9725C10.1808 12.0703 10.3683 11.934 10.3197 11.7664L9.52476 9.0252C9.38953 8.55836 9.55296 8.05572 9.93687 7.75762L12.1917 6.00664C12.3287 5.89958 12.2571 5.67869 12.0834 5.67266L9.22984 5.58184C8.74392 5.56632 8.31663 5.25597 8.15171 4.79863L7.18296 2.11309Z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconZ({ className: e }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={e}>
      <path
        d="M7 2C7.27612 2 7.49996 2.22389 7.5 2.5V6.5H11.5C11.7761 6.5 12 6.72386 12 7C12 7.27614 11.7761 7.5 11.5 7.5H7.5V11.5C7.5 11.7761 7.27614 12 7 12C6.72386 12 6.5 11.7761 6.5 11.5V7.5H2.5C2.22386 7.5 2 7.27614 2 7C2 6.72386 2.22386 6.5 2.5 6.5H6.5V2.5C6.50004 2.22389 6.72388 2 7 2Z"
        fill="#5C5E63"
      />
    </svg>
  );
}
function IconB({ ...e }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...e}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.33325 2.33325C1.96506 2.33325 1.66659 2.63173 1.66659 2.99992V10.9999C1.66659 11.3681 1.96506 11.6666 2.33325 11.6666H11.6666C12.0348 11.6666 12.3333 11.3681 12.3333 10.9999V2.99992C12.3333 2.63173 12.0348 2.33325 11.6666 2.33325H2.33325ZM0.666587 2.99992C0.666587 2.07945 1.41278 1.33325 2.33325 1.33325H11.6666C12.5871 1.33325 13.3333 2.07945 13.3333 2.99992V10.9999C13.3333 11.9204 12.5871 12.6666 11.6666 12.6666H2.33325C1.41278 12.6666 0.666587 11.9204 0.666587 10.9999V2.99992ZM9.33325 2.33325V11.6666H8.33325V2.33325H9.33325Z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconK({ className: e }: { className?: string }) {
  return (
    <svg className={e} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7.438 3.5a.438.438 0 1 1-.876 0 .438.438 0 0 1 .875 0ZM7.438 7a.438.438 0 1 1-.876 0 .438.438 0 0 1 .875 0ZM7.438 10.5a.438.438 0 1 1-.876 0 .438.438 0 0 1 .875 0Z"
        fill="#5C5E63"
        stroke="#5C5E63"
        strokeWidth=".7"
      />
    </svg>
  );
}
function IconButton({ children: e }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-center overflow-clip size-[14px] min-w-[14px] rounded-[4px] lg:size-[28px] lg:min-w-[28px] lg:rounded-[8px]">
      {e}
    </div>
  );
}
function HomeBar() {
  return (
        <div className="flex w-full items-center justify-between gap-[4px] px-[6px] lg:gap-[8px] lg:px-[12px]">
          <div className="flex min-h-px min-w-px flex-1 flex-col items-start">
            <div className="flex h-[11px] w-full items-center lg:h-[22px]">
              <div className="flex shrink-0 items-center gap-[2px] rounded-[3px] px-[2px] py-[0.5px] lg:gap-[4px] lg:rounded-[6px] lg:px-[4px] lg:py-px">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[7px] text-[#242629] lg:size-[14px]">
                  <path d="M5.41699 1.14917C6.33787 0.395804 7.66213 0.395804 8.58301 1.14917L11.8994 3.86304C12.5957 4.43275 12.9999 5.28467 13 6.18433V9.99976C13 11.6566 11.6569 12.9998 10 12.9998H4C2.34315 12.9998 1 11.6566 1 9.99976V6.18433C1.0001 5.28467 1.40429 4.43275 2.10059 3.86304L5.41699 1.14917ZM7.9502 1.92261C7.39768 1.47063 6.60232 1.47063 6.0498 1.92261L2.7334 4.63647C2.26924 5.01626 2.0001 5.5846 2 6.18433V9.99976C2 11.1043 2.89543 11.9998 4 11.9998H10C11.1046 11.9998 12 11.1043 12 9.99976V6.18433C11.9999 5.5846 11.7308 5.01626 11.2666 4.63647L7.9502 1.92261ZM9.5 8.99976C9.77607 8.99976 9.99989 9.22371 10 9.49976C10 9.7759 9.77614 9.99976 9.5 9.99976H4.5C4.22386 9.99976 4 9.7759 4 9.49976C4.00011 9.22371 4.22393 8.99976 4.5 8.99976H9.5Z" fill="currentColor" />
                </svg>
                <div className="flex shrink-0 items-center justify-center px-[1px] lg:px-[2px]">
                  <span className="font-medium text-[#242629] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                    {"Home"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-[4px] lg:gap-[8px]">
            <div className="flex shrink-0 items-center justify-center overflow-clip h-[14px] w-[33px] gap-[2px] rounded-[4px] pr-[3px] pl-[4px] lg:h-[28px] lg:w-[66px] lg:gap-[4px] lg:rounded-[8px] lg:pr-[6px] lg:pl-[8px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="size-[7px] text-[#505155] lg:size-[14px]">
                <circle cx="7" cy="7" r="5.83333" stroke="currentColor" strokeWidth="1.16667" />
                <path d="M5.54199 5.25C5.54199 4.45408 6.20524 3.79167 7.00033 3.79167C7.79541 3.79167 8.45866 4.45408 8.45866 5.25C8.45866 5.76496 8.1848 6.21776 7.77394 6.47467C7.42174 6.69502 7.00033 7.02687 7.00033 7.4375V7.875" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" />
                <ellipse cx="7" cy="9.91683" rx="0.583333" ry="0.583333" fill="currentColor" />
              </svg>
              <div className="flex shrink-0 items-center justify-center px-[0.5px] lg:px-px">
                <span className="font-medium text-[#505155] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                  {"Help"}
                </span>
              </div>
            </div>
          </div>
        </div>
  );
}
function ChatBar() {
  return (
    <div className="flex w-full items-center justify-between gap-[8px] pr-[5px] pl-[8px] lg:gap-[16px] lg:pr-[10px] lg:pl-[16px]">
      <div className="flex min-h-px min-w-px flex-1 items-center">
        <div className="flex shrink-0 items-center gap-[3px] lg:gap-[6px]">
          <span className="truncate font-medium text-[#242629] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
            {"Win deal with GreenLeaf"}
          </span>
          <StarIcon className="shrink-0 text-[#5C5E63] size-[7px] lg:size-[14px]" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-px">
        <IconButton>
          <IconZ className="text-[#5C5E63] size-[7px] lg:size-[14px]" />
        </IconButton>
        <IconButton>
          <IconB className="text-[#5C5E63] size-[7px] lg:size-[14px]" />
        </IconButton>
        <IconButton>
          <IconK className="text-[#5C5E63] size-[7px] lg:size-[14px]" />
        </IconButton>
      </div>
    </div>
  );
}
function FrameTopBar({ isChatMode: e }: { isChatMode: boolean }) {
  return (
    <div className="flex w-full items-center border-[#EEEFF1] h-[20px] border-b-[0.5px] lg:h-[40px] lg:border-b">
      <AnimatePresence mode="wait" initial={false}>
        {e ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_UI }}
            className="flex h-full w-full items-center"
          >
            <ChatBar />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_UI }}
            className="flex h-full w-full items-center"
          >
            <HomeBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
/** The Ask window with its own top bar; `loop` replays the scene each time it scrolls into view. */
export function IntelAskDemoFramed({ className: e, loop: a }: { className?: string; loop?: boolean }) {
  const [r, l] = useState(false),
    n = useCallback((s: AskState) => {
      l("thinking" === s || "response" === s);
    }, []);
  return (
    <div
      className={cn(
        "pointer-events-none relative mb-8 flex h-80 w-full flex-col overflow-hidden rounded-xl border border-subtle-stroke bg-white-100 ring-3 ring-black-100/4 lg:mb-16 lg:h-160",
        e,
      )}
    >
      <FrameTopBar isChatMode={r} />
      <div className="relative flex-1 overflow-hidden">
        <AskDemoScene loop={a} onStateChange={n} />
      </div>
    </div>
  );
}
