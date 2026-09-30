import { DockAppTile, DockGlow, HeaderDownloadButton } from "./download-client";

/** App tile glyph: dark rounded square with the brand initial. */
function AppIcon() {
  return (
    <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0-dl-app)">
            <rect width="86" height="86" fill="url(#paint0_linear-dl-app)" />
            <g filter="url(#filter0_f-dl-app)">
              <rect x="-10.5781" y="-10.5742" width="49.3443" height="49.3443" rx="24.6721" fill="white" fillOpacity="0.08" />
            </g>
            <g filter="url(#filter1_f-dl-app)">
              <rect x="21.8516" y="78.2461" width="45.1148" height="59.2131" rx="22.5574" fill="white" fillOpacity="0.05" />
            </g>
            <g filter="url(#filter2_dddddi-dl-app)">
              <text x="43" y="58" textAnchor="middle" fontSize="44" fontWeight="600" fill="url(#paint1_linear-dl-app)" style={{ fontFamily: "var(--font-inter-display, var(--font-inter)), sans-serif" }}>
                {"J"}
              </text>
            </g>
          </g>
          <defs>
            <filter id="filter0_f-dl-app" x="-38.7748" y="-38.7709" width="105.738" height="105.738" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="14.0984" result="effect1_foregroundBlur-dl-app" />
            </filter>
            <filter id="filter1_f-dl-app" x="-6.34516" y="50.0494" width="101.508" height="115.606" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="14.0984" result="effect1_foregroundBlur-dl-app" />
            </filter>
            <filter id="filter2_dddddi-dl-app" x="6.34421" y="18.328" width="73.3116" height="85.9998" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="1.40984" />
              <feGaussianBlur stdDeviation="1.40984" />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow-dl-app" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="11.2787" />
              <feGaussianBlur stdDeviation="3.52459" />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
              <feBlend mode="normal" in2="effect1_dropShadow-dl-app" result="effect2_dropShadow-dl-app" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4.22951" />
              <feGaussianBlur stdDeviation="2.11475" />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.36 0" />
              <feBlend mode="normal" in2="effect2_dropShadow-dl-app" result="effect3_dropShadow-dl-app" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="18.3279" />
              <feGaussianBlur stdDeviation="3.52459" />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
              <feBlend mode="normal" in2="effect3_dropShadow-dl-app" result="effect4_dropShadow-dl-app" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="29.6066" />
              <feGaussianBlur stdDeviation="4.22951" />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
              <feBlend mode="normal" in2="effect4_dropShadow-dl-app" result="effect5_dropShadow-dl-app" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect5_dropShadow-dl-app" result="shape" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="0.352459" dy="0.704918" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="shape" result="effect6_innerShadow-dl-app" />
            </filter>
            <linearGradient id="paint0_linear-dl-app" x1="43" y1="0" x2="43" y2="86" gradientUnits="userSpaceOnUse">
              <stop stopColor="#343740" />
              <stop offset="1" stopColor="#24252D" />
            </linearGradient>
            <linearGradient id="paint1_linear-dl-app" x1="33.1311" y1="20.4427" x2="61.3278" y2="66.9673" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EEEEEE" />
              <stop offset="1" stopColor="#EDEDED" />
            </linearGradient>
            <clipPath id="clip0-dl-app">
              <rect width="86" height="86" fill="white" />
            </clipPath>
          </defs>
        </svg>
  );
}

