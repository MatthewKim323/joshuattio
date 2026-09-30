"use client";
import { Fragment, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/components/hero/cn";
import { EASE_UI, EASE_UI_EXIT } from "@/components/hero/ease";
import { Control, Tag, TextBody, TextCaption, useMeasure, useMedia } from "@/components/hero/demos/data-primitives";

type IconProps = { className?: string };

function RefreshIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.525 4.699c.122 0 .225-.1.225-.228V1.749a.55.55 0 0 1 1.1 0V4.47c0 .731-.592 1.328-1.325 1.328H8.813a.55.55 0 0 1 0-1.1h2.712Z"
        fill="#5C5E63"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.93 2.3C4.349 2.3 2.25 4.401 2.25 7c0 2.597 2.098 4.7 4.68 4.7a4.676 4.676 0 0 0 4.097-2.426.55.55 0 0 1 .963.531A5.776 5.776 0 0 1 6.93 12.8c-3.194 0-5.78-2.598-5.78-5.8 0-3.201 2.586-5.8 5.78-5.8 2.18 0 4.076 1.21 5.06 2.994a.55.55 0 0 1-.963.532 4.676 4.676 0 0 0-4.096-2.426Z"
        fill="#5C5E63"
      />
    </svg>
  );
}

function AddReportIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 12.5H5.5c-1.4 0-2.1 0-2.635-.273a2.5 2.5 0 0 1-1.093-1.092C1.5 10.6 1.5 9.9 1.5 8.5v-3c0-1.4 0-2.1.272-2.635a2.5 2.5 0 0 1 1.093-1.093C3.4 1.5 4.1 1.5 5.5 1.5h3c1.4 0 2.1 0 2.635.272a2.5 2.5 0 0 1 1.092 1.093C12.5 3.4 12.5 4.1 12.5 5.5V7M4.46 5.309v4.23M7 4.46v5.078M9.54 7v1M12.5 10.75H9M10.75 9v3.5"
        stroke="#fff"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Toolbar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE_UI } }}
      exit={{ opacity: 0, transition: { delay: 0.25, duration: 0.5, ease: EASE_UI_EXIT } }}
      className="relative z-10 border-[#EEEFF1] border-b-[0.5px] bg-white-100 lg:border-b"
    >
      <div className={cn("flex items-center justify-end", "px-1.5 pt-[5px] pb-[4.5px]", "lg:px-3 lg:pt-2.5 lg:pb-[9px]")}>
        <div className="flex items-center gap-x-1 lg:gap-x-2">
          <Control className={cn("flex items-center", "gap-[3px] py-0.5 pr-[4.5px] pl-[3px]", "lg:gap-1.5 lg:py-1 lg:pr-[9px] lg:pl-1.5")}>
            <RefreshIcon className="size-[7px] lg:size-[14px]" />
            <TextBody>{"Refresh data"}</TextBody>
          </Control>
          <div
            className={cn(
              "flex items-center",
              "border-[#2666DC] bg-[#266DF0]",
              "rounded-sm border-[0.5px] py-[1.5px] pr-[3.5px] pl-[2.5px]",
              "lg:rounded-lg lg:border lg:py-[3px] lg:pr-[7px] lg:pl-[5px]",
              "shadow-[0px_1px_2px_-1px_rgba(15,107,233,0.12),0px_1.5px_3px_-1px_rgba(15,107,233,0.08)]",
              "lg:shadow-[0px_2px_4px_-2px_rgba(15,107,233,0.12),0px_3px_6px_-2px_rgba(15,107,233,0.08)]",
            )}
          >
            <AddReportIcon className="size-[7px] lg:size-[14px]" />
            <TextBody className="ml-1.5 text-white-100">{"Add report"}</TextBody>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReportCard({ label, type, typeIcon, children }: { label: string; type: string; typeIcon: ReactNode; children: ReactNode }) {
  return (
    <div className={cn("border-[#EEEFF1] bg-white-100", "rounded-md border-[0.5px]", "lg:rounded-xl lg:border")}>
      <div className={cn("flex items-center", "gap-x-[4px] px-[5.5px] pt-[4.5px]", "lg:gap-x-[8px] lg:px-[11px] lg:pt-[9px]")}>
        <TextBody>{label}</TextBody>
        <Tag className={cn("flex items-center", "gap-x-0.5 pl-[1.5px]", "lg:gap-x-1 lg:pl-[3px]")}>
          {typeIcon}
          <TextCaption className="text-[#5C5E63]">{type}</TextCaption>
        </Tag>
      </div>
      <div className="mt-[9px] flex w-full lg:mt-[18px]">{children}</div>
    </div>
  );
}

