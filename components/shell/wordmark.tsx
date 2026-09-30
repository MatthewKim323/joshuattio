/** Placeholder wordmark: fills the same 103x26 box the final logo will use. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg width="103" height="26" viewBox="0 0 103 26" fill="none" className={className} role="img" aria-label="joshuattio">
      <text
        x="0"
        y="19.5"
        textLength="103"
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        fontSize="22"
        fontWeight="600"
        letterSpacing="-0.5"
        style={{ fontFamily: "var(--font-inter-display, var(--font-inter)), sans-serif" }}
      >
        {"joshuattio"}
      </text>
    </svg>
  );
}
