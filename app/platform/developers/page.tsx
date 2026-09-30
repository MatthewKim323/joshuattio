import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import "@/components/pages/platform/developers/dev-theme.css";
import { DevEasterEggProvider } from "@/components/pages/platform/developers/dev-easter-egg";
import { DeveloperPlatform } from "@/components/pages/platform/developers/00-developer-platform";
import { Block } from "@/components/pages/platform/developers/01-block";
import { IntegrateJoshuattioWithAnything } from "@/components/pages/platform/developers/02-integrate-joshuattio-with-anything";
import { Block3 } from "@/components/pages/platform/developers/03-block-3";
import { Spacer } from "@/components/pages/platform/developers/04-spacer";
import { Block5 } from "@/components/pages/platform/developers/05-block-5";
import { Block6 } from "@/components/pages/platform/developers/06-block-6";
import { BuildYourJoshuattioYour } from "@/components/pages/platform/developers/07-build-your-joshuattio-your";
import { Block8 } from "@/components/pages/platform/developers/08-block-8";
import { ExposeJoshuattioToAi } from "@/components/pages/platform/developers/09-expose-joshuattio-to-ai";
import { Block10 } from "@/components/pages/platform/developers/10-block-10";
import { ForDevelopersByDevelopers } from "@/components/pages/platform/developers/11-for-developers-by-developers";
import { Block12 } from "@/components/pages/platform/developers/12-block-12";
import { Spacer13 } from "@/components/pages/platform/developers/13-spacer-13";
import { Block14 } from "@/components/pages/platform/developers/14-block-14";
import { Block15 } from "@/components/pages/platform/developers/15-block-15";
import { TheSdkBehindFast } from "@/components/pages/platform/developers/16-the-sdk-behind-fast";
import { Block17 } from "@/components/pages/platform/developers/17-block-17";
import { ReadyToBuild } from "@/components/pages/platform/developers/18-ready-to-build";
import { ReadyToBuild19 } from "@/components/pages/platform/developers/19-ready-to-build-19";

export const metadata: Metadata = {
  title: "Developer Platform | Joshuattio",
  description: "Joshuattio is the CRM for developers.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "developer-platform": DeveloperPlatform,
  "block": Block,
  "integrate-joshuattio-with-anything": IntegrateJoshuattioWithAnything,
  "block-3": Block3,
  "spacer": Spacer,
  "block-5": Block5,
  "block-6": Block6,
  "build-your-joshuattio-your": BuildYourJoshuattioYour,
  "block-8": Block8,
  "expose-joshuattio-to-ai": ExposeJoshuattioToAi,
  "block-10": Block10,
  "for-developers-by-developers": ForDevelopersByDevelopers,
  "block-12": Block12,
  "spacer-13": Spacer13,
  "block-14": Block14,
  "block-15": Block15,
  "the-sdk-behind-fast": TheSdkBehindFast,
  "block-17": Block17,
  "ready-to-build": ReadyToBuild,
  "ready-to-build-19": ReadyToBuild19,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/developers">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <div className="dark contents" data-route-theme="dark"><DevEasterEggProvider><main><One /></main></DevEasterEggProvider></div>;
  }
  return (
    <div className="dark contents" data-route-theme="dark">
      <DevEasterEggProvider>
        <SiteShell>
          <>
            {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
          </>
        </SiteShell>
      </DevEasterEggProvider>
    </div>
  );
}
