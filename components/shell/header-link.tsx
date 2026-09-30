import type { MouseEventHandler, ReactNode } from "react";
import type { NavLink, NavSection } from "@/components/shell/nav-data";

const LINK_MD =
  "relative inline-flex cursor-pointer items-center text-nowrap border transition-colors ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default gap-x-2 rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group w-full justify-start duration-50 h-auto p-2";
const LINK_XS_HEAD =
  "relative inline-flex cursor-pointer items-center text-nowrap border transition-colors ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px]";
const LINK_XS_TAIL =
  "has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost group w-full justify-start duration-50 text-primary-foreground text-sm max-lg:h-11";

function ArrowRight12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-50 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50 group-focus-visible:translate-0 group-focus-visible:opacity-100 motion-reduce:translate-none motion-reduce:transition-none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
    </svg>
  );
}

/** One menu entry: a two-line link when it has a description, a compact row otherwise. */
export function HeaderLink({ link, compact, onClick }: { link: NavLink; compact?: boolean; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  if (link.description) {
    return (
      <a className={compact ? `${LINK_MD} px-1.75` : LINK_MD} href={link.href} onClick={onClick}>
        <div className="flex w-full min-w-0 flex-col">
          <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
            <span className="truncate text-sm">{link.label}</span>
            <ArrowRight12 />
          </div>
          <p className="truncate text-accent-foreground text-sm">{link.description}</p>
        </div>
      </a>
    );
  }
  return (
    <a className={`${LINK_XS_HEAD} ${compact ? "px-1.75" : "px-2.5"} ${LINK_XS_TAIL}`} href={link.href} onClick={onClick}>
      <span className="w-full min-w-0 truncate text-left">{link.label}</span>
      <ArrowRight12 />
    </a>
  );
}

/** Heading + link list per section. */
export function HeaderSections({ sections, headingClassName, renderLink }: { sections: NavSection[]; headingClassName: string; renderLink: (link: NavLink) => ReactNode }) {
  return sections.map((section) => (
    <SectionBlock key={section.heading} section={section} headingClassName={headingClassName} renderLink={renderLink} />
  ));
}

function SectionBlock({ section, headingClassName, renderLink }: { section: NavSection; headingClassName: string; renderLink: (link: NavLink) => ReactNode }) {
  return (
    <>
      {section.heading && <p className={headingClassName}>{section.heading}</p>}
      <ul className="flex flex-col gap-0.5">
        {section.links.map((link) => <li key={link.label}>{renderLink(link)}</li>)}
      </ul>
    </>
  );
}
