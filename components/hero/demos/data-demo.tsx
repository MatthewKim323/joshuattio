"use client";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/components/hero/cn";
import { EASE_UI, EASE_UI_EXIT } from "@/components/hero/ease";
import { Badge, Control, Tag, TextBody } from "@/components/hero/demos/data-primitives";

type IconProps = { className?: string; style?: CSSProperties };

function ChevronDown({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="m4 5.5 3 3 3-3" stroke="#232529" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.2v7m0 0L4.5 5.75M7 8.2l2.5-2.45M1.5 9v.703a2.5 2.5 0 0 0 2.5 2.5h6a2.5 2.5 0 0 0 2.5-2.5V9"
        stroke="#5C5E63"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#5C5E63">
      <g strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2.16 9.248.836.13a1.216 1.216 0 0 1 1.011 1.298l-.061.862a.616.616 0 0 0 .337.597l.618.304a.59.59 0 0 0 .667-.102l.62-.587a1.176 1.176 0 0 1 1.623 0l.62.587a.589.589 0 0 0 .667.102l.62-.305a.613.613 0 0 0 .336-.595l-.062-.863a1.216 1.216 0 0 1 1.011-1.298l.835-.13a.605.605 0 0 0 .495-.47l.152-.683a.619.619 0 0 0-.246-.643l-.697-.488a1.24 1.24 0 0 1-.36-1.617l.42-.75a.625.625 0 0 0-.05-.688l-.428-.548a.592.592 0 0 0-.645-.204l-.807.253a1.189 1.189 0 0 1-1.462-.72l-.31-.802a.6.6 0 0 0-.559-.388l-.684.002a.6.6 0 0 0-.558.39l-.301.794a1.188 1.188 0 0 1-1.465.725l-.841-.264a.592.592 0 0 0-.647.205l-.424.549a.625.625 0 0 0-.047.69l.43.751A1.24 1.24 0 0 1 2.45 6.97l-.688.483a.62.62 0 0 0-.246.642l.152.683c.055.246.25.433.494.47Z" />
        <path d="M8.197 5.803a1.693 1.693 0 1 1-2.394 2.394 1.693 1.693 0 0 1 2.394-2.394Z" />
      </g>
    </svg>
  );
}

function GridIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect width="14" height="14" rx="3.5" fill="#0FC27B" />
      <rect x="2.854" y="2.854" width="3.392" height="3.392" rx="1.106" fill="#fff" />
      <rect x="2.854" y="7.754" width="3.392" height="3.392" rx="1.106" fill="#fff" />
      <rect x="7.754" y="2.854" width="3.392" height="3.392" rx="1.106" fill="#fff" />
      <rect x="7.754" y="7.754" width="3.392" height="3.392" rx="1.106" fill="#fff" />
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
      <div className={cn("flex items-center justify-between", "px-1.5 pt-[5px] pb-[4.5px]", "lg:px-3 lg:pt-2.5 lg:pb-[9px]")}>
        <Control className={cn("flex items-center", "py-0.5 pr-[3px] pl-1", "lg:py-1 lg:pr-1.5 lg:pl-2")}>
          <GridIcon className="size-[7px] lg:size-[14px]" />
          <TextBody className="ml-[3px] lg:ml-1.5">{"Top companies"}</TextBody>
          <ChevronDown className="size-[7px] lg:size-[14px]" />
        </Control>
        <div className="flex items-center gap-x-1 lg:gap-x-2">
          <Control className={cn("flex items-center", "gap-[3px] py-0.5 pr-1 pl-[3px]", "lg:gap-1.5 lg:py-1 lg:pr-2 lg:pl-1.5")}>
            <GearIcon className="size-[7px] lg:size-[14px]" />
            <TextBody>{"View settings"}</TextBody>
          </Control>
          <Control className={cn("flex items-center", "py-0.5 pr-[3px] pl-1", "lg:py-1 lg:pr-1.5 lg:pl-2")}>
            <DownloadIcon className="size-[7px] lg:size-[14px]" />
            <TextBody className="mx-[3px] lg:mx-1.5">{"Import / Export"}</TextBody>
            <ChevronDown className="size-[7px] lg:size-[14px]" />
          </Control>
        </div>
      </div>
    </motion.div>
  );
}

function DotsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7.438 3.5a.438.438 0 1 1-.876 0 .438.438 0 0 1 .875 0ZM7.437 7a.438.438 0 1 1-.875 0 .438.438 0 0 1 .875 0ZM7.437 10.5a.438.438 0 1 1-.875 0 .438.438 0 0 1 .875 0Z"
        fill="#232529"
        stroke="#232529"
        strokeWidth=".7"
      />
    </svg>
  );
}

function SortIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1.247 10.978h2.746M1.247 6.889h4.806M1.247 2.8h10.298M10.344 5.185V12m0 0L7.94 9.615M10.344 12l2.403-2.385"
        stroke="#75777C"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddDashedIcon({ className }: IconProps) {
  return (
    <svg className={className} width="29" height="29" viewBox="0 0 29 29" fill="none">
      <rect x="1" y="1" width="27" height="27" rx="8" fill="#FBFBFB" />
      <rect x="1" y="1" width="27" height="27" rx="8" stroke="#E6E7EA" strokeLinecap="round" strokeDasharray="4 4" strokeDashoffset="1" />
      <path d="M14.5 11V18" stroke="#75777C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 14.5H11" stroke="#75777C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterBar() {
  return (
    <motion.div
      className={cn(
        "flex items-center border-[#EEEFF1]",
        "h-[24.5px] shrink-0 gap-x-[3.5px] border-b-[0.5px] px-1.5",
        "lg:h-[49px] lg:gap-x-[7px] lg:border-b lg:px-3",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE_UI } }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_UI_EXIT } }}
    >
      <div
        className={cn(
          "flex items-center rounded-sm border-[#E6E7EA] bg-[#FBFBFB]",
          "h-[14px] gap-x-[3px] border-[0.5px] pr-[4.5px] pl-[2.5px]",
          "lg:h-7 lg:gap-x-1.5 lg:rounded-lg lg:border lg:pr-[9px] lg:pl-[5px]",
        )}
      >
        <SortIcon className="size-[7px] lg:size-[14px]" />
        <TextBody>
          <span className="text-[#75777C]">{"Sorted by"}</span>
          {" Last email interaction"}
        </TextBody>
      </div>
      <div className={cn("rounded-full bg-[#EEEFF1]", "h-[11.5px] w-[0.5px]", "lg:h-[21px] lg:w-px")} />
      <div
        className={cn(
          "flex items-center border-[#E6E7EA] bg-[#FBFBFB]",
          "h-[14px] rounded-sm border-[0.5px] pr-[2.5px] pl-[3px]",
          "lg:h-7 lg:rounded-lg lg:border lg:pr-[5px] lg:pl-1.5",
        )}
      >
        <div className="flex items-center gap-x-[3.5px] lg:gap-x-[7px]">
          <TextBody>{"Advanced filter"}</TextBody>
          <Badge>{"3"}</Badge>
        </div>
        <div className={cn("h-full bg-[#E6E7EA]", "mr-0.5 ml-[3px] w-[0.5px]", "lg:mr-1 lg:ml-1.5 lg:w-px")} />
        <DotsIcon className="size-[7px] lg:size-[14px]" />
      </div>
      <AddDashedIcon className="size-[14.5px] lg:size-[29px]" />
    </motion.div>
  );
}