function Heading({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "font-semibold text-[#232529] text-[10px] leading-[12px] tracking-[-0.2px]",
        "lg:text-[20px] lg:leading-6 lg:tracking-[-0.4px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Title() {
  return (
    <div className="flex flex-col gap-[3px] lg:gap-1.5">
      <motion.div
        className="flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, transition: { duration: 1, ease: EASE_UI }, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_UI_EXIT } }}
      >
        <Heading>{"Business Metrics"}</Heading>
      </motion.div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.8, ease: EASE_UI }, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_UI_EXIT } }}
      >
        <TextBody className="text-[#5C5E63]">{"Overview of our sales pipeline, revenue growth, customer demographics, and more."}</TextBody>
      </motion.div>
    </div>
  );
}

function WorkspacesIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 4.8c0-1.68 0-2.52.327-3.162A3 3 0 0 1 1.638.327C2.28 0 3.12 0 4.8 0h2.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C12 2.28 12 3.12 12 4.8v2.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C9.72 12 8.88 12 7.2 12H4.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C0 9.72 0 8.88 0 7.2V4.8Zm2.494-1.371c0-.517.418-.935.935-.935h1.135c.516 0 .935.418.935.935v1.87a.935.935 0 0 1-.935.935H3.429a.935.935 0 0 1-.935-.935v-1.87Zm4.942 2.337a.935.935 0 0 0-.935.935v1.87c0 .517.419.935.935.935h1.135a.935.935 0 0 0 .936-.935v-1.87a.935.935 0 0 0-.936-.935H7.436ZM6.501 3.43c0-.517.419-.935.935-.935h1.135c.517 0 .936.418.936.935v.402a.935.935 0 0 1-.936.935H7.436a.935.935 0 0 1-.935-.935v-.402ZM3.429 7.234a.935.935 0 0 0-.935.935v.402c0 .517.418.936.935.936h1.135a.935.935 0 0 0 .935-.936V8.17a.935.935 0 0 0-.935-.935H3.429Z"
        fill="#9162F9"
      />
    </svg>
  );
}

function DealsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="13" height="12" viewBox="0 0 13 12" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.827 1.638C.5 2.28.5 3.12.5 4.8v2.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C2.78 12 3.62 12 5.3 12h2.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C12.5 9.72 12.5 8.88 12.5 7.2V4.8c0-1.68 0-2.52-.327-3.162A3 3 0 0 0 10.862.327C10.22 0 9.38 0 7.7 0H5.3C3.62 0 2.78 0 2.138.327A3 3 0 0 0 .827 1.638Zm2.442 5.1V5.262c0-1.034 0-1.551.201-1.946.177-.348.46-.63.807-.807.395-.201.912-.201 1.946-.201h.554c1.034 0 1.55 0 1.946.2.347.178.63.46.807.808.2.395.2.912.2 1.946v1.476c0 1.034 0 1.551-.2 1.946-.177.348-.46.63-.807.807-.395.201-.912.201-1.946.201h-.554c-1.034 0-1.55 0-1.946-.2a1.846 1.846 0 0 1-.807-.808c-.2-.395-.2-.912-.2-1.946Zm3.693-3.23a.462.462 0 0 0-.923 0v.067a1.17 1.17 0 0 0-.762.319 1.105 1.105 0 0 0-.346.8c0 .305.127.593.346.8.218.208.509.321.808.321h.83c.069 0 .13.026.172.066.04.04.06.087.06.132a.182.182 0 0 1-.06.132.249.249 0 0 1-.172.066h-1.32a.462.462 0 1 0 0 .923h.443V7.2a.462.462 0 1 0 .923 0v-.067a1.17 1.17 0 0 0 .762-.32c.219-.208.346-.495.346-.8 0-.305-.127-.592-.346-.8a1.172 1.172 0 0 0-.808-.32h-.83a.249.249 0 0 1-.172-.067.183.183 0 0 1-.06-.132c0-.045.02-.092.06-.132a.249.249 0 0 1 .172-.065h1.301a.462.462 0 0 0 0-.923h-.424v-.066ZM4.192 8.4c0-.255.207-.462.462-.462h3.692a.462.462 0 0 1 0 .923H4.654a.462.462 0 0 1-.462-.461Z"
        fill="#FD9038"
      />
    </svg>
  );
}

