import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { AskJoshuattio } from "@/components/pages/platform/ask/00-ask-joshuattio";
import { Block } from "@/components/pages/platform/ask/01-block";
import { SimplyPowerfulCustomerIntelligence } from "@/components/pages/platform/ask/02-simply-powerful-customer-intelligence";
import { Block3 } from "@/components/pages/platform/ask/03-block-3";
import { UniversalContextTm } from "@/components/pages/platform/ask/04-universal-context-tm";
import { Block5 } from "@/components/pages/platform/ask/05-block-5";
import { IntelligenceBuiltForHow } from "@/components/pages/platform/ask/06-intelligence-built-for-how";
import { Block7 } from "@/components/pages/platform/ask/07-block-7";
import { FromOneExpertTo } from "@/components/pages/platform/ask/08-from-one-expert-to";
import { Block9 } from "@/components/pages/platform/ask/09-block-9";
import { Block10 } from "@/components/pages/platform/ask/10-block-10";
import { AskMoreFromCrm } from "@/components/pages/platform/ask/11-ask-more-from-crm";

export const metadata: Metadata = {
  title: "Ask Joshuattio | Joshuattio",
  description: "Ask more from CRM.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "ask-joshuattio": AskJoshuattio,
  "block": Block,
  "simply-powerful-customer-intelligence": SimplyPowerfulCustomerIntelligence,
  "block-3": Block3,
  "universal-context-tm": UniversalContextTm,
  "block-5": Block5,
  "intelligence-built-for-how": IntelligenceBuiltForHow,
  "block-7": Block7,
  "from-one-expert-to": FromOneExpertTo,
  "block-9": Block9,
  "block-10": Block10,
  "ask-more-from-crm": AskMoreFromCrm,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/ask">) {
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