function Logo({ className, src, size = "md", noBorder = false }: { className?: string; src: string; size?: "sm" | "md"; noBorder?: boolean }) {
  return (
    <div
      className={cn(
        "relative",
        {
          "size-1.5 rounded-xs lg:size-3 lg:rounded-sm": size === "sm",
          "size-2 rounded-[2.5px] lg:size-4 lg:rounded-[5px]": size === "md",
        },
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        loading="lazy"
        width={32}
        height={32}
        decoding="async"
        className="h-full w-full rounded-[inherit] object-cover"
        src={src}
        style={{ color: "transparent" }}
      />
      {!noBorder && (
        <div
          className={cn("absolute inset-0 rounded-[inherit] border-[#232529]/10", {
            "border-[0.25px] lg:border-[0.5px]": size === "sm",
            "border-[0.375px] lg:border-[0.75px]": size === "md",
          })}
        />
      )}
    </div>
  );
}

function CheckboxIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x=".5" y=".5" width="15" height="15" rx="5.5" fill="#fff" stroke="#E6E7EA" />
    </svg>
  );
}

type Company = { logo: string; name: string };

function CompanyCell({ company }: { company: Company }) {
  return (
    <>
      <CheckboxIcon className="size-2 lg:size-4" />
      <Logo className="ml-0.5 lg:ml-1" src={company.logo} />
      <TextBody className="truncate">
        <span className="relative">
          {company.name}
          <div
            className={cn(
              "absolute rounded-sm bg-[#EEEFF1]",
              "right-[-0.5px] bottom-[-1px] left-[-0.5px] h-[0.5px]",
              "lg:-right-[1px] lg:bottom-[-2px] lg:-left-[1px] lg:h-px",
            )}
          />
        </span>
      </TextBody>
    </>
  );
}

const ARR = ["$10-$50M", "$50M-$100M", "$100M-$250M", "$150M-$250M", "$250M-$500M", "$500M-$1B", "$1B-$10B"] as const;
const ICP_FIT = ["Low", "Medium", "Good", "Excellent"] as const;
const CONNECTION = ["Weak", "Good", "Strong", "Very strong"] as const;

type Row = { arr: number; company: Company; connection: number; deals: string[]; domain: string; icpFit: number };

const ROWS: Row[] = [
  { arr: 2, company: { logo: "/img/img-32cdf84825.avif", name: "Vercel" }, connection: 3, deals: ["Vercel", "Vercel - Expansion"], domain: "vercel.com", icpFit: 3 },
  { arr: 5, company: { logo: "/img/img-f3c087f326.avif", name: "Cursor" }, connection: 2, deals: ["Cursor"], domain: "cursor.com", icpFit: 3 },
  { arr: 6, company: { logo: "/img/img-ca1c159b71.avif", name: "GitHub" }, connection: 3, deals: ["GitHub - x20 Enterprise"], domain: "github.com", icpFit: 0 },
  { arr: 6, company: { logo: "/img/img-232e22eeb4.avif", name: "Stripe" }, connection: 3, deals: ["Stripe"], domain: "stripe.com", icpFit: 0 },
  { arr: 5, company: { logo: "/img/img-f87c66d2f0.avif", name: "Figma" }, connection: 3, deals: ["Figma"], domain: "figma.com", icpFit: 2 },
  { arr: 4, company: { logo: "/img/img-249715b867.avif", name: "Intercom" }, connection: 3, deals: ["Intercom", "Intercom - Automations"], domain: "intercom.com", icpFit: 1 },
  { arr: 3, company: { logo: "/img/img-9dc119ddb2.avif", name: "Elevenlabs" }, connection: 2, deals: ["Elevenlabs"], domain: "elevenlabs.io", icpFit: 3 },
  { arr: 4, company: { logo: "/img/img-dbfaadc645.avif", name: "Notion" }, connection: 2, deals: ["Notion - Exec", "Notion - GTM"], domain: "notion.so", icpFit: 2 },
  { arr: 6, company: { logo: "/img/img-4c128ebaea.avif", name: "Slack" }, connection: 0, deals: ["Slack", "Slack - Expansion"], domain: "slack.com", icpFit: 0 },
  { arr: 2, company: { logo: "/img/img-0b531814c4.avif", name: "Sierra" }, connection: 1, deals: ["Sierra"], domain: "sierra.ai", icpFit: 3 },
  { arr: 1, company: { logo: "/img/img-6d56feac88.avif", name: "Retool" }, connection: 1, deals: ["Retool"], domain: "retool.com", icpFit: 3 },
  { arr: 0, company: { logo: "/img/img-57452cb3d0.avif", name: "Customer.io" }, connection: 2, deals: ["Customer.io - x10 Plus"], domain: "customer.io", icpFit: 3 },
  { arr: 6, company: { logo: "/img/img-c75882a32b.avif", name: "Snowflake" }, connection: 2, deals: ["Snowflake", "Snowflake - Expansion"], domain: "snowflake.com", icpFit: 0 },
];