// stagger(0.08, { startDelay: 0.9 }) from index 0
const pieDelay = (i: number) => 0.9 + 0.08 * Math.abs(0 - i);

const round4 = (e: number) => Number(e.toFixed(4));
function polar(center: [number, number], r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [round4(center[0] + r * Math.cos(rad)), round4(center[1] + r * Math.sin(rad))];
}

function LegendItem({ label, color, isDashed }: { label: string; color: string; isDashed?: boolean }) {
  return (
    <div className="flex items-center gap-x-[3px] lg:gap-x-1.5">
      <svg className="size-[5px] overflow-visible lg:size-2.5" viewBox="0 0 10 10">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="4"
          fill={color}
          stroke={isDashed ? "#D1D3D6" : undefined}
          strokeDasharray="1.1 2.2"
          strokeLinecap="round"
        />
      </svg>
      <TextCaption className="text-[#5C5E63]">{label}</TextCaption>
    </div>
  );
}

function MoreIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="20" viewBox="0 0 21 20" fill="none">
      <rect x="3.25" y="3" width="6" height="6" rx="2" fill="#A27AFA" />
      <rect x="3.25" y="11" width="6" height="6" rx="2" fill="#266DF0" />
      <rect x="11.25" y="3" width="6" height="6" rx="2" fill="#14AED6" />
      <rect x="11.25" y="11" width="6" height="6" rx="2" fill="#D1D3D6" />
    </svg>
  );
}

function PieLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", "gap-x-2 pt-[3px]", "lg:gap-x-4 lg:pt-1.5", className)}>
      <LegendItem color="#F65385" label="ICP" />
      <LegendItem color="#266DF0" label="VC" />
      <LegendItem color="#14AED6" label="SP" />
      <LegendItem color="#DE98E6" label="TtS" />
      <div className="flex items-center gap-x-[0.5px] lg:gap-x-px">
        <MoreIcon className="h-2.5 w-[10.5px] lg:h-5 lg:w-[21px]" />
        <TextCaption className="text-[#75777C]">{"+3 more"}</TextCaption>
      </div>
    </div>
  );
}

const SLICES = [
  { color: "#F65385", value: 142 },
  { color: "#266DF0", value: 79.5 },
  { color: "#FFD03D", value: 23 },
  { color: "#FD9038", value: 16 },
  { color: "#DE98E6", value: 34 },
  { color: "#A27AFA", value: 20 },
  { color: "#14AED6", value: 38.5 },
];
function sliceStart(e: number) {
  return SLICES.slice(0, e).reduce((acc, { value }) => acc + value, 0) + (+e + 0.5);
}
function sliceEnd(e: number) {
  return sliceStart(e) + SLICES[e].value;
}

function slicePath(r: number) {
  const s: [number, number] = [140, 140];
  const l = sliceStart(r);
  const n = sliceEnd(r);
  const i = 89;
  const o = Math.abs(n - l);
  let d = 4;
  if ((d / (89 * Math.PI)) * 360 > Math.abs(l - n)) d = (o / 360) * i * Math.PI;
  const c = i + d;
  const x = 139 - d;
  const p = polar(s, x, l);
  const u = polar(s, x, n);
  const g = polar(s, c, l);
  const y = polar(s, c, n);
  const h = (d / (2 * Math.PI * i)) * 360;
  const M = (d / (2 * Math.PI * 139)) * 360;
  const m = polar(s, i, l + h);
  const w = polar(s, i, n - h);
  const _ = polar(s, 139, l + M);
  const j = polar(s, 139, n - M);
  return `M ${p[0]} ${p[1]} A ${d} ${d} 0 0 1 ${_[0]} ${_[1]} A 139 139 0 ${+(o > 180 + 2 * M)} 1 ${j[0]} ${j[1]} A ${d} ${d} 0 0 1 ${u[0]} ${u[1]} L ${y[0]} ${y[1]} A ${d} ${d} 0 0 1 ${w[0]} ${w[1]} A ${i} ${i} 0 ${+(o > 180 + 2 * h)} 0 ${m[0]} ${m[1]} A ${d} ${d} 0 0 1 ${g[0]} ${g[1]} Z`;
}

