"use client";

import { motion, AnimatePresence, useAnimate } from "motion/react";
import {
  useCallback,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";
import { cn } from "@/components/hero/cn";

/* ------------------------------------------------------------------ */
/* Shared text primitives (class strings are already conflict-merged)  */
/* ------------------------------------------------------------------ */

const TEXT_BODY = "font-medium text-[7px] leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]";
const TEXT_CAPTION_SIZE = "font-medium text-[6px] leading-[8px] tracking-normal lg:text-[12px] lg:leading-4";
const SMALL_TEXT_SIZE = "font-medium text-[5.5px] leading-[8px] tracking-[-0.11px] lg:text-[11px] lg:leading-4 lg:tracking-[-0.22px]";

function TextBody({ className, style, children }: { className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <span className={cn(TEXT_BODY, className)} style={style}>
      {children}
    </span>
  );
}

/** Caption text. `color` replaces the default `text-[#232529]`. */
function TextCaption({ className, color, style, children }: { className?: string; color?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <span className={cn(TEXT_CAPTION_SIZE, color ?? "text-[#232529]", className)} style={style}>
      {children}
    </span>
  );
}

/** Small label text. `color` replaces the default `text-[#232529]`. */
function SmallText({ className, color, style, children }: { className?: string; color?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <span className={cn(SMALL_TEXT_SIZE, color ?? "text-[#232529]", className)} style={style}>
      {children}
    </span>
  );
}

function Badge({ children }: { children?: ReactNode }) {
  return (
    <span className="font-medium inline-flex items-center justify-center border-[#EEEFF1] bg-[#F4F5F6] text-center min-w-2 border-[0.5px] px-[1.5px] lg:min-w-4 lg:border lg:px-[3px] text-[#5C5E63] mt-[0.5px] h-[7px] rounded-xs text-[5px] leading-[7px] tracking-[-0.1px] lg:mt-px lg:h-[14px] lg:rounded-sm lg:text-[10px] lg:leading-[14px] lg:tracking-[-0.2px]">
      {children}
    </span>
  );
}

const TAG_BASE = "font-medium text-[#232529] text-[6px] leading-[8px] tracking-normal lg:text-[12px] lg:leading-4 inline-flex items-center text-nowrap border-[0.5px] px-[2.5px] py-[0.5px] lg:border lg:px-[5px] lg:py-px";

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

const useIsoInsertion = typeof window !== "undefined" ? useInsertionEffect || useLayoutEffect : () => {};

function useEvent<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const ref = useRef(fn);
  useIsoInsertion(() => {
    ref.current = fn;
  }, [fn]);
  const stable = useRef<((...args: A) => R) | null>(null);
  if (!stable.current) stable.current = (...args: A) => ref.current(...args);
  return stable.current;
}

