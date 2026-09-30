// Brand logomark for the guidelines page: the initial set in the display face, on the logomark's 37 x 30 box.
export function Logomark({ className }: { className?: string }) {
  return (
    <svg width="37" height="30" viewBox="0 0 37 30" fill="none" className={className} role="img" aria-label="joshuattio logomark">
      <text
        x="18.5"
        y="25.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="32"
        fontWeight="700"
        style={{ fontFamily: "var(--font-inter-display, var(--font-inter)), sans-serif" }}
      >
        {"J"}
      </text>
    </svg>
  );
}