const BAR_STYLES: { background: string; stroke?: string }[] = [
  { background: "#FFEBAD", stroke: "#FFD03D" },
  { background: "#FFD03D" },
  { background: "#FDC4D5", stroke: "#FB84A7" },
  { background: "#FB84A7" },
  { background: "#D6C4FD", stroke: "#A27AFA" },
  { background: "#A27AFA" },
];

function BarGroup({ index, label, values }: { index: number; label: string; values: number[] }) {
  const [ref, { height, width }] = useMeasure<HTMLDivElement>();
  const small = useMedia("(max-width: 991.98px)");
  const c = small ? 0.25 : 0.5;
  const x = small ? 3 : 6;
  const p = (width - (small ? 1.5 : 3) * (values.length - 1)) / values.length;
  return (
    <div className="relative h-full w-full">
      <div ref={ref} className="relative flex h-full w-full items-end justify-between overflow-hidden">
        {!!height &&
          values.map((v, s) => {
            const l = height * v;
            const style = BAR_STYLES[s];
            return (
              <motion.div
                key={s}
                style={{ height: l, width: p + 2 * c }}
                initial={{ y: "100.5%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5 + 0.12 * index + 0.09 * s, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              >
                <svg className="h-full w-full">
                  <path
                    d={`M ${c} ${l - c} L ${c} ${c + x} A ${x} ${x} 0 0 1 ${c + x} ${c} L ${p - x} ${c} A ${x} ${x} 0 0 1 ${p} ${c + x} L ${p} ${l - c} Z`}
                    fill={style.background}
                    {...(style.stroke
                      ? {
                          stroke: style.stroke,
                          strokeDasharray: small ? "2 2" : "4 4",
                          strokeDashoffset: small ? 1.5 : 3,
                          strokeLinecap: "round" as const,
                          strokeWidth: small ? 0.5 : 1,
                        }
                      : {})}
                  />
                </svg>
              </motion.div>
            );
          })}
      </div>
      <TextCaption className={cn("absolute left-1/2 -translate-x-1/2 text-[#75777C]", "bottom-[-14.5px]", "lg:bottom-[-29px]")}>{label}</TextCaption>
    </div>
  );
}

function ChartGrid({ className, lines, children }: { className?: string; lines: string[]; children: ReactNode }) {
  return (
    <div className={cn("relative grid grid-cols-[auto_1fr]", "gap-x-[7.5px] gap-y-[9.5px]", "lg:gap-x-[15px] lg:gap-y-[19px]", className)}>
      {lines.map((e) => (
        <Fragment key={e}>
          <div className="flex justify-end py-0.5 lg:py-1">
            <TextCaption className="text-[#9FA1A7]">
              {"$ "}
              {e}
            </TextCaption>
          </div>
          <svg className={cn("h-[0.5px] w-full self-center overflow-visible lg:h-px", "relative top-[-0.25px] lg:top-0")}>
            <line
              className={cn(
                "[stroke-dasharray:2_2.5] [stroke-dashoffset:-0.5] [stroke-width:0.5px]",
                "lg:[stroke-dasharray:4_5] lg:[stroke-dashoffset:-1] lg:[stroke-width:1px]",
              )}
              x1="0"
              y1="0.5"
              x2="100%"
              y2="0.5"
              stroke="#E6E7EA"
              strokeLinecap="round"
            />
          </svg>
        </Fragment>
      ))}
      <div />
      <div className="h-[0.75px] w-full bg-[#EEEFF1] lg:h-[1.5px]" />
      <div
        className={cn(
          "absolute inset-0 col-start-2 col-end-3 row-start-1",
          "pt-[6px] pr-[5px] pb-[0.5px] pl-[5px]",
          "lg:pt-[12px] lg:pr-[10px] lg:pb-[1px] lg:pl-[10px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function BarLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", "gap-x-2 pt-1", "lg:gap-x-4 lg:pt-2", className)}>
      <LegendItem color="#F4F5F6" label="Apr - Jun" isDashed />
      <LegendItem color="#D1D3D6" label="Jul - Sep" />
      <LegendItem color="#FFD03D" label="Plus" />
      <LegendItem color="#FB84A7" label="Pro" />
      <LegendItem color="#A27AFA" label="Enterprise" />
    </div>
  );
}

function ArrowUpRight({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3.1715 8.82896L8.82835 3.1721M8.82835 3.1721L8.92937 7.31373M8.82835 3.1721L4.68673 3.07109" stroke="#075A39" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TooltipEntry({ month, value }: { month: string; value: string }) {
  return (
    <div className="flex w-full items-center gap-x-1 lg:gap-x-2">
      <div className="flex-[0_0_1.5px] self-stretch rounded-full bg-[#FB84A7] lg:flex-[0_0_3px]" />
      <div className="flex flex-col gap-y-[3px] py-0.5 pr-0.5 lg:gap-y-1.5 lg:py-1 lg:pr-1">
        <div className="flex items-center gap-x-[3px] lg:gap-x-1.5">
          <TextBody className="text-[#5C5E63]">{month}</TextBody>
        </div>
        <div className="flex items-center gap-x-[3px] lg:gap-x-1.5">
          <TextBody className="text-[#5C5E63]">{"Product"}</TextBody>
          <Tag className="border-[#EEEFF1] bg-[#F4F5F6] text-[#5C5E63]">{"Pro"}</Tag>
        </div>
        <div className="flex flex-wrap items-center gap-x-[3px] lg:gap-x-1.5">
          <TextBody className="text-[#5C5E63]">{"ARR Contribution"}</TextBody>
          <Tag className="border-[#EEEFF1] bg-[#F4F5F6] text-[#5C5E63]">{value}</Tag>
        </div>
      </div>
    </div>
  );
}

function Tooltip({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "flex min-w-[140px] origin-top-left flex-col gap-y-1 rounded-md border border-[#EEEFF1]",
        "bg-primary-background p-1 shadow-lg lg:min-w-[280px] lg:gap-y-2 lg:rounded-xl lg:p-2",
        className,
      )}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1, transition: { bounce: 0, delay: 1.6, duration: 0.36 } }}
      exit={{ opacity: 0, scale: 0.92 }}
    >
      <div className="flex items-center gap-1 lg:gap-2">
        <TextBody className="text-[#232529]">{"ARR Contribution"}</TextBody>
        <Tag className="border-[#C7F4D3] bg-[#DDF9E4] pl-[3px]! text-[#075A39]">
          <ArrowUpRight className="mr-px size-1.5 lg:mr-0.5 lg:size-3" />
          {"+63%"}
        </Tag>
      </div>
      <TooltipEntry month="Aug 2026" value="USD 2,493,651.04" />
      <svg width="100%" height="1">
        <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="#E6E7EA" strokeDasharray="3 5" strokeLinecap="round" />
      </svg>
      <TooltipEntry month="May 2026" value="USD 1,528,710.36" />
    </motion.div>
  );
}