function DotIcon({ className, fill }: IconProps & { fill: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="4" width="8" height="8" rx="3" fill={fill} />
    </svg>
  );
}

function BoltIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="m4.5 8.5 4.243-5v4H11.5l-4.546 5v-4H4.5Z" fill="#0FC27B" stroke="#0FC27B" strokeWidth="1.226" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConnectionCell({ connection }: { connection: number }) {
  return (
    <>
      {connection === 3 && <BoltIcon className="size-[7px] lg:size-3.5" />}
      {connection === 2 && <DotIcon className="size-[7px] lg:size-3.5" fill="#0FC27B" />}
      {connection === 1 && <DotIcon className="size-[7px] lg:size-3.5" fill="#06A0C6" />}
      {connection === 0 && <DotIcon className="size-[7px] lg:size-3.5" fill="#FD9038" />}
      <TextBody className="flex-1 truncate">{CONNECTION[connection]}</TextBody>
    </>
  );
}

function DealIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect width="12" height="12" rx="4.25" fill="#E7E7E7" />
      <rect x=".4" y=".4" width="11.2" height="11.2" rx="3.85" stroke="#000" strokeOpacity=".04" strokeWidth=".8" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.968 3.69a.952.952 0 0 0-.468.828l.017 3.02c.002.341.185.655.478.822l2.56 1.462a.93.93 0 0 0 .933-.005l2.544-1.493a.952.952 0 0 0 .468-.827l-.017-3.02a.951.951 0 0 0-.478-.822l-2.56-1.462a.93.93 0 0 0-.933.005L2.968 3.691Zm3.186-.744.015 2.612c.001.224.12.431.312.544l2.24 1.315a.25.25 0 0 0 .377-.22l-.016-2.612a.634.634 0 0 0-.311-.544L6.53 2.726a.25.25 0 0 0-.376.22Z"
        fill="#969696"
      />
    </svg>
  );
}

function DealsCell({ deals }: { deals: string[] }) {
  return (
    <>
      {deals.map((d) => (
        <Tag key={d} className="gap-x-0.5 pl-[1.5px] lg:gap-x-1 lg:pl-[3px]">
          <DealIcon className="size-1.5 lg:size-3" />
          <span>{d}</span>
        </Tag>
      ))}
    </>
  );
}

function DomainCell({ domain }: { domain: string }) {
  return <Tag className="border-[#B8D0FF] text-[#407FF2]">{domain}</Tag>;
}

