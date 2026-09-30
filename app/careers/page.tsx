import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { Careers } from "@/components/pages/careers/00-careers";
import { Divider } from "@/components/pages/careers/01-divider";
import { Block } from "@/components/pages/careers/02-block";
import { Divider3 } from "@/components/pages/careers/03-divider-3";
import { JoinATeamOf } from "@/components/pages/careers/04-join-a-team-of";
import { S190TeamMembers } from "@/components/pages/careers/05-190-team-members";
import { Divider6 } from "@/components/pages/careers/06-divider-6";
import { OurValues } from "@/components/pages/careers/07-our-values";
import { Divider8 } from "@/components/pages/careers/08-divider-8";
import { OpenPositions } from "@/components/pages/careers/09-open-positions";
import { Divider10 } from "@/components/pages/careers/10-divider-10";
import { RightRoleRightTime } from "@/components/pages/careers/11-right-role-right-time";
import { Divider12 } from "@/components/pages/careers/12-divider-12";
import { KeepUpToDate } from "@/components/pages/careers/13-keep-up-to-date";

export const metadata: Metadata = {
  title: "Careers | Joshuattio",
  description: "Looking for your next challenge? Changing paradigms isn't easy and we're looking for more exceptional people to join the team and change CRM forever.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "careers": Careers,
  "divider": Divider,
  "block": Block,
  "divider-3": Divider3,
  "join-a-team-of": JoinATeamOf,
  "190-team-members": S190TeamMembers,
  "divider-6": Divider6,
  "our-values": OurValues,
  "divider-8": Divider8,
  "open-positions": OpenPositions,
  "divider-10": Divider10,
  "right-role-right-time": RightRoleRightTime,
  "divider-12": Divider12,
  "keep-up-to-date": KeepUpToDate,
} as const;

export default async function Page({ searchParams }: PageProps<"/careers">) {
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
