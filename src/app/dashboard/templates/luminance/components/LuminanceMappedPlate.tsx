"use client";

import { cn } from "@/lib/utils";
import { LuminanceStop } from "./luminanceMap";

export function LuminanceMappedPlate({
  src,
  fit,
  stops,
}: {
  src: string;
  fit: "cover" | "contain";
  stops: readonly LuminanceStop[];
}) {
  const shadow = stops[0]?.color ?? "#000000";
  const highlight = stops[stops.length - 1]?.color ?? "#ffffff";
  const framed = fit === "cover";

  return (
    <div
      className={cn("relative isolate overflow-hidden", framed ? "h-full w-full" : "mx-auto inline-block max-w-full")}
      style={{ backgroundColor: highlight }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={cn(
          "grayscale",
          framed ? "h-full w-full object-cover" : "max-h-[70vh] max-w-full object-contain",
        )}
        style={{ mixBlendMode: "multiply" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: shadow, mixBlendMode: "lighten" }}
      />
    </div>
  );
}

const brandLabels = ["Dark", "Primary", "Secondary"] as const;
const tonalLabels = ["Dark", "Primary", "Light"] as const;

export function BrandMapLegend({
  preset,
  stops,
}: {
  preset: "brand" | "tonal-brand";
  stops: readonly LuminanceStop[];
}) {
  const labels = preset === "tonal-brand" ? tonalLabels : brandLabels;
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {stops.map((stop, index) => (
        <span key={`${stop.position}-${stop.color}`} className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border" style={{ backgroundColor: stop.color }} />
          {labels[index] ?? "Stop"}
        </span>
      ))}
    </div>
  );
}
