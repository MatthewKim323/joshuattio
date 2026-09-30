import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { Mcp } from "@/components/pages/platform/mcp/00-mcp";
import { Block } from "@/components/pages/platform/mcp/01-block";
import { ReadyWhereYouAre } from "@/components/pages/platform/mcp/02-ready-where-you-are";
import { Block3 } from "@/components/pages/platform/mcp/03-block-3";
import { NothingGetsLostIn } from "@/components/pages/platform/mcp/04-nothing-gets-lost-in";
import { Block5 } from "@/components/pages/platform/mcp/05-block-5";
import { YourWorkspaceWhereYou } from "@/components/pages/platform/mcp/06-your-workspace-where-you";
import { Block7 } from "@/components/pages/platform/mcp/07-block-7";
import { EndlessPossibilitiesForEvery } from "@/components/pages/platform/mcp/08-endless-possibilities-for-every";
import { Block9 } from "@/components/pages/platform/mcp/09-block-9";
import { HowThousandsOfTeams } from "@/components/pages/platform/mcp/10-how-thousands-of-teams";
import { Block11 } from "@/components/pages/platform/mcp/11-block-11";
import { Logos } from "@/components/pages/platform/mcp/12-logos";
import { Block13 } from "@/components/pages/platform/mcp/13-block-13";
import { ConnectedInAClick } from "@/components/pages/platform/mcp/14-connected-in-a-click";
import { Block15 } from "@/components/pages/platform/mcp/15-block-15";
import { KeepUpToDate } from "@/components/pages/platform/mcp/16-keep-up-to-date";
import { AskMoreFromCrm } from "@/components/pages/platform/mcp/17-ask-more-from-crm";

export const metadata: Metadata = {
  title: "MCP | Joshuattio",
  description: "Connect Joshuattio to ChatGPT, Claude, Notion, and anything else that speaks MCP. Search records, update deals, log notes, and create tasks.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "mcp": Mcp,
  "block": Block,
  "ready-where-you-are": ReadyWhereYouAre,
  "block-3": Block3,
  "nothing-gets-lost-in": NothingGetsLostIn,
  "block-5": Block5,
  "your-workspace-where-you": YourWorkspaceWhereYou,
  "block-7": Block7,
  "endless-possibilities-for-every": EndlessPossibilitiesForEvery,
  "block-9": Block9,
  "how-thousands-of-teams": HowThousandsOfTeams,
  "block-11": Block11,
  "logos": Logos,
  "block-13": Block13,
  "connected-in-a-click": ConnectedInAClick,
  "block-15": Block15,
  "keep-up-to-date": KeepUpToDate,
  "ask-more-from-crm": AskMoreFromCrm,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/mcp">) {
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
