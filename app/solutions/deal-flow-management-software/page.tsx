import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { DealFlowCrm } from "@/components/pages/solutions/deal-flow-management-software/00-deal-flow-crm";
import { Block } from "@/components/pages/solutions/deal-flow-management-software/01-block";
import { Organize } from "@/components/pages/solutions/deal-flow-management-software/02-organize";
import { PipelineManagement } from "@/components/pages/solutions/deal-flow-management-software/03-pipeline-management";
import { AndThatSNot } from "@/components/pages/solutions/deal-flow-management-software/04-and-that-s-not";
import { Block5 } from "@/components/pages/solutions/deal-flow-management-software/05-block-5";
import { Cta } from "@/components/pages/solutions/deal-flow-management-software/06-cta";

export const metadata: Metadata = {
  title: "Joshuattio: The CRM for agentic revenue",
  description: "The system for revenue teams to build pipeline, accelerate deals, and grow accounts around the clock.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "deal-flow-crm": DealFlowCrm,
  "block": Block,
  "organize": Organize,
  "pipeline-management": PipelineManagement,
  "and-that-s-not": AndThatSNot,
  "block-5": Block5,
  "cta": Cta,
} as const;

export default async function Page({ searchParams }: PageProps<"/solutions/deal-flow-management-software">) {
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
