import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { CallIntelligence } from "@/components/pages/platform/call-intelligence/00-call-intelligence";
import { Block } from "@/components/pages/platform/call-intelligence/01-block";
import { FromHelloToHandoff } from "@/components/pages/platform/call-intelligence/02-from-hello-to-handoff";
import { Block3 } from "@/components/pages/platform/call-intelligence/03-block-3";
import { Block4 } from "@/components/pages/platform/call-intelligence/04-block-4";
import { Block5 } from "@/components/pages/platform/call-intelligence/05-block-5";
import { OneConversationLimitlessInsights } from "@/components/pages/platform/call-intelligence/06-one-conversation-limitless-insights";
import { Block7 } from "@/components/pages/platform/call-intelligence/07-block-7";
import { InstantSyncZeroSetup } from "@/components/pages/platform/call-intelligence/08-instant-sync-zero-setup";
import { Block9 } from "@/components/pages/platform/call-intelligence/09-block-9";
import { TakeALookAt } from "@/components/pages/platform/call-intelligence/10-take-a-look-at";
import { Block11 } from "@/components/pages/platform/call-intelligence/11-block-11";
import { FollowUpWithoutFriction } from "@/components/pages/platform/call-intelligence/12-follow-up-without-friction";
import { Block13 } from "@/components/pages/platform/call-intelligence/13-block-13";
import { JoshuattioPlugsInYou } from "@/components/pages/platform/call-intelligence/14-joshuattio-plugs-in-you";
import { Cta } from "@/components/pages/platform/call-intelligence/15-cta";

export const metadata: Metadata = {
  title: "Call Intelligence | Joshuattio",
  description: "Every conversation captured, summarized, and synced to your CRM, instantly.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "call-intelligence": CallIntelligence,
  "block": Block,
  "from-hello-to-handoff": FromHelloToHandoff,
  "block-3": Block3,
  "block-4": Block4,
  "block-5": Block5,
  "one-conversation-limitless-insights": OneConversationLimitlessInsights,
  "block-7": Block7,
  "instant-sync-zero-setup": InstantSyncZeroSetup,
  "block-9": Block9,
  "take-a-look-at": TakeALookAt,
  "block-11": Block11,
  "follow-up-without-friction": FollowUpWithoutFriction,
  "block-13": Block13,
  "joshuattio-plugs-in-you": JoshuattioPlugsInYou,
  "cta": Cta,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/call-intelligence">) {
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
