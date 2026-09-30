"use client";
import { useEffect, useState } from "react";

const KEY = "cookie-decision";
const BUTTON =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3";

/** First-visit cookie notice, bottom left. Hidden once the visitor picks Continue or Reject. */
export function CookieBanner() {
  // decided until proven otherwise, so the server render and first client render are both empty
  const [decided, setDecided] = useState(true);
  useEffect(() => {
    try {
      setDecided(localStorage.getItem(KEY) !== null);
    } catch {
      setDecided(false);
    }
  }, []);
  if (decided) return null;
  const decide = (value: "allow" | "block") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setDecided(true);
  };
  return (
    <div role="region" aria-label="Cookie consent" className="pointer-events-none fixed right-4 bottom-4 left-4 z-(--dialog-content-z-index) flex justify-start">
      <div className="border border-black-100/5 backdrop-blur-xs dark:border-white-100/5 pointer-events-auto relative w-fit motion-safe:slide-in-from-bottom motion-safe:fade-in-50 motion-safe:animate-in motion-safe:duration-200 motion-safe:ease-out motion-reduce:animate-none" style={{ borderRadius: 20 }}>
        <div className="overflow-hidden bg-primary-background shadow-joshuattio-5 dark:bg-secondary-background" style={{ borderRadius: "calc(19px)", padding: 20 }}>
          <div className="max-w-[22em] text-balance text-sm [&_a]:underline">
            <div>
              <p>
                {"We use cookies to improve your experience. You can opt out of certain cookies. Find out more in our "}
                <a target="_blank" href="/legal/privacy">privacy policy</a>
                {"."}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" className={`${BUTTON} button-primary`} onClick={() => decide("allow")}>Continue</button>
            <button type="button" className={`${BUTTON} button-outline`} onClick={() => decide("block")}>Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}