function Thinking({
  children,
  delayIndex = 0,
  thinkingTimeBase = 1.5,
  className,
  style,
}: {
  children: ReactNode;
  delayIndex?: number;
  thinkingTimeBase?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const delay = thinkingTimeBase + (delayIndex % 5) * 0.24;
  return (
    <div className={cn("absolute inset-0", className)} style={style}>
      <motion.div
        className={cn("absolute inset-0", "gap-x-[3px] pr-[3.5px] pl-1", "lg:gap-x-1.5 lg:pr-[7px] lg:pl-2")}
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 0, transition: { delay, duration: 0.16 }, x: 4 }}
      >
        <TextBody className="flex size-full items-center">
          <motion.span
            className="bg-clip-text text-transparent"
            style={{
              backgroundAttachment: "fixed",
              backgroundImage: "linear-gradient(131.88deg, #DC8FA5 0%, #70A1F0 50%, #DC8FA5 100%)",
              backgroundPosition: "200% 0%",
              backgroundSize: "300%",
              WebkitBackgroundClip: "text",
            }}
            animate={{ backgroundPosition: "-200% 0%", transition: { duration: 4 } }}
          >
            {"AI is thinking..."}
          </motion.span>
        </TextBody>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay, duration: 0.2 } }}
        className="absolute inset-0 bg-[#FAF9FF]"
      />
      <motion.div
        className={cn("relative flex size-full items-center", "gap-x-[3px] pr-[3.5px] pl-1", "lg:gap-x-1.5 lg:pr-[7px] lg:pl-2")}
        initial={{ opacity: 0, x: 4 }}
        animate={{ opacity: 1, transition: { delay, duration: 0.24 }, x: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Cell({ className, col, row, isLast, children }: { className?: string; col: number; row: number; isLast?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn("overflow-hidden border-[#EEEFF1] border-b-[0.5px] bg-white-100 lg:border-b", {
        "border-r-[0.5px] lg:border-r": !isLast,
      })}
    >
      <motion.div
        className={cn("flex h-full w-full items-center", "gap-x-[3px] pr-[3.5px] pl-1", "lg:gap-x-1.5 lg:pr-[7px] lg:pl-2", className)}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, transition: { delay: 0.2 + 0.035 * row + 0.05 * col, duration: 0.2 }, y: 0 }}
        exit={{ opacity: 0, transition: { delay: 0.012 * row + 0.02 * col, duration: 0.16 }, y: 4 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function GlobeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <g stroke="#5C5E63" strokeWidth="1.1" strokeLinejoin="round">
        <circle cx="7" cy="7" r="5.75" />
        <path d="M7 1.25a8.132 8.132 0 0 0 0 11.5M7 1.25a8.132 8.132 0 0 1 0 11.5M1.692 7h10.616" />
      </g>
    </svg>
  );
}

function ArrIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <g stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round">
        <path d="M9.796 2.27a5.775 5.775 0 1 0 0 9.45" />
        <path d="M11.55 10.32v-6.3m0 0L9.8 5.77m1.75-1.75 1.75 1.75" strokeLinejoin="round" />
        <path d="M6.475 3.495v1M6.475 9.495v1M4.76 9.495h2.502c.348 0 .682-.132.928-.366a1.22 1.22 0 0 0 .385-.884c0-.332-.138-.65-.385-.884a1.347 1.347 0 0 0-.928-.366H5.687c-.348 0-.682-.132-.928-.366a1.22 1.22 0 0 1-.384-.884c0-.332.138-.65.384-.884.246-.235.58-.366.928-.366h2.468" />
      </g>
    </svg>
  );
}

function ZapIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="m2.608 6.998 4.757-5.233a.4.4 0 0 1 .696.27v3.898c0 .221.18.4.4.4h2.591a.4.4 0 0 1 .287.68l-5.146 5.282a.4.4 0 0 1-.687-.279v-3.95a.4.4 0 0 0-.4-.4H2.904a.4.4 0 0 1-.296-.668Z"
        stroke="#5C5E63"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandshakeIcon({ className, style }: IconProps) {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className={className} style={style}>
      <path
        fill="#5C5E63"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.6095 2.64904C2.32085 1.91523 3.28903 1.5 4.30195 1.5C4.88183 1.5 5.40527 1.58553 5.91537 1.8147C6.2941 1.98487 6.64777 2.22628 7.00195 2.54345C7.35613 2.22628 7.70981 1.98487 8.08854 1.8147C8.59863 1.58553 9.12207 1.5 9.70195 1.5C10.7149 1.5 11.6831 1.91523 12.3944 2.64904C13.1053 3.38233 13.502 4.37365 13.502 5.40417C13.502 7.04133 12.454 8.2535 11.5592 9.15817L8.42162 12.3948C7.63939 13.2017 6.36452 13.2017 5.58229 12.3948L2.44587 9.15938C1.54151 8.25719 0.501953 7.0463 0.501953 5.40417C0.501953 4.37365 0.898653 3.38233 1.6095 2.64904ZM6.29155 3.2501C6.01319 3.00667 5.7579 2.84025 5.50554 2.72687C5.15463 2.56921 4.77807 2.5 4.30195 2.5C3.56445 2.5 2.85389 2.80208 2.3275 3.34508C1.80061 3.88861 1.50195 4.62901 1.50195 5.40417C1.50195 6.60734 2.26007 7.56188 3.15501 8.4543L3.16101 8.46028L3.16096 8.46033L6.3003 11.6988C6.68964 12.1004 7.31426 12.1004 7.70361 11.6988L8.10402 11.2857L7.24061 10.3951C7.0484 10.1968 7.05332 9.88024 7.25159 9.68803C7.44986 9.49583 7.76641 9.50075 7.95861 9.69902L8.80039 10.5674L9.9048 9.4281L9.04139 8.53743C8.84918 8.33915 8.8541 8.02261 9.05237 7.8304C9.25065 7.6382 9.56719 7.64312 9.75939 7.84139L10.6012 8.70974L10.8429 8.46033L10.8465 8.45668L10.8465 8.4567C11.1362 8.16392 11.4121 7.86575 11.6528 7.55566L10.2006 6.2095L10.1989 6.20785C9.97871 6.00178 9.69501 5.88999 9.40355 5.88999C9.11251 5.88999 8.8292 6.00146 8.60919 6.20696L7.36832 7.38187L7.36407 7.38591L7.36404 7.38588C6.64522 8.05069 5.5495 8.02827 4.86626 7.32423C4.69856 7.15235 4.56625 6.9488 4.4762 6.72569C4.38606 6.50235 4.33984 6.26335 4.33984 6.02231C4.33984 5.78127 4.38606 5.54227 4.4762 5.31893C4.56623 5.09588 4.69849 4.89238 4.86613 4.72053C4.86635 4.72029 4.86659 4.72005 4.86682 4.71982L6.29155 3.2501ZM12.1958 6.69551C12.3877 6.29404 12.502 5.86731 12.502 5.40417C12.502 4.62901 12.2033 3.88861 11.6764 3.34508C11.15 2.80208 10.4395 2.5 9.70195 2.5C9.22583 2.5 8.84927 2.56921 8.49836 2.72687C8.14365 2.88624 7.78316 3.15037 7.36096 3.5859C7.35173 3.59542 7.34216 3.60453 7.33228 3.61323L5.58355 5.41716L5.58228 5.41846C5.50643 5.49614 5.44542 5.58938 5.40352 5.6932C5.36161 5.79705 5.33984 5.90894 5.33984 6.02231C5.33984 6.13567 5.36161 6.24757 5.40352 6.35141C5.44542 6.45524 5.50643 6.54848 5.58228 6.62616L5.58356 6.62746C5.88378 6.93716 6.35828 6.95218 6.68315 6.65349L7.92278 5.47975L7.92486 5.47778L7.92486 5.47778C8.32734 5.10105 8.85427 4.88999 9.40355 4.88999C9.95242 4.88999 10.479 5.10073 10.8813 5.47694C10.8816 5.47722 10.8819 5.4775 10.8822 5.47778L12.1958 6.69551Z"
      />
    </svg>
  );
}

function PlusSmallIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 3.5v7M10.5 7h-7" stroke="#9FA1A7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 6.5v7M13.5 10h-7" stroke="#5E5E5E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <g stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.999 4.159a5.748 5.748 0 0 1 5-2.909 5.748 5.748 0 0 1 5 2.909m-10 5.682a5.748 5.748 0 0 0 5 2.909 5.748 5.748 0 0 0 5-2.909M12.938 7h-4.69m0 0 2-2m-2 2 2 2M1.061 7h4.684m0 0-2-2m2 2-2 2" />
      </g>
    </svg>
  );
}

function SparkleIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.667 3.958c0 2.302-1.24 4.375-3.542 4.375 2.301 0 3.542 2.074 3.542 4.375 0-2.3 1.24-4.375 3.541-4.375-2.3 0-3.541-2.073-3.541-4.375ZM6.833 10.625c0 1.38-1.327 2.708-2.708 2.708 1.38 0 2.708 1.328 2.708 2.709 0-1.381 1.328-2.709 2.709-2.709-1.381 0-2.709-1.327-2.709-2.708Z"
        fill="#A37BFA"
      />
      <path
        d="M12.667 3.958c0 2.302-1.24 4.375-3.542 4.375 2.301 0 3.542 2.074 3.542 4.375 0-2.3 1.24-4.375 3.541-4.375-2.3 0-3.541-2.073-3.541-4.375ZM6.833 10.625c0 1.38-1.327 2.708-2.708 2.708 1.38 0 2.708 1.328 2.708 2.709 0-1.381 1.328-2.709 2.709-2.709-1.381 0-2.709-1.327-2.709-2.708Z"
        stroke="#A37BFA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AiTag() {
  return (
    <Tag style={{ backgroundImage: "linear-gradient(113.96deg, rgba(220, 143, 165, 0.08) -25%, rgba(112, 161, 240, 0.08) 125%)" }}>
      <span
        className="bg-center bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(113.96deg, #D06785 -45.59%, #4283EB 100%)", WebkitBackgroundClip: "text" }}
      >
        {"AI"}
      </span>
    </Tag>
  );
}

const GRID =
  "grid auto-rows-[20px] grid-cols-[100px_80px_minmax(100px,1fr)_80px_90px_100px] lg:auto-rows-[40px] lg:grid-cols-[204px_minmax(136px,1fr)_minmax(204px,1.5fr)_minmax(136px,1fr)_204px_204px]";

function icpClass(n: number) {
  return cn({
    "border-[#C7F4D3] bg-[#DDF9E4] text-[#075A39]": n === 2,
    "border-[#D6E5FF] bg-[#E5EEFF] text-[#183C81]": n === 1,
    "border-[#E8DDFE] bg-[#F5EEFF] text-[#4711BB]": n === 3,
    "border-[#FEE0C8] bg-[#FEEEE1] text-[#753501]": n === 0,
  });
}

function arrClass(r: number) {
  return cn({
    "border-[#C3EDF9] bg-[#DAF4FC] text-[#0A5A70]": r === 2 || r === 3,
    "border-[#C7F4D3] bg-[#DDF9E4] text-[#075A39]": r === 6,
    "border-[#D6E5FF] bg-[#E5EEFF] text-[#183C81]": r === 4,
    "border-[#E8DDFE] bg-[#F5EEFF] text-[#4711BB]": r === 5,
    "border-[#FEE0C8] bg-[#FEEEE1] text-[#753501]": r === 0,
    "border-[#FFEBAD] bg-[#FFF3CC] text-[#705500]": r === 1,
  });
}

