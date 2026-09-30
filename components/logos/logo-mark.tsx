import type { CSSProperties } from "react";

export type Logo = { key: string; name: string; src: string; width: number; height: number; href?: string };

// Mask-image logo tinted by the background color class.
export function LogoMark({
  src,
  name,
  width,
  height,
  renderWidth,
  className = "block bg-secondary-foreground transition-colors duration-200 ease-out",
}: {
  src: string;
  name: string;
  width: number;
  height: number;
  renderWidth?: string;
  className?: string;
}) {
  const style: CSSProperties = {
    aspectRatio: `${width} / ${height}`,
    height: "auto",
    maskImage: `url(${src})`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
    maxWidth: "100%",
    WebkitMaskImage: `url(${src})`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    width: renderWidth ?? `${width}px`,
  };
  return <span role="img" aria-label={name} className={className} style={style} />;
}
