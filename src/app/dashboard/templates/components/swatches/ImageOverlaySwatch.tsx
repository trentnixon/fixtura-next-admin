import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IMAGE_OVERLAY_STYLES, ImageOverlayStyle } from "@/types/template-image";

export function overlayStrength(opacity: number | null): number {
  if (opacity === null || Number.isNaN(opacity)) return 0.55;
  const unit = opacity > 1 ? opacity / 100 : opacity;
  if (unit < 0) return 0;
  if (unit > 1) return 1;
  return unit;
}

function Photo() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(#7dd3fc 0% 38%, #86efac 38% 48%, #166534 48% 100%)",
      }}
    />
  );
}

const overlayArt: Record<ImageOverlayStyle, (alpha: number, gradientType: string) => ReactNode> = {
  none: () => null,
  solid: (alpha) => <div className="absolute inset-0 bg-slate-950" style={{ opacity: alpha }} />,
  gradient: (alpha, gradientType) => (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: gradientType.toLowerCase().includes("radial")
          ? `radial-gradient(circle at 50% 45%, transparent 10%, rgba(15,23,42,${alpha}) 78%)`
          : `linear-gradient(180deg, rgba(15,23,42,${alpha}) 0%, transparent 62%)`,
      }}
    />
  ),
  vignette: (alpha) => (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, transparent 28%, rgba(0,0,0,${Math.max(alpha, 0.35)}) 100%)`,
      }}
    />
  ),
  duotone: (alpha) => (
    <>
      <div className="absolute inset-0 bg-teal-800 mix-blend-multiply" style={{ opacity: alpha }} />
      <div className="absolute inset-0 bg-amber-400/50 mix-blend-screen" />
    </>
  ),
  pattern: (alpha) => (
    <div
      className="absolute inset-0"
      style={{
        opacity: Math.max(alpha, 0.35),
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.7) 6px 7px)",
      }}
    />
  ),
  colorFilter: (alpha) => (
    <div className="absolute inset-0 bg-cyan-600 mix-blend-color" style={{ opacity: Math.max(alpha, 0.45) }} />
  ),
};

export function ImageOverlaySwatch({
  overlayStyle,
  gradientType,
  opacity,
  className,
}: {
  overlayStyle: string;
  gradientType: string;
  opacity: number | null;
  className?: string;
}) {
  const known = IMAGE_OVERLAY_STYLES.find((style) => style === overlayStyle);
  const art = known ? overlayArt[known] : null;
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#0b1220] isolate", className)} aria-hidden>
      <Photo />
      {art ? art(overlayStrength(opacity), gradientType) : null}
    </div>
  );
}