function useMaxWidth(maxWidth: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth})`);
    const update = () => setMatches(!!mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [maxWidth]);
  return matches;
}

function useMeasure<T extends Element>(): [(el: T | null) => void, { width: number; height: number }] {
  const [el, setEl] = useState<T | null>(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });
  const observer = useMemo(
    () =>
      typeof window !== "undefined" && window.ResizeObserver
        ? new window.ResizeObserver((entries) => {
            const r = entries[0]?.contentRect;
            if (r) setRect({ width: r.width, height: r.height });
          })
        : null,
    [],
  );
  useLayoutEffect(() => {
    if (!el || !observer) return;
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, observer]);
  return [setEl, rect];
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };

function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.80469 1.13852C4.18661 1.10111 4.55892 1.22494 4.93945 1.40512C5.32254 1.58654 5.79059 1.8635 6.375 2.20883L10.2578 4.50278C10.8248 4.83784 11.2802 5.10667 11.6152 5.34848C11.9487 5.58915 12.23 5.84935 12.3818 6.19418C12.6078 6.70755 12.6078 7.29215 12.3818 7.80551C12.23 8.15031 11.9487 8.41056 11.6152 8.65122C11.2802 8.89302 10.8248 9.16186 10.2578 9.49692L6.375 11.7909C5.79059 12.1362 5.32253 12.4132 4.93945 12.5946C4.55894 12.7747 4.1866 12.8986 3.80469 12.8612C3.23797 12.8056 2.72189 12.5113 2.38574 12.0516C2.15926 11.7419 2.07656 11.3585 2.03809 10.9393C1.99936 10.5171 2 9.97284 2 9.29379V4.7059C2 4.02686 1.99937 3.48259 2.03809 3.06039C2.07655 2.64115 2.15927 2.25786 2.38574 1.94809C2.72189 1.48841 3.23795 1.19415 3.80469 1.13852ZM3.90234 2.13364C3.61899 2.16146 3.36045 2.3081 3.19238 2.53793C3.12978 2.6236 3.068 2.783 3.03418 3.15122C3.00064 3.51688 3 4.00706 3 4.7059V9.29379C3 9.99264 3.00063 10.4828 3.03418 10.8485C3.06801 11.2167 3.12977 11.3761 3.19238 11.4618C3.36046 11.6916 3.619 11.8382 3.90234 11.8661C4.00798 11.8764 4.17718 11.8496 4.51172 11.6913C4.84353 11.5341 5.26478 11.2849 5.86621 10.9295L9.74902 8.63559C10.3329 8.29056 10.7412 8.04927 11.0303 7.84067C11.3206 7.63114 11.4242 7.49972 11.4668 7.40317C11.5799 7.1464 11.5799 6.8533 11.4668 6.59653C11.4242 6.49997 11.3206 6.36859 11.0303 6.15903C10.7412 5.95042 10.3329 5.70915 9.74902 5.36411L5.86621 3.07016C5.26477 2.71476 4.84353 2.46558 4.51172 2.30844C4.17715 2.15003 4.00798 2.12329 3.90234 2.13364Z" fill="#242629" />
    </svg>
  );
}

function RunsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="4.5" width="10" height="5" rx="2" stroke="#232529" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12.5v-1M7 2.5v-1" stroke="#232529" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#75777C">
      <g strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2.16 9.248.836.13a1.216 1.216 0 0 1 1.011 1.298l-.061.862a.616.616 0 0 0 .337.597l.618.304a.59.59 0 0 0 .667-.102l.62-.587a1.176 1.176 0 0 1 1.623 0l.62.587a.589.589 0 0 0 .667.102l.62-.305a.613.613 0 0 0 .336-.595l-.062-.863a1.216 1.216 0 0 1 1.011-1.298l.835-.13a.605.605 0 0 0 .495-.47l.152-.683a.619.619 0 0 0-.246-.643l-.697-.488a1.24 1.24 0 0 1-.36-1.617l.42-.75a.625.625 0 0 0-.05-.688l-.428-.548a.592.592 0 0 0-.645-.204l-.807.253a1.189 1.189 0 0 1-1.462-.72l-.31-.802a.6.6 0 0 0-.559-.388l-.684.002a.6.6 0 0 0-.558.39l-.301.794a1.188 1.188 0 0 1-1.465.725l-.841-.264a.592.592 0 0 0-.647.205l-.424.549a.625.625 0 0 0-.047.69l.43.751A1.24 1.24 0 0 1 2.45 6.97l-.688.483a.62.62 0 0 0-.246.642l.152.683c.055.246.25.433.494.47Z" />
        <path d="M8.197 5.803a1.693 1.693 0 1 1-2.394 2.394 1.693 1.693 0 0 1 2.394-2.394Z" />
      </g>
    </svg>
  );
}

function EditorIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1.5" stroke="#75777C" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 8v2.5a1 1 0 0 0 1 1v0M8 2.5h2.5a1 1 0 0 1 1 1v0" stroke="#75777C" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M10.705 5.808a1.052 1.052 0 0 1 1.487 1.487l-3.77 3.77c-.349.35-.524.524-.722.666a3.001 3.001 0 0 1-.563.32c-.224.096-.464.156-.944.276L5.5 12.5l.173-.693c.12-.48.18-.72.277-.944a3 3 0 0 1 .319-.563c.142-.198.317-.373.667-.723l3.769-3.769Z" stroke="#75777C" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RunningSpinner({ className }: IconProps) {
  return (
    <svg className={cn("animate-spin", className)} width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M9.805 8.403a4.5 4.5 0 1 1-7.61-4.806 4.5 4.5 0 0 1 7.61 4.806h0Z" stroke="#E8DDFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 1.5a4.5 4.5 0 1 1-3.182 7.682" stroke="#9162F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 -0.72 8.4 8.4" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.48042 0.220852C7.63454 -0.00813392 7.94566 -0.068903 8.17476 0.0851102C8.40341 0.239308 8.46439 0.550487 8.3105 0.779446L4.67281 6.19058C4.00473 7.18426 2.55769 7.22824 1.83003 6.27749L0.102494 4.01773C-0.0648519 3.79843 -0.0228667 3.48519 0.196244 3.31753C0.415553 3.14997 0.729695 3.19111 0.897416 3.41031L2.62496 5.67007C2.93697 6.0769 3.55657 6.05765 3.84273 5.63199L7.48042 0.220852Z" fill="currentColor" />
    </svg>
  );
}

function TriggerPlayIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="-0.3 0 8.2 8.16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 1.44219C0 0.338829 1.19044 -0.354709 2.15039 0.189265L6.80371 2.82598C7.77672 3.37766 7.77675 4.78019 6.80371 5.33184L2.15039 7.96856C1.19047 8.51248 6.39196e-05 7.81893 0 6.71563V1.44219ZM1.65723 1.05938C1.36391 0.893169 1 1.10505 1 1.44219V6.71563C1.00006 7.05271 1.36394 7.2646 1.65723 7.09844L6.31055 4.46173C6.6077 4.29315 6.60768 3.8647 6.31055 3.6961L1.65723 1.05938Z" fill="currentColor" />
    </svg>
  );
}

function AddListIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.5 9C11.7761 9 12 9.22386 12 9.5V11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H12V13.5C12 13.7761 11.7761 14 11.5 14C11.2239 14 11 13.7761 11 13.5V12H9.5C9.22386 12 9 11.7761 9 11.5C9 11.2239 9.22386 11 9.5 11H11V9.5C11 9.22386 11.2239 9 11.5 9ZM8.94531 0C10.2249 0.000239291 11.2806 0.942151 11.4668 2.16992C11.604 2.21074 11.7353 2.26242 11.8623 2.32715C12.4265 2.61472 12.8853 3.07347 13.1729 3.6377C13.351 3.98732 13.4273 4.36958 13.4639 4.81738C13.5 5.25934 13.5 5.80822 13.5 6.5V7.75C13.5 8.02614 13.2761 8.25 13 8.25C12.7239 8.25 12.5 8.02614 12.5 7.75V6.5C12.5 5.79168 12.4998 5.29023 12.4678 4.89844C12.4362 4.51264 12.3765 4.27691 12.2822 4.0918C12.0905 3.71554 11.7845 3.40951 11.4082 3.21777C11.2231 3.12345 10.9874 3.06377 10.6016 3.03223C10.2098 3.00022 9.70832 3 9 3H6.5C5.79168 3 5.29023 3.00022 4.89844 3.03223C4.51264 3.06377 4.27691 3.12345 4.0918 3.21777C3.71554 3.40951 3.40951 3.71554 3.21777 4.0918C3.12345 4.27691 3.06377 4.51264 3.03223 4.89844C3.00022 5.29023 3 5.79168 3 6.5V9C3 9.70832 3.00022 10.2098 3.03223 10.6016C3.06377 10.9874 3.12345 11.2231 3.21777 11.4082C3.40951 11.7845 3.71554 12.0905 4.0918 12.2822C4.27691 12.3765 4.51264 12.4362 4.89844 12.4678C5.29023 12.4998 5.79168 12.5 6.5 12.5H7.5C7.77614 12.5 8 12.7239 8 13C8 13.2761 7.77614 13.5 7.5 13.5H6.5C5.80822 13.5 5.25934 13.5 4.81738 13.4639C4.36958 13.4273 3.98732 13.351 3.6377 13.1729C3.07347 12.8853 2.61472 12.4265 2.32715 11.8623C2.26381 11.738 2.21323 11.6096 2.17285 11.4756C0.946929 11.3152 0 10.2697 0 9V4.5C0 3.80822 2.78804e-05 3.25934 0.0361328 2.81738C0.0727196 2.36958 0.149006 1.98732 0.327148 1.6377C0.614723 1.07347 1.07347 0.614723 1.6377 0.327148C1.98732 0.149006 2.36958 0.0727196 2.81738 0.0361328C3.25934 2.78783e-05 3.80822 0 4.5 0H8.94531ZM7.5 10.5C7.77614 10.5 8 10.7239 8 11C8 11.2761 7.77614 11.5 7.5 11.5H5C4.72386 11.5 4.5 11.2761 4.5 11C4.5 10.7239 4.72386 10.5 5 10.5H7.5ZM4.5 1C3.79168 1 3.29023 1.00022 2.89844 1.03223C2.51264 1.06377 2.27691 1.12345 2.0918 1.21777C1.71554 1.40951 1.40951 1.71554 1.21777 2.0918C1.12345 2.27691 1.06377 2.51264 1.03223 2.89844C1.00022 3.29023 1 3.79168 1 4.5V9C1 9.66054 1.42751 10.2197 2.02051 10.4199C2.00126 10.0277 2 9.56087 2 9V6.5C2 5.80822 2.00003 5.25934 2.03613 4.81738C2.07272 4.36958 2.14901 3.98732 2.32715 3.6377C2.61472 3.07347 3.07347 2.61472 3.6377 2.32715C3.98732 2.14901 4.36958 2.07272 4.81738 2.03613C5.25934 2.00003 5.80822 2 6.5 2H9C9.55251 2 10.0138 2.00113 10.4023 2.01953C10.1837 1.42525 9.61527 1.00021 8.94531 1H4.5ZM9 8.5C9.27614 8.5 9.5 8.72386 9.5 9C9.5 9.27614 9.27614 9.5 9 9.5H5C4.72386 9.5 4.5 9.27614 4.5 9C4.5 8.72386 4.72386 8.5 5 8.5H9ZM6.41211 4.50781C6.53449 4.51657 6.66925 4.53722 6.80566 4.59668C7.07302 4.71333 7.28667 4.92698 7.40332 5.19434C7.46278 5.33075 7.48343 5.46551 7.49219 5.58789C7.5006 5.70564 7.5 5.84695 7.5 6C7.5 6.15305 7.5006 6.29436 7.49219 6.41211C7.48343 6.53449 7.46278 6.66925 7.40332 6.80566C7.28667 7.07302 7.07302 7.28667 6.80566 7.40332C6.66925 7.46278 6.53449 7.48343 6.41211 7.49219C6.29436 7.5006 6.15305 7.5 6 7.5C5.84695 7.5 5.70564 7.5006 5.58789 7.49219C5.46551 7.48343 5.33075 7.46278 5.19434 7.40332C4.92698 7.28667 4.71333 7.07302 4.59668 6.80566C4.53722 6.66925 4.51657 6.53449 4.50781 6.41211C4.4994 6.29436 4.5 6.15305 4.5 6C4.5 5.84695 4.4994 5.70564 4.50781 5.58789C4.51657 5.46551 4.53722 5.33075 4.59668 5.19434C4.71333 4.92698 4.92698 4.71333 5.19434 4.59668C5.33075 4.53722 5.46551 4.51657 5.58789 4.50781C5.70564 4.4994 5.84695 4.5 6 4.5C6.15305 4.5 6.29436 4.4994 6.41211 4.50781ZM5.65918 5.50586C5.59038 5.51079 5.58265 5.51754 5.59375 5.5127C5.55762 5.52846 5.52846 5.55762 5.5127 5.59375C5.51754 5.58265 5.51079 5.59038 5.50586 5.65918C5.50058 5.73303 5.5 5.8326 5.5 6C5.5 6.1674 5.50058 6.26697 5.50586 6.34082C5.51079 6.40962 5.51754 6.41735 5.5127 6.40625C5.52846 6.44238 5.55762 6.47154 5.59375 6.4873C5.58265 6.48246 5.59038 6.48921 5.65918 6.49414C5.73303 6.49942 5.8326 6.5 6 6.5C6.1674 6.5 6.26697 6.49942 6.34082 6.49414C6.40962 6.48921 6.41735 6.48246 6.40625 6.4873C6.44238 6.47154 6.47154 6.44238 6.4873 6.40625C6.48246 6.41735 6.48921 6.40962 6.49414 6.34082C6.49942 6.26697 6.5 6.1674 6.5 6C6.5 5.8326 6.49942 5.73303 6.49414 5.65918C6.48921 5.59038 6.48246 5.58265 6.4873 5.59375C6.47154 5.55762 6.44238 5.52846 6.40625 5.5127C6.41735 5.51754 6.40962 5.51079 6.34082 5.50586C6.26697 5.50058 6.1674 5.5 6 5.5C5.8326 5.5 5.73303 5.50058 5.65918 5.50586Z" fill="currentColor" />
    </svg>
  );
}

function AgentIcon({ className }: IconProps) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.77614 0 9 0.223858 9 0.5V1.50391C9.18802 1.50862 9.34402 1.51939 9.4873 1.54785C10.479 1.74512 11.2549 2.52097 11.4521 3.5127C11.4806 3.65598 11.4914 3.81198 11.4961 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H11.5V6H12.5C12.7761 6 13 6.22386 13 6.5C13 6.77614 12.7761 7 12.5 7H11.5V8H12.5C12.7761 8 13 8.22386 13 8.5C13 8.77614 12.7761 9 12.5 9H11.4961C11.4914 9.18802 11.4806 9.34402 11.4521 9.4873C11.2549 10.479 10.479 11.2549 9.4873 11.4521C9.34403 11.4806 9.18801 11.4904 9 11.4951V12.5C9 12.7761 8.77614 13 8.5 13C8.22386 13 8 12.7761 8 12.5V11.5H7V12.5C7 12.7761 6.77614 13 6.5 13C6.22386 13 6 12.7761 6 12.5V11.5H5V12.5C5 12.7761 4.77614 13 4.5 13C4.22386 13 4 12.7761 4 12.5V11.4951C3.81199 11.4904 3.65597 11.4806 3.5127 11.4521C2.52097 11.2549 1.74512 10.479 1.54785 9.4873C1.51939 9.34402 1.50862 9.18802 1.50391 9H0.5C0.223858 9 0 8.77614 0 8.5C0 8.22386 0.223858 8 0.5 8H1.5V7H0.5C0.223858 7 0 6.77614 0 6.5C0 6.22386 0.223858 6 0.5 6H1.5V5H0.5C0.223858 5 0 4.77614 0 4.5C0 4.22386 0.223858 4 0.5 4H1.50391C1.50862 3.81198 1.51939 3.65598 1.54785 3.5127C1.74512 2.52097 2.52097 1.74512 3.5127 1.54785C3.65598 1.51939 3.81198 1.50862 4 1.50391V0.5C4 0.223858 4.22386 0 4.5 0C4.77614 0 5 0.223858 5 0.5V1.5H6V0.5C6 0.223858 6.22386 0 6.5 0C6.77614 0 7 0.223858 7 0.5V1.5H8V0.5C8 0.223858 8.22386 0 8.5 0ZM4.5 2.5C4.01138 2.5 3.83975 2.5029 3.70703 2.5293C3.11233 2.64776 2.64776 3.11233 2.5293 3.70703C2.5029 3.83975 2.5 4.01138 2.5 4.5V8.5C2.5 8.98862 2.5029 9.16024 2.5293 9.29297C2.64776 9.88767 3.11233 10.3522 3.70703 10.4707C3.83975 10.4971 4.01138 10.5 4.5 10.5H8.5C8.98862 10.5 9.16024 10.4971 9.29297 10.4707C9.88767 10.3522 10.3522 9.88767 10.4707 9.29297C10.4971 9.16024 10.5 8.98862 10.5 8.5V4.5C10.5 4.01138 10.4971 3.83975 10.4707 3.70703C10.3522 3.11233 9.88767 2.64776 9.29297 2.5293C9.16024 2.5029 8.98862 2.5 8.5 2.5H4.5ZM6.50098 3.5C6.69844 3.50038 6.87706 3.61728 6.95703 3.79785L8.50586 7.29492L8.95605 8.29492C9.06928 8.54672 8.95686 8.84275 8.70508 8.95605C8.45328 9.06928 8.15725 8.95686 8.04395 8.70508L7.72656 8H5.2666L4.95801 8.70117C4.84684 8.95383 4.55152 9.069 4.29883 8.95801C4.04617 8.84684 3.931 8.55152 4.04199 8.29883L4.48242 7.29883L4.4834 7.29688L6.04297 3.79688C6.12342 3.61637 6.30336 3.49976 6.50098 3.5ZM5.70996 7H7.28223L6.49805 5.23047L5.70996 7Z" fill="currentColor" />
    </svg>
  );
}

function NewRecordIcon({ className }: IconProps) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5 8C10.776 8.00013 11 8.22394 11 8.5V10H12.5C12.776 10.0001 13 10.2239 13 10.5C13 10.7761 12.776 10.9999 12.5 11H11V12.5C11 12.7761 10.776 12.9999 10.5 13C10.2239 13 10 12.7761 10 12.5V11H8.5C8.22386 11 8 10.7761 8 10.5C8 10.2239 8.22386 10 8.5 10H10V8.5C10 8.22386 10.2239 8 10.5 8ZM7.5 0C8.19178 0 8.74066 2.78582e-05 9.18262 0.0361328C9.63042 0.0727196 10.0127 0.149006 10.3623 0.327148C10.9265 0.614723 11.3853 1.07347 11.6729 1.6377C11.851 1.98732 11.9273 2.36958 11.9639 2.81738C12 3.25934 12 3.80822 12 4.5V6C12 6.27614 11.7761 6.5 11.5 6.5C11.2239 6.5 11 6.27614 11 6V4.5C11 3.79168 10.9998 3.29023 10.9678 2.89844C10.9362 2.51264 10.8765 2.27691 10.7822 2.0918C10.5905 1.71554 10.2845 1.40951 9.9082 1.21777C9.72309 1.12345 9.48736 1.06377 9.10156 1.03223C8.70977 1.00022 8.20832 1 7.5 1H4.5C3.79168 1 3.29023 1.00022 2.89844 1.03223C2.51264 1.06377 2.27691 1.12345 2.0918 1.21777C1.71554 1.40951 1.40951 1.71554 1.21777 2.0918C1.12345 2.27691 1.06377 2.51264 1.03223 2.89844C1.00022 3.29023 1 3.79168 1 4.5V7.5C1 8.20829 1.00022 8.70977 1.03223 9.10156C1.06377 9.48734 1.12346 9.7231 1.21777 9.9082C1.40951 10.2844 1.71555 10.5905 2.0918 10.7822C2.27691 10.8765 2.51265 10.9362 2.89844 10.9678C3.29023 10.9998 3.79171 11 4.5 11H6.5C6.77614 11 6.99999 11.2239 7 11.5C6.99993 11.7761 6.7761 12 6.5 12H4.5C3.80822 12 3.25933 12 2.81738 11.9639C2.36957 11.9273 1.98733 11.851 1.6377 11.6729C1.07348 11.3853 0.614728 10.9265 0.327148 10.3623C0.149002 10.0127 0.0727205 9.63042 0.0361328 9.18262C2.42571e-05 8.74066 -3.04498e-08 8.19178 0 7.5V4.5C0 3.80822 2.78804e-05 3.25934 0.0361328 2.81738C0.0727196 2.36958 0.149006 1.98732 0.327148 1.6377C0.614723 1.07347 1.07347 0.614723 1.6377 0.327148C1.98732 0.149006 2.36958 0.0727196 2.81738 0.0361328C3.25934 2.78804e-05 3.80822 0 4.5 0H7.5ZM6.5 8.5C6.77614 8.5 7 8.72386 7 9C7 9.27614 6.77614 9.5 6.5 9.5H3C2.72386 9.5 2.5 9.27614 2.5 9C2.5 8.72386 2.72386 8.5 3 8.5H6.5ZM9 6.5C9.27614 6.5 9.5 6.72386 9.5 7C9.5 7.27614 9.27614 7.5 9 7.5H3C2.72386 7.5 2.5 7.27614 2.5 7C2.5 6.72386 2.72386 6.5 3 6.5H9ZM4.38574 2.50684C4.50016 2.51429 4.62583 2.53164 4.75391 2.58203C5.05792 2.70166 5.29834 2.94208 5.41797 3.24609C5.46836 3.37417 5.48571 3.49984 5.49316 3.61426C5.50032 3.7244 5.5 3.85617 5.5 4C5.5 4.14383 5.50032 4.2756 5.49316 4.38574C5.48571 4.50016 5.46836 4.62583 5.41797 4.75391C5.29834 5.05792 5.05792 5.29834 4.75391 5.41797C4.62583 5.46836 4.50016 5.48571 4.38574 5.49316C4.2756 5.50032 4.14383 5.5 4 5.5C3.85617 5.5 3.7244 5.50032 3.61426 5.49316C3.49984 5.48571 3.37417 5.46836 3.24609 5.41797C2.94208 5.29834 2.70166 5.05792 2.58203 4.75391C2.53164 4.62583 2.51429 4.50016 2.50684 4.38574C2.49968 4.2756 2.5 4.14383 2.5 4C2.5 3.85617 2.49968 3.7244 2.50684 3.61426C2.51429 3.49984 2.53164 3.37417 2.58203 3.24609C2.70166 2.94208 2.94208 2.70166 3.24609 2.58203C3.37417 2.53164 3.49984 2.51429 3.61426 2.50684C3.7244 2.49968 3.85617 2.5 4 2.5C4.14383 2.5 4.2756 2.49968 4.38574 2.50684ZM3.67871 3.50488C3.63798 3.50755 3.6189 3.51121 3.6123 3.5127C3.5666 3.53068 3.53068 3.5666 3.5127 3.6123C3.51121 3.6189 3.50755 3.63798 3.50488 3.67871C3.50031 3.74886 3.5 3.84299 3.5 4C3.5 4.15701 3.50031 4.25114 3.50488 4.32129C3.50755 4.36202 3.51121 4.3811 3.5127 4.3877C3.53068 4.4334 3.5666 4.46932 3.6123 4.4873C3.6189 4.48879 3.63798 4.49245 3.67871 4.49512C3.74886 4.49969 3.84299 4.5 4 4.5C4.15701 4.5 4.25114 4.49969 4.32129 4.49512C4.36202 4.49245 4.3811 4.48879 4.3877 4.4873C4.4334 4.46932 4.46932 4.4334 4.4873 4.3877C4.48879 4.3811 4.49245 4.36202 4.49512 4.32129C4.49969 4.25114 4.5 4.15701 4.5 4C4.5 3.84299 4.49969 3.74886 4.49512 3.67871C4.49245 3.63798 4.48879 3.6189 4.4873 3.6123C4.46932 3.5666 4.4334 3.53068 4.3877 3.5127C4.3811 3.51121 4.36202 3.50755 4.32129 3.50488C4.25114 3.50031 4.15701 3.5 4 3.5C3.84299 3.5 3.74886 3.50031 3.67871 3.50488Z" fill="currentColor" />
    </svg>
  );
}

function WebAgentIcon({ className }: IconProps) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.5 7C10.8807 7 12 8.11929 12 9.5C12 10.0095 11.8467 10.4827 11.585 10.8779L12.8535 12.1465C13.0488 12.3417 13.0488 12.6583 12.8535 12.8535C12.6583 13.0488 12.3417 13.0488 12.1465 12.8535L10.8779 11.585C10.4827 11.8467 10.0095 12 9.5 12C8.11929 12 7 10.8807 7 9.5C7 8.11929 8.11929 7 9.5 7ZM9 0C10.6569 0 12 1.34315 12 3V5.5C12 5.77614 11.7761 6 11.5 6C11.2239 6 11 5.77614 11 5.5V3C11 1.89543 10.1046 1 9 1H3C1.89543 1 1 1.89543 1 3V9C1 10.1046 1.89543 11 3 11H5.5C5.77614 11 6 11.2239 6 11.5C6 11.7761 5.77614 12 5.5 12H3C1.34315 12 0 10.6569 0 9V3C1.93279e-07 1.34315 1.34315 6.44266e-08 3 0H9ZM9.5 8C8.67157 8 8 8.67157 8 9.5C8 10.3284 8.67157 11 9.5 11C10.3284 11 11 10.3284 11 9.5C11 8.67157 10.3284 8 9.5 8ZM5.5 8.5C5.77614 8.5 6 8.72386 6 9C6 9.27614 5.77614 9.5 5.5 9.5H3C2.72386 9.5 2.5 9.27614 2.5 9C2.5 8.72386 2.72386 8.5 3 8.5H5.5ZM6.5 6.5C6.77614 6.5 7 6.72386 7 7C7 7.27614 6.77614 7.5 6.5 7.5H3C2.72386 7.5 2.5 7.27614 2.5 7C2.5 6.72386 2.72386 6.5 3 6.5H6.5ZM4.32324 2.5C4.97311 2.50009 5.49991 3.02689 5.5 3.67676V4.32324C5.49991 4.97311 4.97311 5.49991 4.32324 5.5H3.67676C3.02689 5.49991 2.50009 4.97311 2.5 4.32324V3.67676C2.50009 3.02689 3.02689 2.50009 3.67676 2.5H4.32324ZM3.67676 3.5C3.57918 3.50009 3.50009 3.57918 3.5 3.67676V4.32324C3.50009 4.42082 3.57918 4.49991 3.67676 4.5H4.32324C4.42082 4.49991 4.49991 4.42082 4.5 4.32324V3.67676C4.49991 3.57918 4.42082 3.50009 4.32324 3.5H3.67676Z" fill="currentColor" />
    </svg>
  );
}

function AttemptCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <g transform="translate(0.875 0.875)">
        <path d="M12.25 6.125C12.25 9.50774 9.50774 12.25 6.125 12.25C2.74226 12.25 0 9.50774 0 6.125C0 2.74226 2.74226 0 6.125 0C9.50774 0 12.25 2.74226 12.25 6.125Z" fill="currentColor" />
        <path d="M6.125 0.5C9.2316 0.5 11.75 3.0184 11.75 6.125C11.75 9.2316 9.2316 11.75 6.125 11.75C3.0184 11.75 0.5 9.2316 0.5 6.125C0.5 3.0184 3.0184 0.5 6.125 0.5Z" stroke="black" strokeOpacity="0.05" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(4 4.5) scale(0.8219 0.99955)">
        <path d="M0.650125 3.31672L0.676234 3.36507C1.26349 4.45259 1.55712 4.99634 1.96285 5.19987C2.31713 5.37758 2.72899 5.40141 3.1014 5.26575C3.5279 5.11038 3.88229 4.60411 4.59105 3.59159L6.65013 0.650056" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M10.1465 5.14645C10.3417 4.95118 10.6582 4.95118 10.8535 5.14645C11.0486 5.34172 11.0487 5.65827 10.8535 5.85348L7.35348 9.35348C7.15827 9.54869 6.84172 9.54859 6.64645 9.35348L3.14645 5.85348C2.95118 5.65822 2.95118 5.34171 3.14645 5.14645C3.34171 4.95118 3.65822 4.95118 3.85348 5.14645L7 8.29293L10.1465 5.14645Z" fill="#505155" />
    </svg>
  );
}

function RerunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <g transform="translate(1 1)">
        <path d="M11.5003 0.000400861C11.7764 0.000400861 12.0002 0.22437 12.0003 0.500401V3.0004C12.0003 3.82883 11.3287 4.5004 10.5003 4.5004H8.0003C7.72434 4.50019 7.5003 4.27641 7.5003 4.0004C7.50043 3.7245 7.72442 3.50061 8.0003 3.5004H10.3304C9.79909 2.58034 8.9882 1.85354 8.01593 1.42521C7.04358 0.996946 5.95967 0.88853 4.92218 1.11759C3.88472 1.34671 2.94701 1.90077 2.24542 2.69864C1.5438 3.49658 1.11433 4.49775 1.01983 5.55606C0.925421 6.61429 1.17092 7.67584 1.72003 8.58536C2.26918 9.49467 3.09424 10.2054 4.07452 10.6147C5.0551 11.0238 6.14128 11.1101 7.17413 10.8608C8.20696 10.6113 9.13382 10.0395 9.81964 9.22794C9.99775 9.01721 10.3128 8.99057 10.5237 9.16837C10.7347 9.34661 10.7615 9.66253 10.5833 9.87345C9.76027 10.8473 8.64798 11.5331 7.4085 11.8324C6.16907 12.1317 4.86646 12.0285 3.68975 11.5375C2.51312 11.0464 1.52264 10.1934 0.863581 9.10196C0.204674 8.01055 -0.089553 6.73705 0.0237375 5.4672C0.137125 4.19722 0.652509 2.99602 1.49444 2.03849C2.33632 1.08103 3.46143 0.416001 4.70635 0.141026C5.95134 -0.133842 7.25244 -0.00471482 8.41925 0.50919C9.47243 0.97315 10.3671 1.73011 11.0003 2.68497V0.500401C11.0004 0.224499 11.2244 0.000610353 11.5003 0.000400861Z" fill="currentColor" />
      </g>
    </svg>
  );
}

function CompletedCardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <g opacity=".6" stroke="#075A39" strokeWidth="1.1">
        <path d="m4.75 7.295.277.439c.425.67.637 1.006.91 1.124a.96.96 0 0 0 .746.006c.275-.113.492-.446.927-1.11L9.25 5.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="7" r="5.5" />
      </g>
    </svg>
  );
}

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle cx="7" cy="7" r="5.75" stroke="#9FA1A7" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M7.066 3.904v2.115a.885.885 0 0 1-.884.885H4.566" stroke="#9FA1A7" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FailedCardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <g opacity=".6" stroke="#772322" strokeWidth="1.1">
        <circle cx="7" cy="7" r="5.5" />
        <path d="M9 5 5 9M9 9 5 5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function ProgressCardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M1.5 7A5.5 5.5 0 1 0 7 1.5" stroke="#9FA1A7" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CanceledStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <circle cx="9" cy="9" r="8" fill="#F5A300" />
      <rect x="5.8" y="5.8" width="6.4" height="6.4" rx="2" fill="white" />
    </svg>
  );
}

function SuccessStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm3.152-9.636a.6.6 0 1 0-1.004-.657L9.181 9.71c-.252.384-.418.636-.558.813-.14.176-.2.205-.212.21a.48.48 0 0 1-.374-.003c-.012-.005-.072-.035-.209-.213a12.33 12.33 0 0 1-.544-.822l-.377-.595a.6.6 0 1 0-1.014.642l.377.595.015.024c.226.357.417.66.592.887.178.232.39.457.685.584.416.18.888.183 1.307.01.296-.122.512-.344.694-.573.178-.225.374-.524.606-.878l.015-.023 1.968-3.005Z" fill="#0FC27B" />
    </svg>
  );
}

function ProgressStatusIcon({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={cn("animate-spin", className)} width="18" height="18" viewBox="0 0 18 18" fill="none" {...rest}>
      <rect x=".5" y=".5" width="17" height="17" rx="8.5" fill="#F4F5F6" />
      <rect x=".5" y=".5" width="17" height="17" rx="8.5" stroke="#E6E7EA" />
      <path d="M5 9a4 4 0 1 0 4-4" stroke="#75777C" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PausedStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <rect x=".5" y=".5" width="17" height="17" rx="8.5" fill="#F4F5F6" />
      <rect x=".5" y=".5" width="17" height="17" rx="8.5" stroke="#E6E7EA" />
      <rect x="6.5" y="6.2" width="1.6" height="5.6" rx=".8" fill="#75777C" />
      <rect x="9.9" y="6.2" width="1.6" height="5.6" rx=".8" fill="#75777C" />
    </svg>
  );
}

function ErrorStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm2.924-10.076a.6.6 0 1 0-.848-.848L9 8.15 6.924 6.076a.6.6 0 1 0-.848.848L8.15 9l-2.075 2.076a.6.6 0 0 0 .848.848L9 9.85l2.076 2.075a.6.6 0 0 0 .848-.848L9.85 9l2.075-2.076Z" fill="#FF5B59" />
    </svg>
  );
}

function RerunStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <rect x=".5" y=".5" width="17" height="17" rx="8.5" fill="#F4F5F6" />
      <rect x=".5" y=".5" width="17" height="17" rx="8.5" stroke="#E6E7EA" />
      <path transform="translate(2 2)" d="M12.5 1.00044C12.7762 1.00044 13 1.2243 13 1.50044V4.00044C12.9999 4.82878 12.3284 5.50044 11.5 5.50044H9.00005C8.72402 5.50039 8.50016 5.27646 8.50005 5.00044C8.50005 4.72433 8.72395 4.50049 9.00005 4.50044H11.3301C10.7989 3.58026 9.98803 2.85364 9.01567 2.42525C8.04325 1.99686 6.95954 1.88854 5.92192 2.11763C4.88439 2.34673 3.9468 2.90076 3.24517 3.69868C2.54356 4.49666 2.11404 5.49776 2.01958 6.55611C1.92521 7.61439 2.17057 8.67587 2.71978 9.5854C3.26899 10.4947 4.09389 11.2055 5.07427 11.6147C6.05489 12.0239 7.14099 12.1102 8.17388 11.8608C9.20666 11.6114 10.1336 11.0395 10.8194 10.228C10.9976 10.0171 11.3126 9.99034 11.5235 10.1684C11.7343 10.3467 11.7613 10.6626 11.5831 10.8735C10.76 11.8473 9.64768 12.5332 8.40825 12.8325C7.16879 13.1317 5.86624 13.0286 4.6895 12.5376C3.51277 12.0465 2.52245 11.1935 1.86333 10.102C1.20433 9.01058 0.910234 7.73714 1.02349 6.46724C1.13683 5.19723 1.65227 3.99609 2.49419 3.03853C3.33611 2.08103 4.4611 1.41602 5.7061 1.14107C6.95122 0.866172 8.2521 0.995201 9.41899 1.50923C10.4723 1.97327 11.3668 2.72997 12 3.68501V1.50044C12 1.22433 12.224 1.00049 12.5 1.00044Z" fill="#75777C" />
    </svg>
  );
}

function SmallSettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <g stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="m1.16 8.248.836.13a1.216 1.216 0 0 1 1.011 1.298l-.061.862a.616.616 0 0 0 .337.597l.618.304a.59.59 0 0 0 .667-.102l.62-.587a1.176 1.176 0 0 1 1.623 0l.62.587a.589.589 0 0 0 .667.102l.62-.305a.613.613 0 0 0 .336-.595l-.062-.863a1.216 1.216 0 0 1 1.011-1.298l.835-.13a.605.605 0 0 0 .495-.47l.152-.683a.619.619 0 0 0-.246-.643l-.697-.488a1.24 1.24 0 0 1-.36-1.617l.42-.75a.625.625 0 0 0-.05-.688l-.428-.548a.592.592 0 0 0-.644-.204l-.808.253a1.189 1.189 0 0 1-1.462-.72L6.9.888A.6.6 0 0 0 6.341.5l-.684.002a.6.6 0 0 0-.558.39l-.301.794a1.188 1.188 0 0 1-1.465.725l-.841-.264a.592.592 0 0 0-.647.205l-.424.549a.625.625 0 0 0-.047.69l.43.751A1.24 1.24 0 0 1 1.45 5.97l-.688.483a.62.62 0 0 0-.246.642l.152.683c.055.246.25.433.494.47Z" />
        <path d="M7.198 4.803a1.693 1.693 0 1 1-2.394 2.394 1.693 1.693 0 0 1 2.394-2.394Z" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function AutomationsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }}
      exit={{ opacity: 0, transition: { delay: 0.25, duration: 0.5, ease: [0.32, 0, 0.67, 0] } }}
      className="relative z-10 border-[#EEEFF1] border-b-[0.5px] bg-white-100 lg:border-b"
    >
      <div className={cn("flex h-[24px] items-center justify-between", "pr-[6px] pl-[5px]", "lg:h-[48px] lg:pr-[12px] lg:pl-[10px]")}>
        <div className="flex h-full items-center gap-[2px] lg:gap-[4px]">
          <HeaderTab icon={<EditorIcon className="size-[7px] shrink-0 lg:size-[14px]" />} label="Editor" />
          <HeaderTab icon={<RunsIcon className="size-[7px] shrink-0 lg:size-[14px]" />} label="Runs" badge="13" isActive />
          <HeaderTab icon={<SettingsIcon className="size-[7px] shrink-0 lg:size-[14px]" />} label="Settings" />
        </div>
        <div className="flex items-center gap-[4px] lg:gap-[8px]">
          <div
            className={cn(
              "flex h-[14px] items-center justify-center bg-white-100",
              "gap-[4px] rounded-[4px] border-[#EEEFF1] border-[0.5px] pr-[4px] pl-[3px]",
              "lg:h-[28px] lg:gap-[8px] lg:rounded-[8px] lg:border lg:pr-[8px] lg:pl-[6px]",
            )}
          >
            <div className="relative h-[8px] w-[12px] rounded-full border-[0.5px] border-[rgba(0,0,0,0.1)] bg-[#00D17E] lg:h-[16px] lg:w-[24px] lg:border">
              <div className="absolute top-1/2 right-[0.5px] size-[6px] -translate-y-1/2 rounded-full bg-white-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)] lg:right-px lg:size-[12px]" />
            </div>
            <TextBody className="text-[#02AD6E]">{"Live"}</TextBody>
          </div>
          <div
            className={cn(
              "flex h-[14px] items-center justify-center overflow-clip bg-white-100",
              "gap-[2px] rounded-[4px] border border-[rgba(255,255,255,0)] px-[3.5px]",
              "shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)]",
              "lg:h-[28px] lg:gap-[4px] lg:rounded-[8px] lg:px-[7px]",
            )}
          >
            <PlayIcon className="size-[7px] shrink-0 lg:size-[14px]" />
            <TextBody className="text-[#242629]">{"Trigger manually"}</TextBody>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeaderTab({ icon, label, badge, isActive }: { icon: ReactNode; label: string; badge?: string; isActive?: boolean }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <div
        className={cn(
          "flex items-center rounded-[4px] lg:rounded-[8px]",
          "h-[14px] gap-[1px] px-[3.5px] lg:h-[28px] lg:gap-[2px] lg:px-[7px]",
          { "border-[#E6E7EA] border-[0.5px] bg-[rgba(0,0,0,0.03)] lg:border": isActive },
        )}
      >
        {icon}
        <TextBody className={isActive ? "text-[#242629]" : "text-[#75777C]"}>{label}</TextBody>
        {badge != null && <Badge>{badge}</Badge>}
      </div>
      <div className={cn("absolute right-0 bottom-0 left-0 h-px", { "bg-[#242629]": isActive })} />
    </div>
  );
}

function DotGrid({ className }: { className?: string }) {
  return (
    <div className={cn("bg-[#BABBBC]", className)}>
      <div
        className="h-full w-full bg-[#FBFBFB] [--dot:0.5px] [mask-position:2.5px_2.5px] [mask-size:5px_5px] lg:[--dot:1px] lg:[mask-position:5px_5px] lg:[mask-size:10px_10px]"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) var(--dot), rgba(0,0,0,1) var(--dot)), linear-gradient(to bottom, rgba(0,0,0,0) var(--dot), rgba(0,0,0,1) var(--dot))",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Workflow canvas                                                     */
/* ------------------------------------------------------------------ */

type NodeCardProps = {
  className?: string;
  isActive?: boolean;
  onComplete?: () => void;
  isTrigger?: boolean;
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  width: number;
  height: number;
  radius: number;
};

function NodeCard({ className, isActive, onComplete, isTrigger, icon, iconClassName, title, description, width, height, radius }: NodeCardProps) {
  const complete = useEvent(() => onComplete?.());
  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(complete, 2e3);
    return () => clearTimeout(t);
  }, [isActive, complete]);
  return (
    <div className={cn("relative", className)} style={{ height, width }}>
      {isTrigger && <TriggerTag className="absolute bottom-[calc(100%+3px)] left-0 lg:bottom-[calc(100%+6px)]" />}
      {isActive && (
        <>
          <RunningTag progressDuration={2} />
          <CompletedTag progressDuration={2} />
        </>
      )}
      <NodeOutline isActive={isActive} width={width} height={height} radius={radius} duration={2} />
      <div className="absolute inset-0 flex flex-col justify-center px-[7px] lg:px-[13px]">
        <div className="flex items-center gap-[4px] lg:gap-[8px]">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center",
              "size-3 rounded-[3.5px] border-[0.5px]",
              "lg:size-6 lg:rounded-[7px] lg:border",
              iconClassName,
            )}
          >
            {icon}
          </span>
          <TextBody className="truncate text-[#242629]">{title}</TextBody>
        </div>
        <TextCaption color="text-[rgba(0,0,0,0.55)]" className="mt-[1px] truncate lg:mt-[2px]">
          {description}
        </TextCaption>
      </div>
    </div>
  );
}

function TriggerTag({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center border-[#D6E5FF] bg-[#E5EEFF]",
        "gap-x-[2px] rounded-[5px] border-[0.5px] py-[1px] pr-[4px] pl-[3px]",
        "lg:gap-x-[3px] lg:rounded-[10px] lg:border lg:py-[3px] lg:pr-[8px] lg:pl-[6px]",
        className,
      )}
    >
      <TriggerPlayIcon className="size-1.5 text-[#266DF0] lg:size-3" />
      <TextCaption color="text-[#266DF0]">{"Trigger"}</TextCaption>
    </div>
  );
}

function RunningTag({ progressDuration }: { progressDuration: number }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    animate([
      [
        scope.current,
        { opacity: 1, y: 0 },
        {
          opacity: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
          y: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
        },
      ],
      [
        scope.current,
        { opacity: 0, scale: 0.8, y: 30 },
        {
          at: progressDuration - 1,
          opacity: { delay: 0.3, duration: 0.3, ease: [0.32, 0, 0.67, 0] },
          scale: { duration: 0.5, ease: [0.32, 0, 0.67, 0] },
          y: { duration: 1, ease: [0.64, -0.37, 0.1, 0.6] },
        },
      ],
    ]);
  }, [scope, animate, progressDuration]);
  return (
    <motion.div ref={scope} className="absolute right-0 bottom-[calc(100%+3px)] flex lg:bottom-[calc(100%+6px)]" initial={{ opacity: 0, y: 40 }}>
      <span className={cn(TAG_BASE, "border-[#E8DDFE] bg-[#F5F0FF] gap-x-[2.5px] rounded-[3px] pr-[3px] lg:gap-x-[5px] lg:rounded-md lg:pr-1.5")}>
        <RunningSpinner className="size-1.5 lg:size-3" />
        <TextCaption color="text-[#9162F9]">{"Running"}</TextCaption>
      </span>
    </motion.div>
  );
}

function CompletedTag({ progressDuration }: { progressDuration: number }) {
  return (
    <motion.div
      className="absolute right-0 bottom-[calc(100%+3px)] flex lg:bottom-[calc(100%+6px)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        transition: {
          opacity: { delay: progressDuration - 0.7, duration: 0.5, ease: [0.33, 1, 0.68, 1] },
          y: { delay: progressDuration - 0.7, duration: 0.5, ease: [0.33, 1, 0.68, 1] },
        },
        y: 0,
      }}
    >
      <span className={cn(TAG_BASE, "border-[#CBF7E1] bg-[#E0FCED] gap-x-[2.5px] rounded-[3px] pr-[3px] lg:gap-x-[5px] lg:rounded-md lg:pr-1.5")}>
        <CheckIcon className="size-1.5 text-[#007D53] lg:size-3" />
        <TextCaption color="text-[#007D53]">{"Completed"}</TextCaption>
      </span>
    </motion.div>
  );
}

function NodeOutline({ isActive, width, height, radius, duration }: { isActive?: boolean; width: number; height: number; radius: number; duration: number }) {
  const e = width;
  const t = height;
  const a = radius;
  const d = `M ${e - 0.5} ${t / 2} L ${e - 0.5} ${t - a} A ${a} ${a} 0 0 1 ${e - a} ${t - 0.5} L ${a} ${t - 0.5} A ${a} ${a} 0 0 1 0.5 ${t - a} L 0.5 ${a} A ${a} ${a} 0 0 1 ${a} 0.5 L ${e - a} 0.5 A ${a} ${a} 0 0 1 ${e - 0.5} ${a} L ${e - 0.5} ${t / 2}`;
  return (
    <>
      <div className="absolute inset-0 rounded-[7px] bg-white-100 shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)] lg:rounded-[14px]" />
      {isActive && (
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <g className="[stroke-width:0.5px] lg:[stroke-width:1px]">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1.01 }}
              transition={{ duration, ease: [0.45, 0, 0.55, 1] }}
              d={d}
              fill="none"
              stroke="#54D490"
            />
          </g>
        </svg>
      )}
    </>
  );
}

type ConnectorProps = {
  isActive?: boolean;
  onComplete?: () => void;
  isMobile: boolean;
  width: number;
  className?: string;
  style?: CSSProperties;
};

function BranchConnector({ isActive, onComplete, isMobile, width: n, dy: i, className, style }: ConnectorProps & { dy: number }) {
  const d = 2 * i;
  const c = 0.5 * n;
  const x = isMobile ? 8 : 16;
  const u = isMobile ? 3 : 6;
  const p = isMobile ? 2.5 : 5;
  const h = `M 0 ${i} L ${c - x} ${i} A ${x} ${x} 0 0 0 ${c} ${i - x} L ${c} ${x} A ${x} ${x} 0 0 1 ${c + x} 0 L ${n} 0`;
  const g = `M 0 ${i} L ${c - x} ${i} A ${x} ${x} 0 0 1 ${c} ${i + x} L ${c} ${d - x} A ${x} ${x} 0 0 0 ${c + x} ${d} L ${n} ${d}`;
  return (
    <svg className={className} style={{ ...style, height: d, width: n }} viewBox={`0 0 ${n} ${d}`} fill="none" overflow="visible">
      <g className="[stroke-width:0.5px] lg:[stroke-width:1px]">
        <path d={h} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={g} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${n - p} ${-p} L ${n} 0`} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${n - p} ${p} L ${n} 0`} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${n - p} ${d - p} L ${n} ${d}`} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${n - p} ${d + p} L ${n} ${d}`} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        {isActive && (
          <>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: [0.5, 1, 0.89, 1] }}
              d={h}
              stroke="#54D490"
              strokeLinecap="round"
              strokeLinejoin="round"
              onAnimationComplete={onComplete}
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.9, duration: 0.3, ease: "easeOut" }}
              d={`M ${n - p} ${-p} L ${n} 0`}
              stroke="#54D490"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.9, duration: 0.3, ease: "easeOut" }}
              d={`M ${n - p} ${p} L ${n} 0`}
              stroke="#54D490"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        <circle cx={0} cy={i} r={u} fill="white" className="stroke-[#D1D3D6] transition-[stroke] duration-300" style={isActive ? { stroke: "#02AD6E" } : undefined} />
        <circle cx={0} cy={i} r={u / 2} className="fill-[#D1D3D6] transition-[fill] duration-300" style={isActive ? { fill: "#02AD6E" } : undefined} />
      </g>
    </svg>
  );
}

function StraightConnector({ isActive, onComplete, isMobile, width: n, height: i, className, style }: ConnectorProps & { height: number }) {
  const d = i / 2;
  const c = isMobile ? 3 : 6;
  const x = isMobile ? 2.5 : 5;
  const u = `M 0 ${d} L ${n} ${d}`;
  return (
    <svg className={className} style={{ ...style, height: i, width: n }} viewBox={`0 0 ${n} ${i}`} fill="none" overflow="visible">
      <g className="[stroke-width:0.5px] lg:[stroke-width:1px]">
        <path d={u} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${n - x} ${d - x} L ${n} ${d}`} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${n - x} ${d + x} L ${n} ${d}`} stroke="#D1D3D6" strokeLinecap="round" strokeLinejoin="round" />
        {isActive && (
          <>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: [0.5, 1, 0.89, 1] }}
              d={u}
              stroke="#54D490"
              strokeLinecap="round"
              strokeLinejoin="round"
              onAnimationComplete={onComplete}
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
              d={`M ${n - x} ${d - x} L ${n} ${d}`}
              stroke="#54D490"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
              d={`M ${n - x} ${d + x} L ${n} ${d}`}
              stroke="#54D490"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        <circle cx={0} cy={d} r={c} fill="white" className="stroke-[#D1D3D6] transition-[stroke] duration-300" style={isActive ? { stroke: "#02AD6E" } : undefined} />
        <circle cx={0} cy={d} r={c / 2} className="fill-[#D1D3D6] transition-[fill] duration-300" style={isActive ? { fill: "#02AD6E" } : undefined} />
      </g>
    </svg>
  );
}

const TARGET_ICON_CLASS = "border-[#D0EFF7] bg-[#DDF7FF] text-[#056C87]";
const NODE_ICON = "size-[7px] lg:size-3.5";

function WorkflowCanvas({ className, onComplete }: { className?: string; onComplete?: () => void }) {
  const isMobile = useMaxWidth("991.98px");
  const [measureRef, { width: measured }] = useMeasure<HTMLDivElement>();
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStep(1), 1e3);
    return () => clearTimeout(t);
  }, []);
  const { CARD_W, CARD_H, RADIUS, GAP, BRANCH_GAP, BRANCH_DY, PAD, TOP_PAD, CONN_H } = isMobile
    ? { BRANCH_DY: 38, BRANCH_GAP: 50, CARD_H: 33, CARD_W: 132, CONN_H: 6, GAP: 30, PAD: 16, RADIUS: 7, TOP_PAD: 12 }
    : { BRANCH_DY: 76, BRANCH_GAP: 100, CARD_H: 66, CARD_W: 264, CONN_H: 12, GAP: 60, PAD: 32, RADIUS: 14, TOP_PAD: 24 };
  const x2 = PAD + CARD_W + GAP;
  const x3 = x2 + CARD_W + GAP;
  const x4 = x3 + CARD_W + BRANCH_GAP;
  const midY = TOP_PAD + BRANCH_DY + CARD_H / 2;
  const rowY = TOP_PAD + BRANCH_DY;
  const totalW = x4 + CARD_W + PAD;
  const focusX =
    step < 1.5 ? PAD + CARD_W / 2 : step < 2.5 ? x2 + CARD_W / 2 : step < 3.5 ? x3 + CARD_W / 2 : x4 + CARD_W / 2;
  const offsetX = measured > 0 ? measured / 2 - focusX : 0;
  const size = { height: CARD_H, radius: RADIUS, width: CARD_W };
  return (
    <div ref={measureRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      <motion.div
        className="absolute top-1/2 left-0"
        style={{ height: 2 * midY, width: totalW }}
        initial={{ x: offsetX, y: "-50%" }}
        animate={{ x: offsetX, y: "-50%" }}
        transition={{ x: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }}
      >
        <StraightConnector
          className="absolute z-10"
          style={{ left: PAD + CARD_W, top: midY - CONN_H / 2 }}
          isMobile={isMobile}
          width={GAP}
          height={CONN_H}
          isActive={step > 1}
          onComplete={() => setStep(2)}
        />
        <StraightConnector
          className="absolute z-10"
          style={{ left: x2 + CARD_W, top: midY - CONN_H / 2 }}
          isMobile={isMobile}
          width={GAP}
          height={CONN_H}
          isActive={step > 2}
          onComplete={() => setStep(3)}
        />
        <BranchConnector
          className="absolute z-10"
          style={{ left: x3 + CARD_W, top: midY - BRANCH_DY }}
          isMobile={isMobile}
          width={BRANCH_GAP}
          dy={BRANCH_DY}
          isActive={step > 3}
          onComplete={() => setStep(4)}
        />
        <Positioned left={PAD} top={rowY}>
          <NodeCard
            {...size}
            isActive={step >= 1}
            onComplete={() => setStep(1.5)}
            isTrigger
            icon={<NewRecordIcon className={NODE_ICON} />}
            iconClassName="border-[#D6E5FF] bg-[#E5EEFF] text-[#215BC4]"
            title="When a new deal is created"
            description="Trigger when a new deal record is created"
          />
        </Positioned>
        <Positioned left={x2} top={rowY}>
          <NodeCard
            {...size}
            isActive={step >= 2}
            onComplete={() => setStep(2.5)}
            icon={<WebAgentIcon className={NODE_ICON} />}
            iconClassName="border-[#FFE59E] bg-[#FFF3CC] text-[#874D00]"
            title="Web Agent"
            description="Enrich the record with web research"
          />
        </Positioned>
        <Positioned left={x3} top={rowY}>
          <NodeCard
            {...size}
            isActive={step >= 3}
            onComplete={() => setStep(3.5)}
            icon={<AgentIcon className={NODE_ICON} />}
            iconClassName="border-[#FDDDEA] bg-[#FEECF3] text-[#B81C5D]"
            title="Custom Agent"
            description="Score the lead and route to the right AE"
          />
        </Positioned>
        <Positioned left={x4} top={TOP_PAD}>
          <NodeCard
            {...size}
            isActive={step >= 4}
            onComplete={onComplete}
            icon={<AddListIcon className={NODE_ICON} />}
            iconClassName={TARGET_ICON_CLASS}
            title="Add to Enterprise target list"
            description="Route lead to Enterprise and draft outreach"
          />
        </Positioned>
        <Positioned left={x4} top={TOP_PAD + 2 * BRANCH_DY}>
          <NodeCard
            {...size}
            isActive={false}
            icon={<AddListIcon className={NODE_ICON} />}
            iconClassName={TARGET_ICON_CLASS}
            title="Add to SMB target list"
            description="Route lead to SMB and draft outreach"
          />
        </Positioned>
      </motion.div>
    </div>
  );
}

function Positioned({ left, top, children }: { left: number; top: number; children: ReactNode }) {
  return (
    <div className="absolute" style={{ left, top }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Run pill                                                            */
/* ------------------------------------------------------------------ */

function RunPill({ className, isComplete }: { className?: string; isComplete: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center border-[#EEEFF1] bg-[rgba(255,255,255,0.55)]",
        "gap-[3px] rounded-[6px] border-[0.5px] py-[3px] pr-[3px] pl-[6px] backdrop-blur-[10px]",
        "lg:gap-[6px] lg:rounded-[12px] lg:border lg:py-[6px] lg:pr-[6px] lg:pl-[12px] lg:backdrop-blur-[20px]",
        className,
      )}
    >
      <TextBody className="text-[#505155]">{"Run #7"}</TextBody>
      <PillButton>
        <AttemptCheckIcon
          className={cn(
            "size-[7px] shrink-0 transition-colors duration-500 ease-out lg:size-[14px]",
            isComplete ? "text-[#02AD6E]" : "text-[#C9CBCF]",
          )}
        />
        <TextBody className="text-[rgba(0,0,0,0.55)]">{"Attempt #12"}</TextBody>
        <ChevronDownIcon className="size-[7px] shrink-0 lg:size-[14px]" />
      </PillButton>
      <div className="h-[8px] w-px bg-[rgba(0,0,0,0.05)] lg:h-[16px]" />
      <PillButton>
        <RerunIcon className="size-[7px] shrink-0 text-[rgba(0,0,0,0.55)] lg:size-[14px]" />
        <TextBody className="text-[rgba(0,0,0,0.55)]">{"Re-run"}</TextBody>
      </PillButton>
    </div>
  );
}

function PillButton({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "h-[14px] min-w-[14px] gap-[2px] rounded-[4px] px-[3.5px]",
        "lg:h-[28px] lg:min-w-[28px] lg:gap-[4px] lg:rounded-[8px] lg:px-[7px]",
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Run history panel                                                   */
/* ------------------------------------------------------------------ */

type RunStatus = "canceled" | "error" | "paused" | "rerun" | "success" | "progress";
type Run = { name: string; status: RunStatus; triggered: string };

const STATUS_ICON = "size-[9px] shrink-0 lg:size-[18px]";
const CARD_ICON = "size-[7px] lg:size-[14px]";

const ICON_SWAP = {
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.7, transition: { duration: 0.15, ease: "easeIn" as const } },
  initial: { opacity: 0, scale: 0.7 },
};

const LABEL_SWAP = {
  animate: { opacity: 1, transition: { delay: 0.1, duration: 0.5, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" as const } },
  initial: { opacity: 0 },
};

const PAST_RUNS: Run[] = [
  { name: "Run #13", status: "paused", triggered: "yesterday" },
  { name: "Run #12", status: "success", triggered: "4 days ago" },
  { name: "Run #11", status: "rerun", triggered: "4 days ago" },
];

type StatCard = {
  colorBackground?: string;
  colorBorder?: string;
  colorTitle?: string;
  colorValue?: string;
  icon: ReactNode;
  title: string;
  value: number;
  valueLabel?: string;
};

function RunHistory({ className, isComplete }: { className?: string; isComplete: boolean }) {
  const cards: StatCard[] = [
    {
      colorBackground: "bg-[linear-gradient(263deg,rgba(15,194,123,0.08)_6.86%,rgba(15,194,123,0.02)_96.69%)]",
      colorBorder: "border-[#E7F6EF]",
      colorTitle: "text-[#76A08E]",
      colorValue: "text-[#095A39]",
      icon: <CompletedCardIcon className={CARD_ICON} />,
      title: "Completed",
      value: isComplete ? 150 : 149,
    },
    {
      colorBackground: "bg-[linear-gradient(263deg,rgba(255,109,107,0.08)_6.86%,rgba(255,109,107,0.02)_96.69%)]",
      colorBorder: "border-[#FEE7E7]",
      colorTitle: "text-[#B08383]",
      colorValue: "text-[#772322]",
      icon: <FailedCardIcon className={CARD_ICON} />,
      title: "Failed",
      value: 2,
    },
    { icon: <ProgressCardIcon className={CARD_ICON} />, title: "In progress", value: +!isComplete },
    { icon: <ClockIcon className={CARD_ICON} />, title: "Avg. run time", value: 2, valueLabel: "seconds" },
  ];
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[10px] bg-white-100 lg:rounded-[14px]",
        "shadow-[0px_0px_0px_1px_rgba(11,13,24,0.08),0px_1px_2px_0px_rgba(11,13,24,0.04)]",
        className,
      )}
    >
      <div className="flex h-6 shrink-0 items-center px-2.5 lg:h-12 lg:px-5">
        <span className="font-semibold text-[#242629] text-[8px] leading-[10px] tracking-[-0.08px] lg:text-[16px] lg:leading-5 lg:tracking-[-0.16px]">
          {"Run history"}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-1.5 lg:px-3">
        <RunRow
          isActive
          run={{ name: "Run #14", status: isComplete ? "success" : "progress", triggered: isComplete ? "just now" : "Running" }}
        />
        {PAST_RUNS.map((r) => (
          <RunRow key={r.name} run={r} />
        ))}
      </div>
      <div className="flex shrink-0 flex-col gap-1 rounded-b-[10px] border-[#EEEFF1] border-t bg-[rgba(255,255,255,0.55)] p-2 backdrop-blur-[10px] lg:gap-2 lg:rounded-b-[14px] lg:p-4 lg:backdrop-blur-[20px]">
        <TextCaption color="text-[#75777C]" className="px-0.5 lg:px-1">
          {"Overview"}
        </TextCaption>
        <div className="grid grid-cols-2 gap-1 lg:gap-2">
          {cards.map((c) => (
            <StatCardView key={c.title} card={c} />
          ))}
          <CreditsCard className="col-span-2" credits={isComplete ? 8 : 7} />
        </div>
      </div>
    </div>
  );
}

function RunRow({ run, isActive }: { run: Run; isActive?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[18px] shrink-0 items-center gap-1 rounded-[5px] px-1 lg:h-9 lg:gap-2 lg:rounded-[10px] lg:px-2",
        { "bg-[rgba(0,0,0,0.03)]": isActive },
      )}
    >
      <RunStatusIcon status={run.status} isActive={isActive} />
      <TextBody className={cn("flex-1", isActive ? "text-[#242629]" : "text-[#505155]")}>{run.name}</TextBody>
      <RunTriggered isActive={isActive} status={run.status}>
        {run.triggered}
      </RunTriggered>
    </div>
  );
}

function RunStatusIcon({ status, isActive }: { status: RunStatus; isActive?: boolean }) {
  return isActive ? (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={status} className="flex shrink-0" {...ICON_SWAP}>
        {statusIcon(status)}
      </motion.div>
    </AnimatePresence>
  ) : (
    statusIcon(status)
  );
}

function statusIcon(status: RunStatus) {
  switch (status) {
    case "canceled":
      return <CanceledStatusIcon className={STATUS_ICON} />;
    case "error":
      return <ErrorStatusIcon className={STATUS_ICON} />;
    case "paused":
      return <PausedStatusIcon className={STATUS_ICON} />;
    case "rerun":
      return <RerunStatusIcon className={STATUS_ICON} />;
    case "success":
      return <SuccessStatusIcon className={STATUS_ICON} />;
    default:
      return <ProgressStatusIcon className={STATUS_ICON} />;
  }
}

function RunTriggered({ status, isActive, children }: { status: RunStatus; isActive?: boolean; children: string }) {
  const label = (
    <TextCaption
      className="whitespace-nowrap"
      color={status === "canceled" ? "text-[#CF8300]" : status === "error" ? "text-[#ED3B3B]" : "text-[#75777C]"}
    >
      {children}
    </TextCaption>
  );
  return isActive ? (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={children} className="flex shrink-0" {...LABEL_SWAP}>
        {label}
      </motion.div>
    </AnimatePresence>
  ) : (
    label
  );
}

function StatCardView({ card }: { card: StatCard }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-1 rounded-md border bg-white-100 py-1 pr-1 pl-1.5 lg:rounded-xl lg:py-2 lg:pr-2 lg:pl-3",
        card.colorBorder ?? "border-[#EEEFF1]",
        card.colorBackground,
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-end gap-0.5 lg:gap-1">
          <span className={cn("font-display font-semibold", card.colorValue ?? "text-[#242629]")}>
            <RollingNumber value={card.value} fontSize={14} lineHeight={20} />
          </span>
          {card.valueLabel && (
            <SmallText color="text-[#75777C]" className="mb-px">
              {card.valueLabel}
            </SmallText>
          )}
        </div>
        <SmallText color={card.colorTitle ?? "text-[#75777C]"}>{card.title}</SmallText>
      </div>
      <div className="flex shrink-0 self-start opacity-60">{card.icon}</div>
    </div>
  );
}

function CreditsCard({ className, credits }: { className?: string; credits: number }) {
  return (
    <div className={cn("flex flex-col gap-0.5 rounded-md border border-[#EEEFF1] p-[5px] lg:gap-1 lg:rounded-xl lg:p-2.5", className)}>
      <div className="flex items-center gap-1.5 lg:gap-3">
        <div className="flex flex-1 items-center gap-0.5 px-0.5 lg:gap-1 lg:px-1">
          <span className="font-display font-semibold text-[#242629]">
            <RollingNumber value={credits} fontSize={14} lineHeight={20} />
          </span>
          <SmallText color="text-[#75777C]">{"credits consumed"}</SmallText>
        </div>
        <div className="flex size-2.5 shrink-0 items-center justify-center rounded-[3px] bg-white-100 shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)] lg:size-5 lg:rounded-md">
          <SmallSettingsIcon className="size-1.5 lg:size-3" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-0.5 lg:gap-1 lg:p-1">
        <div className="flex gap-0.5 lg:gap-1">
          <SmallText color="text-[#505155]">{credits}</SmallText>
          <SmallText color="text-[#75777C]">{"/ 37,000"}</SmallText>
        </div>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-[#EEEFF1] lg:h-1">
          <div
            className="h-full w-full rounded-full bg-[#CDCED2] transition-transform duration-1000 ease-out"
            style={{ transform: `translateX(-${100 - credits}%)` }}
          />
        </div>
      </div>
    </div>
  );
}

function RollingNumber({ value, fontSize, lineHeight }: { value: number; fontSize: number; lineHeight: number }) {
  return (
    <div style={{ fontSize, height: lineHeight }} className="flex overflow-hidden">
      {value
        .toString()
        .split("")
        .map((ch, i) => (
          <RollingDigit key={i} value={parseInt(ch, 10)} height={lineHeight} />
        ))}
    </div>
  );
}

function RollingDigit({ value, height }: { value: number; height: number }) {
  return (
    <div
      className="relative flex w-[1ch] flex-col tabular-nums transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]"
      style={{ transform: `translateY(-${value * height}px)` }}
    >
      {Array.from({ length: 10 }, (_, r) => (
        <span key={r} className="block shrink-0 text-center" style={{ height, lineHeight: `${height}px` }}>
          {r}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab root                                                            */
/* ------------------------------------------------------------------ */

export function AutomationsDemo() {
  const [isComplete, setComplete] = useState(false);
  const onComplete = useCallback(() => setComplete(true), []);
  return (
    <div className="relative flex h-full w-full flex-col">
      <AutomationsHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] } }}
      >
        <DotGrid className="absolute inset-0" />
      </motion.div>
      <div className="isolate grid min-h-0 w-full flex-1 lg:grid-cols-[1fr_336px]">
        <div className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.7, ease: [0.33, 1, 0.68, 1] } }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] } }}
          >
            <WorkflowCanvas onComplete={onComplete} />
          </motion.div>
          <motion.div
            className="absolute top-2 left-2 z-10 lg:top-4 lg:left-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.7, ease: [0.33, 1, 0.68, 1] } }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] } }}
          >
            <RunPill isComplete={isComplete} />
          </motion.div>
        </div>
        <motion.div
          className="relative hidden h-full p-2 lg:block lg:p-3"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.7, ease: [0.33, 1, 0.68, 1] }, x: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] }, x: 40 }}
        >
          <RunHistory isComplete={isComplete} />
        </motion.div>
      </div>
    </div>
  );
}
