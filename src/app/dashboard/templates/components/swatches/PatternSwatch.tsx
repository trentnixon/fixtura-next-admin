import { CSSProperties, ReactNode } from "react";
import { PATTERN_TYPES, PatternType } from "@/types/template-pattern";
import { cn } from "@/lib/utils";

function Plate({ style }: { style?: CSSProperties }) {
  return <div className="h-full w-full bg-[#0b1220]" style={style} />;
}

const patternArt: Record<PatternType, () => ReactNode> = {
  Triangles: () => (
    <div className="relative h-full w-full overflow-hidden bg-[#0b1220]">
      {["left-[12%] top-[18%]", "left-[40%] top-[42%]", "left-[66%] top-[16%]", "left-[24%] top-[64%]"].map(
        (place) => (
          <span
            key={place}
            className={cn(
              "absolute h-0 w-0 border-b-[14px] border-l-[8px] border-r-[8px] border-b-white/80 border-l-transparent border-r-transparent",
              place
            )}
          />
        )
      )}
    </div>
  ),
  lines: () => (
    <Plate
      style={{
        backgroundImage:
          "repeating-linear-gradient(180deg, transparent 0 9px, rgba(255,255,255,0.55) 9px 10px)",
      }}
    />
  ),
  grid: () => (
    <Plate
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
  ),
  dots: () => (
    <Plate
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1.2px, transparent 1.5px)",
        backgroundSize: "12px 12px",
      }}
    />
  ),
  Crosshatch: () => (
    <Plate
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent 0 7px, rgba(255,255,255,0.45) 7px 8px), repeating-linear-gradient(-45deg, transparent 0 7px, rgba(255,255,255,0.45) 7px 8px)",
      }}
    />
  ),
  Chevron: () => (
    <Plate
      style={{
        backgroundImage:
          "repeating-linear-gradient(115deg, transparent 0 8px, rgba(125,211,252,0.8) 8px 9px), repeating-linear-gradient(65deg, transparent 0 8px, rgba(125,211,252,0.8) 8px 9px)",
      }}
    />
  ),
};

export function PatternSwatch({ type, className }: { type: string; className?: string }) {
  const known = PATTERN_TYPES.find((patternType) => patternType === type);
  const Art = known ? patternArt[known] : null;
  return (
    <div className={cn("h-full w-full", className)} aria-hidden>
      {Art ? <Art /> : <Plate />}
    </div>
  );
}
