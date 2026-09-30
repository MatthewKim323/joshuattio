import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { CrmForStartups } from "@/components/pages/solutions/startup-crm/00-crm-for-startups";
import { Block } from "@/components/pages/solutions/startup-crm/01-block";
import { FromZeroToOne } from "@/components/pages/solutions/startup-crm/02-from-zero-to-one";
import { Block3 } from "@/components/pages/solutions/startup-crm/03-block-3";
import { PipelineManagement } from "@/components/pages/solutions/startup-crm/04-pipeline-management";
import { AndThatSNot } from "@/components/pages/solutions/startup-crm/05-and-that-s-not";
import { Block6 } from "@/components/pages/solutions/startup-crm/06-block-6";
import { Cta } from "@/components/pages/solutions/startup-crm/07-cta";

export const metadata: Metadata = {
  title: "Joshuattio: The CRM for agentic revenue",
  description: "The system for revenue teams to build pipeline, accelerate deals, and grow accounts around the clock.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "crm-for-startups": CrmForStartups,
  "block": Block,
  "from-zero-to-one": FromZeroToOne,
  "block-3": Block3,
  "pipeline-management": PipelineManagement,
  "and-that-s-not": AndThatSNot,
  "block-6": Block6,
  "cta": Cta,
} as const;

export default async function Page({ searchParams }: PageProps<"/solutions/startup-crm">) {
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