const FUNNEL = [
  { label: "Leads", tag: "100%" },
  { label: "Qualification", tag: "87.6%" },
  { label: "Contacted", tag: "65.4%" },
  { label: "Negotiation", tag: "44.2%" },
  { label: "Won", tag: "12.1%" },
];

function DashedLineIcon({ className }: IconProps) {
  return (
    <svg className={className} width="15" height="2" viewBox="0 0 15 2" fill="none">
      <path d="M1.75 1h12" stroke="#94B9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3" />
    </svg>
  );
}

function SolidLineIcon({ className }: IconProps) {
  return (
    <svg className={className} width="15" height="2" viewBox="0 0 15 2" fill="none">
      <path d="M1.75 1h12" stroke="#266DF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RevenueReport() {
  return (
    <div className="flex w-full flex-col pb-[20px] lg:pb-[46px]">
      <BarLegend className="self-center" />
      <ChartGrid
        className={cn("w-full", "pt-[14px] pr-[9px] pl-[6.5px]", "lg:pt-[28px] lg:pr-[18px] lg:pl-[13px]")}
        lines={["2.8M", "2.4M", "2.0M", "1.6M", "1.2M", "0.8M", "0.4M"]}
      >
        <div className="relative grid h-full w-full grid-cols-3 gap-x-1.5 sm:gap-x-2.5 lg:gap-x-6">
          <BarGroup index={0} label="July" values={[0.142, 0.246, 0.419, 0.681, 0.187, 0.353]} />
          <BarGroup index={1} label="August" values={[0.152, 0.374, 0.512, 0.889, 0.277, 0.484]} />
          <BarGroup index={2} label="September" values={[0.208, 0.439, 0.599, 1, 0.36, 0.66]} />
          <Tooltip className="absolute top-4 left-[58%] z-1 lg:top-8" />
        </div>
      </ChartGrid>
    </div>
  );
}

function PieReport() {
  return (
    <div className="relative flex w-full flex-col items-center">
      <PieLegend />
      <motion.svg className="mt-5 size-[140px] overflow-visible lg:mt-10 lg:size-[280px]" viewBox="0 0 280 280">
        {SLICES.map(({ color }, r) => {
          const f = 90 - (sliceStart(r) + sliceEnd(r)) / 2;
          const v = round4(15 * Math.cos((Math.PI / 180) * f));
          const E = round4(-15 * Math.sin((Math.PI / 180) * f));
          return (
            <motion.path
              key={r}
              initial={{ opacity: 0, x: v, y: E }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: pieDelay(r), duration: 0.8, ease: EASE_UI }}
              d={slicePath(r)}
              fill={color}
            />
          );
        })}
      </motion.svg>
    </div>
  );
}

