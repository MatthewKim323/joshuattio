import { SiteShell } from "@/components/shell/site-shell";
import { Hero } from "@/components/sections/01-hero";
import { Logos } from "@/components/sections/02-logos";
import { Pillars } from "@/components/sections/03-pillars";
import { Divider } from "@/components/sections/04-divider";
import { SelfBuilding } from "@/components/sections/05-self-building";
import { Divider6 } from "@/components/sections/06-divider-6";
import { UniversalContext } from "@/components/sections/07-universal-context";
import { Divider8 } from "@/components/sections/08-divider-8";
import { Scale } from "@/components/sections/09-scale";
import { Customers } from "@/components/sections/10-customers";
import { Spacer } from "@/components/sections/11-spacer";
import { Divider12 } from "@/components/sections/12-divider-12";
import { Changelog } from "@/components/sections/13-changelog";
import { Spacer14 } from "@/components/sections/14-spacer-14";
import { Cta } from "@/components/sections/15-cta";

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "hero": Hero,
  "logos": Logos,
  "pillars": Pillars,
  "divider": Divider,
  "self-building": SelfBuilding,
  "divider-6": Divider6,
  "universal-context": UniversalContext,
  "divider-8": Divider8,
  "scale": Scale,
  "customers": Customers,
  "spacer": Spacer,
  "divider-12": Divider12,
  "changelog": Changelog,
  "spacer-14": Spacer14,
  "cta": Cta,
} as const;

export default async function Home({ searchParams }: PageProps<"/">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? only as keyof typeof SECTIONS : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <SiteShell>
      {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
    </SiteShell>
  );
}
