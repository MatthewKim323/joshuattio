import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { OneQuestionEveryAccount } from "@/components/pages/platform/web-agent/00-one-question-every-account";
import { Block } from "@/components/pages/platform/web-agent/01-block";
import { Logos } from "@/components/pages/platform/web-agent/02-logos";
import { Block3 } from "@/components/pages/platform/web-agent/03-block-3";
import { ContextForYourNext } from "@/components/pages/platform/web-agent/04-context-for-your-next";
import { Block5 } from "@/components/pages/platform/web-agent/05-block-5";
import { YouCanAlwaysCheck } from "@/components/pages/platform/web-agent/06-you-can-always-check";
import { Block7 } from "@/components/pages/platform/web-agent/07-block-7";
import { TheOnlyLimitIs } from "@/components/pages/platform/web-agent/08-the-only-limit-is";
import { Block9 } from "@/components/pages/platform/web-agent/09-block-9";
import { EveryAccountSameStandard } from "@/components/pages/platform/web-agent/10-every-account-same-standard";
import { AskMoreFromCrm } from "@/components/pages/platform/web-agent/11-ask-more-from-crm";

export const metadata: Metadata = {
  title: "Web Agent | Joshuattio",
  description: "The answers that matter aren't in any database. Web Agent researches the web for every record in your CRM and writes them back as data your team can act on.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "one-question-every-account": OneQuestionEveryAccount,
  "block": Block,
  "logos": Logos,
  "block-3": Block3,
  "context-for-your-next": ContextForYourNext,
  "block-5": Block5,
  "you-can-always-check": YouCanAlwaysCheck,
  "block-7": Block7,
  "the-only-limit-is": TheOnlyLimitIs,
  "block-9": Block9,
  "every-account-same-standard": EveryAccountSameStandard,
  "ask-more-from-crm": AskMoreFromCrm,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/web-agent">) {
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
