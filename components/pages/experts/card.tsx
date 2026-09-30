import type { Expert } from "./data";

// Tier badges (plain metal coins, no mark).
const TIER_BADGE: Record<string, string> = {
  Elite: "/img/img-d55bdf2514.webp",
  Advanced: "/img/img-8cfc5356fa.webp",
  Core: "/img/img-28730d2889.webp",
};

const STAR = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

/** Star fill per slot: the rating rounded to the nearest half. */
function starFill(rating: number | null, i: number) {
  if (!rating) return 0;
  const r = Math.round(rating * 2) / 2;
  return Math.max(0, Math.min(1, r - i));
}

function Star({ fill }: { fill: number }) {
  return (
    <div data-test-uiratingstar="" className="pointer-events-none h-5 w-5">
      <div className="relative h-full w-full">
        {fill < 1 ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24px" height="24px" className="absolute left-0 top-0 text-icon-disabled h-5 w-5">
            <path d={STAR} />
          </svg>
        ) : null}{" "}
        {fill > 0 ? (
          <div className="absolute left-0 top-0 h-full overflow-hidden w-full" style={fill < 1 ? { width: `${fill * 100}%` } : undefined}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24px" height="24px" className="text-icon-award h-5 w-5">
              <path d={STAR} />
            </svg>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const CARD_CLASS =
  "block overflow-hidden rounded-lg text-text shadow-2dp focus:outline-none focus:ring-2 focus:ring-focused focus:ring-offset-1 cursor-pointer transition-shadow hover:shadow-2dp-hover bg-surface";

export function MatchmakingCard() {
  return (
    <a tabIndex={0} data-test-uicard="" data-test-service-matchmaking-card="" className={CARD_CLASS} href="/experts/matchmaking">
      <div className="h-full w-full flex flex-col overflow-hidden">
        <div data-test-uicardcontent="" className="px-5 py-0 last:pb-5 flex grow flex-col gap-y-2 first:pt-5">
          <div className="flex flex-col gap-y-2">
            <div data-test-title="" className="line-clamp-2 text-16 font-bold text-text">
              {"Let us match you"}
            </div>{" "}
            <div className="line-clamp-4 text-text-subtle">
              <span>
                <span className="notranslate">{" Joshuattio "}</span>
                {" will do all the work to match you with the best Experts."}
              </span>
            </div>
          </div>{" "}
          <div className="flex grow items-center justify-center gap-x-2" />{" "}
          <button
            type="button"
            data-test-uibutton=""
            data-test-cta-button=""
            className="group/button relative inline-flex min-w-0 items-center justify-center transition-colors duration-75 focus:outline-none focus:ring-2 focus:ring-focused active:ring-0 rounded border w-full cursor-pointer bg-action-primary hover:bg-action-primary-hover active:bg-action-primary-pressed border-transparent text-text-on-primary hover:text-text-on-primary active:text-text-on-primary font-semibold px-4 py-2"
          >
            <div className="flex w-full justify-center gap-1 flex-row items-center">
              {" "}
              <div data-test-text="" className="min-w-0 text-14 truncate whitespace-nowrap">
                {"Get matched"}
              </div>
            </div>{" "}
          </button>
        </div>
      </div>
    </a>
  );
}

export function ExpertCard({ expert }: { expert: Expert }) {
  const { rating } = expert;
  return (
    <a tabIndex={0} data-test-uicard="" data-test-service-partner-card="" className={CARD_CLASS} href={`/experts/${expert.slug}`}>
      <div className="h-full w-full flex flex-col overflow-hidden">
        <div data-test-uicardcontent="" className="px-5 py-0 last:pb-5 flex grow flex-col justify-center first:pt-5">
          <article className="flex flex-col gap-y-4">
            <div data-test-tier="" className="flex h-8 items-center gap-x-5 text-text-subtle">
              <div data-test-tier-name="" className="grow truncate typography-label-small">
                {expert.tier}
              </div>{" "}
              <img src={TIER_BADGE[expert.tier]} alt={expert.tier} loading="lazy" data-test-tier-image="" className="h-8 w-8 object-contain" />
            </div>{" "}
            <div className="flex h-20 w-[200px] max-w-full self-center text-center">
              <img alt={expert.name} src={expert.logo} loading="lazy" data-test-partner-logo="" className="h-full w-full object-contain" />
            </div>{" "}
            <div data-test-availability="" className="flex">
              {expert.available ? (
                <div className="flex items-center gap-x-1 overflow-hidden rounded-full px-[6px] py-px bg-surface-success-subtle-pressed">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" data-test-availability-icon-true="" width="16px" height="16px" className="text-text-success">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>{" "}
                  <div data-test-availability-text="" className="truncate text-text">
                    {"Accepting new clients"}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-x-1 overflow-hidden rounded-full px-[6px] py-px bg-surface-neutral">
                  <div data-test-availability-text="" className="truncate text-text-subtle">
                    {"Not accepting new clients"}
                  </div>
                </div>
              )}
            </div>{" "}
            <div className="flex flex-col gap-y-2">
              <h2 title={expert.title} data-test-partner-name="" className="notranslate truncate text-text typography-h5">
                {expert.name}
              </h2>{" "}
              <div data-test-partner-description="" className="line-clamp-4 h-[80px] text-text-subtle">
                {expert.description}
              </div>
            </div>{" "}
            <div data-test-uiratingsummary="" data-test-partner-reviews="" className="flex gap-x-1">
              <div data-test-uirating="" className="flex items-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} data-test-star={i} className="">
                    <Star fill={starFill(rating, i)} />
                  </div>
                ))}
              </div>{" "}
              {rating ? <span className="font-semibold text-text">{rating.toFixed(1)}</span> : null}{" "}
              <span className="text-text-subtle">{`(${expert.reviews})`}</span>
            </div>
          </article>
        </div>
      </div>
    </a>
  );
}
