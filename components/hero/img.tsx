import type { CSSProperties } from "react";

export type StaticImage = { src: string; width: number; height: number };

/** Plain <img> with the same attributes the optimized image component emits for a static import. */
export function Img({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
}: {
  src: StaticImage;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}) {
  if (fill) {
    const style: CSSProperties = {
      position: "absolute",
      height: "100%",
      width: "100%",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      color: "transparent",
    };
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} loading="lazy" decoding="async" data-nimg="fill" className={className} sizes={sizes} src={src.src} style={style} />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      width={width ?? src.width}
      height={height ?? src.height}
      decoding="async"
      data-nimg="1"
      className={className}
      src={src.src}
      style={{ color: "transparent" }}
    />
  );
}