/** Page header: kicker, title, platform-aware download button, animated dock. */
export function DownloadHero() {
  return (
    <header className="relative grid flex-1 grid-cols-12 overflow-clip border-subtle-stroke border-x *:row-1 max-lg:overflow-visible max-lg:border-none">
      <div className="relative col-[2/-2] max-lg:col-[1/-1]">
        <div className="mask-t-from-85% pointer-events-none absolute inset-0 flex justify-between max-lg:hidden">
          <svg width="1" height="100%" className="text-subtle-stroke">
            <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
          <svg width="1" height="100%" className="text-subtle-stroke">
            <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="isolate flex flex-col items-center gap-15 pb-20">
          <header className="flex w-full flex-col pt-30 pb-15 max-xl:pt-25 max-lg:pt-20 items-center relative z-30" style={{"--animate-delay":"0ms","--animate-delay-mobile":"0ms"}}>
            <div className="inline-block w-fit rounded-[13px] border border-weak-stroke bg-primary-background px-3 py-1.5 font-medium text-[13px]/[1.4em] text-secondary-foreground mb-6">
              <h1>
                {"Desktop & mobile"}
              </h1>
            </div>
            <h2 className="max-w-[15em] text-balance text-heading-responsive-lg text-center">
              {/* the full title wraps to two lines at phone width; a shorter phrase keeps it on one */}
              <span className="max-md:hidden">{"Download Joshuattio."}</span>
              <span className="md:hidden">{"Get Joshuattio."}</span>
            </h2>
            <p className="mt-4 max-w-xl text-balance text-lg text-secondary-foreground lg:text-xl text-center">
              {"Available for Mac, iOS and Android."}
            </p>
            <HeaderDownloadButton className="mt-6" />
          </header>
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex w-screen -translate-x-1/2 justify-between lg:hidden">
            <div className="w-15 bg-gradient-to-r from-primary-background to-transparent" />
            <div className="w-15 bg-gradient-to-l from-primary-background to-transparent" />
          </div>
          <div className="relative z-10">
            <svg width="100%" height="1" className="text-subtle-stroke absolute top-1/2 left-1/2 w-screen -translate-x-1/2 -translate-y-1/2">
              <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
            </svg>
            <div className="relative flex items-center justify-center px-6 max-lg:scale-90">
              <div className="mask-x-from-[calc(100%-24px)] absolute inset-0 bg-primary-background" />
              <div className="relative">
                <DockGlow>
                  <img alt="" width="2471" height="1211" decoding="async" data-nimg="1" className="h-80 min-h-80 w-full" style={{"color":"transparent"}} srcSet="/img/img-333499fa0f.avif 1x" src="/img/img-333499fa0f.avif" />
                </DockGlow>
                <svg width="1" height="100%" className="text-subtle-stroke absolute top-full left-1/2 h-20 w-px -translate-x-1/2 translate-y-0">
                  <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
                </svg>
                <div className="relative isolate flex items-center justify-center rounded-[40px] bg-white-200/85 p-5 backdrop-blur-lg" style={{"boxShadow":"0px 3px 3px -1.5px #0000000A,0px 1px 1px -0.5px #0000000D,0px 1px 0px 0px #FFFFFFA6 inset,0px 0px 0px 4px #A4ADBA14,0px 0px 0px 1px #1C28400A"}}>
                  <div className="mx-3 flex size-20 items-center justify-center rounded-3xl bg-[#FCFCFC] text-subtle-stroke ml-0" style={{"boxShadow":"0px 3px 3px -1.5px #1C28400D,0px 1px 1px -0.5px #1C28400D,0px 0px 0px 1px #1C28400A,0px 1px 0px 0px #FFFFFFE5 inset,0px -1px 0px 0px #00000008 inset"}}>
                    <svg width="56" height="36" viewBox="0 0 56 36" fill="none">
                      <path d="M51.5 0.5H4.5C2.29086 0.5 0.5 2.29086 0.5 4.5V31.5C0.5 33.7091 2.29086 35.5 4.5 35.5H51.5C53.7091 35.5 55.5 33.7091 55.5 31.5V4.5C55.5 2.29086 53.7091 0.5 51.5 0.5Z" stroke="currentColor" strokeLinecap="round" strokeDasharray="3 4" />
                      <path d="M3 3.49964L17.5 17.9996M52.5 3.18164L37.6818 17.9996M52.5 32.818L37.6818 17.9996M3 32.4996L17.5 17.9996M17.5 17.9996L21.8939 22.3935C24.9982 25.4978 30.0242 25.5205 33.1564 22.4442L37.6818 17.9996" stroke="currentColor" strokeDasharray="3 4" />
                    </svg>
                  </div>
                  <div className="mx-3 flex size-20 items-center justify-center rounded-3xl bg-[#FCFCFC] text-subtle-stroke" style={{"boxShadow":"0px 3px 3px -1.5px #1C28400D,0px 1px 1px -0.5px #1C28400D,0px 0px 0px 1px #1C28400A,0px 1px 0px 0px #FFFFFFE5 inset,0px -1px 0px 0px #00000008 inset"}}>
                    <svg width="56" height="50" viewBox="0 0 56 50" fill="none">
                      <path d="M28 45.3834C42.9117 45.3834 55 35.4479 55 23.1917C55 10.9356 42.9117 1 28 1C13.0883 1 1 10.9356 1 23.1917C1 30.9972 5.90301 37.8616 13.3158 41.8176C14.2632 42.3232 14.1684 43.6836 13.7895 44.4391C13.3158 45.3834 10.9474 47.7443 10.9474 48.6886C10.9474 49.6329 14.2632 48.2164 16.1579 47.2721C17.6855 46.5107 20.1826 44.4391 22.4334 44.9113C24.2297 45.2207 26.0918 45.3834 28 45.3834Z" stroke="currentColor" strokeLinecap="round" strokeDasharray="3 4" />
                    </svg>
                  </div>
                  <DockAppTile>
                      <AppIcon />
                    </DockAppTile>
                  <div className="mx-3 flex size-20 items-center justify-center rounded-3xl bg-[#FCFCFC] text-subtle-stroke" style={{"boxShadow":"0px 3px 3px -1.5px #1C28400D,0px 1px 1px -0.5px #1C28400D,0px 0px 0px 1px #1C28400A,0px 1px 0px 0px #FFFFFFE5 inset,0px -1px 0px 0px #00000008 inset"}}>
                    <svg width="54" height="42" viewBox="0 0 54 42" fill="none">
                      <path d="M13.5 37.3398C8.37726 37.3398 4.76851 39.4361 2.67375 41.1505C1.92297 41.765 0.5 41.2174 0.5 40.2473V7.23655C0.5 6.81613 0.629907 6.40854 0.90721 6.09254C2.16961 4.65396 6.36721 0.589844 13.5 0.589844C20.1104 0.589844 23.9897 4.68649 25.1379 6.10965C25.3859 6.41695 25.5 6.80055 25.5 7.1954V40.0371C25.5 41.0265 24.0014 41.5779 23.2476 40.9371C21.2832 39.2671 18.034 37.3398 13.5 37.3398Z" stroke="currentColor" strokeLinecap="round" strokeDasharray="3 4" />
                      <path d="M41.5 37.3398C36.3773 37.3398 32.7685 39.4361 30.6737 41.1505C29.923 41.765 28.5 41.2174 28.5 40.2473V7.23655C28.5 6.81613 28.6299 6.40854 28.9072 6.09254C30.1696 4.65396 34.3672 0.589844 41.5 0.589844C48.1104 0.589844 51.9897 4.68649 53.1379 6.10965C53.3859 6.41695 53.5 6.80055 53.5 7.1954V40.0371C53.5 41.0265 52.0014 41.5779 51.2476 40.9371C49.2832 39.2671 46.034 37.3398 41.5 37.3398Z" stroke="currentColor" strokeLinecap="round" strokeDasharray="3 4" />
                    </svg>
                  </div>
                  <div className="mx-3 flex size-20 items-center justify-center rounded-3xl bg-[#FCFCFC] text-subtle-stroke mr-0" style={{"boxShadow":"0px 3px 3px -1.5px #1C28400D,0px 1px 1px -0.5px #1C28400D,0px 0px 0px 1px #1C28400A,0px 1px 0px 0px #FFFFFFE5 inset,0px -1px 0px 0px #00000008 inset"}}>
                    <svg width="54" height="36" viewBox="0 0 54 36" fill="none">
                      <path d="M0.5 9C0.5 4.58172 4.08172 1 8.5 1H28.5C32.9183 1 36.5 4.58172 36.5 9V27C36.5 31.4183 32.9183 35 28.5 35H8.5C4.08172 35 0.5 31.4183 0.5 27V9Z" stroke="currentColor" strokeLinecap="round" strokeDasharray="3 4" />
                      <path d="M40 12.8854V22.5746C40 23.4766 40.4058 24.3306 41.105 24.9004L49.4208 31.6762C51.054 33.007 53.5 31.8448 53.5 29.7381V5.41373C53.5 3.28144 51.002 2.1279 49.3788 3.51062L41.0546 10.6016C40.3855 11.1716 40 12.0064 40 12.8854Z" stroke="currentColor" strokeLinecap="round" strokeDasharray="3 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