function PipelineReport() {
  return (
    <div className={cn("flex w-full justify-between", "h-[201px] pt-1 pr-5 pl-4", "lg:h-[402px] lg:pt-2 lg:pr-10 lg:pl-8")}>
      {FUNNEL.map(({ label, tag }, r) => (
        <div key={r} className="flex flex-col items-center gap-1 lg:gap-2">
          <TextCaption className="text-[#75777C]">{label}</TextCaption>
          <Tag className="border-[#EEEFF1] bg-[#F4F5F6] text-[#5C5E63]">{tag}</Tag>
        </div>
      ))}
    </div>
  );
}

function SignupsReport() {
  return (
    <div className="flex h-[402px] w-full items-start justify-center pt-1 lg:pt-2">
      <div className="flex items-center gap-x-2.5 lg:gap-x-5">
        <div className="flex items-center gap-x-0.5 lg:gap-x-1">
          <DashedLineIcon className="h-px w-[7px] lg:h-0.5 lg:w-[15px]" />
          <TextBody className="text-[#75777C]">{"MRR 2023"}</TextBody>
        </div>
        <div className="flex items-center gap-x-0.5 lg:gap-x-1">
          <SolidLineIcon className="h-px w-[7px] lg:h-0.5 lg:w-[15px]" />
          <TextBody className="text-[#75777C]">{"MRR 2024"}</TextBody>
        </div>
      </div>
    </div>
  );
}

const REPORTS: { label: string; report: ReactNode; type: string; typeIcon: ReactNode }[] = [
  {
    label: "Revenue growth by paid plan",
    report: <RevenueReport />,
    type: "Workspaces",
    typeIcon: <WorkspacesIcon className="size-1.5 lg:size-3" />,
  },
  {
    label: "Closed-won deals by MQL type",
    report: <PieReport />,
    type: "Deals",
    typeIcon: <DealsIcon className="h-1.5 w-[6.5px] lg:h-3 lg:w-[13px]" />,
  },
  {
    label: "Sales pipeline",
    report: <PipelineReport />,
    type: "Deals",
    typeIcon: <DealsIcon className="h-1.5 w-[6.5px] lg:h-3 lg:w-[13px]" />,
  },
  {
    label: "New signups by creation cohort",
    report: <SignupsReport />,
    type: "Workspaces",
    typeIcon: <WorkspacesIcon className="size-1.5 lg:size-3" />,
  },
];

export function ReportDemo() {
  return (
    <div>
      <Toolbar />
      <div className="px-2.5 pt-[11px] lg:px-5 lg:pt-[22px]">
        <Title />
        <motion.div
          className={cn(
            "grid grid-cols-[minmax(230px,1fr)_minmax(190px,1fr)] lg:grid-cols-[minmax(440px,1fr)_minmax(360px,1fr)]",
            "mt-2 gap-1.5",
            "lg:mt-4 lg:gap-3",
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.4, duration: 1, ease: EASE_UI, opacity: { delay: 0.4, duration: 0.5, ease: EASE_UI } },
            y: 0,
          }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_UI_EXIT } }}
        >
          {REPORTS.map(({ report, ...r }, s) => (
            <motion.div
              key={s}
              className="*:h-full *:w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (s % 2) * 0.2 + 0.1 * Math.floor(s / 2), duration: 0.5, ease: EASE_UI }}
            >
              <ReportCard {...r}>{report}</ReportCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
