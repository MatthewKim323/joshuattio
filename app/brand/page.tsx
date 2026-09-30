import type { Metadata } from "next";
import { BrandHeader } from "@/components/pages/brand/header";
import { SiteShell } from "@/components/shell/site-shell";
import { AboutJoshuattio } from "@/components/pages/brand/00-about-joshuattio";
import { Divider } from "@/components/pages/brand/01-divider";
import { Naming } from "@/components/pages/brand/02-naming";
import { Divider3 } from "@/components/pages/brand/03-divider-3";
import { Wordmark } from "@/components/pages/brand/04-wordmark";
import { Divider5 } from "@/components/pages/brand/05-divider-5";
import { Logo } from "@/components/pages/brand/06-logo";
import { Divider7 } from "@/components/pages/brand/07-divider-7";
import { LogoPack } from "@/components/pages/brand/08-logo-pack";
import { Divider9 } from "@/components/pages/brand/09-divider-9";
import { Photos } from "@/components/pages/brand/10-photos";
import { Divider11 } from "@/components/pages/brand/11-divider-11";
import { PressContact } from "@/components/pages/brand/12-press-contact";

export const metadata: Metadata = {
  title: "Brand guidelines and press kit | Joshuattio",
  description: "Guidelines and assets for referencing Joshuattio in press coverage and third-party materials.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "about-joshuattio": AboutJoshuattio,
  "divider": Divider,
  "naming": Naming,
  "divider-3": Divider3,
  "wordmark": Wordmark,
  "divider-5": Divider5,
  "logo": Logo,
  "divider-7": Divider7,
  "logo-pack": LogoPack,
  "divider-9": Divider9,
  "photos": Photos,
  "divider-11": Divider11,
  "press-contact": PressContact,
} as const;

export default async function Page({ searchParams }: PageProps<"/brand">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <SiteShell bare>
      <div className="flex max-w-screen flex-1 flex-col overflow-x-clip">
        <div className="container flex flex-1 flex-col">
          <BrandHeader />
          <svg width="100%" height="1" className="text-subtle-stroke relative left-1/2 w-screen -translate-x-1/2">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <main className="relative w-full border-subtle-stroke border-x">
            {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
          </main>
        </div>
      </div>
    </SiteShell>
  );
}
