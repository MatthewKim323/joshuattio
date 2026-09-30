import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { StartupProgram } from "@/components/pages/startups/00-startup-program";
import { Block } from "@/components/pages/startups/01-block";
import { S80OffJoshuattioBenefits } from "@/components/pages/startups/02-80-off-joshuattio-benefits";
import { Block3 } from "@/components/pages/startups/03-block-3";
import { TheCrmThatGrows } from "@/components/pages/startups/04-the-crm-that-grows";
import { Block5 } from "@/components/pages/startups/05-block-5";
import { SomeOfOurStartup } from "@/components/pages/startups/06-some-of-our-startup";
import { Block7 } from "@/components/pages/startups/07-block-7";
import { TheToolsYouRe } from "@/components/pages/startups/08-the-tools-you-re";
import { Block9 } from "@/components/pages/startups/09-block-9";
import { FrequentlyAskedQuestions } from "@/components/pages/startups/10-frequently-asked-questions";

export const metadata: Metadata = {
  title: "Startup Program | Joshuattio",
  description: "Discover why ambitious startups love Joshuattio. The CRM for the next generation of builders. Get up to 80% off one year.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "startup-program": StartupProgram,
  "block": Block,
  "80-off-joshuattio-benefits": S80OffJoshuattioBenefits,
  "block-3": Block3,
  "the-crm-that-grows": TheCrmThatGrows,
  "block-5": Block5,
  "some-of-our-startup": SomeOfOurStartup,
  "block-7": Block7,
  "the-tools-you-re": TheToolsYouRe,
  "block-9": Block9,
  "frequently-asked-questions": FrequentlyAskedQuestions,
} as const;

export default async function Page({ searchParams }: PageProps<"/startups">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <SiteShell>
      <>
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      </>
    </SiteShell>
  );
}