function Table({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <motion.div
        className={cn("demo-data-table", GRID)}
        initial={{ "--demo-data-table-end": "0%", "--demo-data-table-start": "0%" }}
        animate={{ "--demo-data-table-end": "100%", transition: { delay: 0.2, duration: 1.3, ease: EASE_UI } }}
        exit={{ "--demo-data-table-start": "100%", transition: { duration: 0.6, ease: EASE_UI_EXIT } }}
      >
        <Cell className="justify-between pr-[4.5px] pl-2 lg:pr-[9px] lg:pl-4" row={0} col={0}>
          <div className="flex items-center gap-x-[5px] overflow-hidden bg-white-100 lg:gap-x-2.5">
            <CheckboxIcon className="size-2 lg:size-4" />
            <TextBody className="flex-1 truncate">{"Company"}</TextBody>
          </div>
          <PlusIcon className="size-2.5 lg:size-5" />
        </Cell>
        <Cell row={0} col={1}>
          <GlobeIcon className="size-[7px] lg:size-3.5" />
          <TextBody className="flex-1 truncate">{"Domains"}</TextBody>
        </Cell>
        <Cell row={0} col={2}>
          <LinkIcon className="size-[7px] lg:size-3.5" />
          <TextBody className="flex-1 truncate">{"Associated deals"}</TextBody>
        </Cell>
        <Cell row={0} col={3}>
          <HandshakeIcon className="size-[7px] lg:size-3.5" />
          <TextBody className="flex-1 truncate">{"ICP Fit"}</TextBody>
          <AiTag />
        </Cell>
        <Cell row={0} col={4}>
          <ArrIcon className="size-[7px] lg:size-3.5" />
          <TextBody className="flex-1 truncate">{"Estimated ARR"}</TextBody>
          <AiTag />
        </Cell>
        <Cell row={0} col={5} isLast className="*:shrink-0">
          <ZapIcon className="size-[7px] lg:size-3.5" />
          <TextBody className="min-w-1 flex-1 truncate">{"Connection strength"}</TextBody>
          <SparkleIcon className="size-2.5 lg:size-5" />
        </Cell>
        {ROWS.map(({ company, domain, deals, arr, icpFit, connection }, l) => (
          <Fragment key={l}>
            <Cell row={1 + l} col={0} className="pr-[3.5px] pl-2 lg:pr-[7px] lg:pl-4">
              <CompanyCell company={company} />
            </Cell>
            <Cell row={1 + l} col={1}>
              <DomainCell domain={domain} />
            </Cell>
            <Cell row={1 + l} col={2}>
              <DealsCell deals={deals} />
            </Cell>
            <Cell className="relative" row={1 + l} col={3}>
              <Thinking delayIndex={l} thinkingTimeBase={1.5}>
                <Tag className={icpClass(icpFit)}>{ICP_FIT[icpFit]}</Tag>
              </Thinking>
            </Cell>
            <Cell row={1 + l} col={4} className="relative">
              <Thinking delayIndex={l} thinkingTimeBase={2}>
                <Tag className={arrClass(arr)}>{ARR[arr]}</Tag>
              </Thinking>
            </Cell>
            <Cell className={cn("gap-x-[3px] pr-[3.5px] pl-1", "lg:gap-x-1.5 lg:pr-[7px] lg:pl-2")} isLast row={1 + l} col={5}>
              <ConnectionCell connection={connection} />
            </Cell>
          </Fragment>
        ))}
      </motion.div>
      <motion.div
        className={cn("absolute right-0 bottom-0 left-0", GRID, "auto-rows-[20.5px] lg:auto-rows-[41px]")}
        initial={{ y: "100%" }}
        animate={{ transition: { duration: 0.4, ease: EASE_UI }, y: 0 }}
        exit={{ transition: { delay: 0.12, duration: 0.32, ease: EASE_UI_EXIT }, y: "100%" }}
      >
        <div
          className={cn(
            "flex items-center justify-end overflow-hidden border-[#EEEFF1] bg-white-100",
            "gap-x-[3.5px] border-t-[0.5px] border-r-[0.5px] pr-1 pl-1",
            "lg:gap-x-[7px] lg:border-t lg:border-r lg:pr-2 lg:pl-2",
          )}
        >
          <TextBody>{"1,439"}</TextBody>
          <TextBody className="text-[#9FA1A7]">{"count"}</TextBody>
        </div>
        {Array.from({ length: 5 }).map((_, t) => (
          <div
            key={t}
            className={cn(
              "flex items-center justify-end overflow-hidden border-[#EEEFF1] bg-white-100",
              "gap-x-[3px] border-t-[0.5px] border-r-[0.5px] pr-[3.5px] pl-1 last:border-r-0",
              "lg:gap-x-1.5 lg:border-t lg:border-r lg:pr-[7px] lg:pl-2",
            )}
          >
            <PlusSmallIcon className="size-[7px] lg:size-3.5" />
            <TextBody className="text-nowrap text-[#9FA1A7]">{"Add calculation"}</TextBody>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function DataDemo() {
  return (
    <div className="flex h-full w-full flex-col">
      <Toolbar />
      <FilterBar />
      <Table className="flex-1" />
    </div>
  );
}
