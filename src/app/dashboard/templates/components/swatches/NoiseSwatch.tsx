import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NOISE_TYPES, NoiseType } from "@/types/template-noise";

const speck = (size: string, alpha: number) =>
  `radial-gradient(circle, rgba(255,255,255,${alpha}) 0.4px, transparent ${size})`;

function Plate({ children }: { children?: ReactNode }) {
  return <div className="relative h-full w-full overflow-hidden bg-[#0b1220]">{children}</div>;
}

const noiseArt: Record<NoiseType, () => ReactNode> = {
  default: () => (
    <Plate>
      <div
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: speck("1.2px", 0.45), backgroundSize: "3px 3px" }}
      />
    </Plate>
  ),
  subtle: () => (
    <Plate>
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: speck("1.4px", 0.28), backgroundSize: "7px 7px" }}
      />
    </Plate>
  ),
  grain: () => (
    <Plate>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `${speck("0.8px", 0.75)}, radial-gradient(circle, rgba(0,0,0,0.65) 0.4px, transparent 0.9px)`,
          backgroundSize: "2px 2px, 3px 3px",
          backgroundPosition: "0 0, 1px 1px",
        }}
      />
    </Plate>
  ),
  wave: () => (
    <Plate>
      <div className="absolute -left-4 top-3 h-8 w-[120%] rounded-[100%] border-t border-cyan-200/70" />
      <div className="absolute -left-6 top-8 h-10 w-[130%] rounded-[100%] border-t border-sky-300/50" />
      <div className="absolute -left-2 top-14 h-10 w-[120%] rounded-[100%] border-t border-cyan-100/40" />
    </Plate>
  ),
  fog: () => (
    <Plate>
      <div className="absolute -left-6 top-2 h-16 w-24 rounded-full bg-slate-300/30 blur-xl" />
      <div className="absolute right-0 top-4 h-20 w-28 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute bottom-0 left-6 h-14 w-24 rounded-full bg-slate-400/25 blur-xl" />
    </Plate>
  ),
  static: () => (
    <Plate>
      <div
        className="absolute inset-0 animate-pulse opacity-80"
        style={{
          backgroundImage: `${speck("0.7px", 0.9)}, ${speck("0.7px", 0.35)}`,
          backgroundSize: "2px 2px, 3px 4px",
        }}
      />
    </Plate>
  ),
  floatingParticles: () => (
    <Plate>
      <span className="absolute left-[18%] top-[30%] h-2 w-2 animate-pulse rounded-full bg-cyan-200" />
      <span className="absolute left-[46%] top-[18%] h-1.5 w-1.5 rounded-full bg-white/80" />
      <span className="absolute left-[70%] top-[48%] h-2.5 w-2.5 animate-pulse rounded-full bg-sky-300/90" />
      <span className="absolute left-[32%] top-[62%] h-1.5 w-1.5 rounded-full bg-cyan-100/70" />
      <span className="absolute left-[82%] top-[24%] h-1 w-1 rounded-full bg-white/60" />
    </Plate>
  ),
  dynamicParticles: () => (
    <Plate>
      <span className="absolute left-[12%] top-[20%] h-1.5 w-1.5 animate-ping rounded-full bg-amber-300" />
      <span className="absolute left-[28%] top-[55%] h-1 w-1 rounded-full bg-cyan-200" />
      <span className="absolute left-[48%] top-[28%] h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      <span className="absolute left-[63%] top-[68%] h-1 w-1 rounded-full bg-amber-200" />
      <span className="absolute left-[78%] top-[22%] h-2 w-2 animate-pulse rounded-full bg-sky-300" />
      <span className="absolute left-[40%] top-[74%] h-1 w-1 rounded-full bg-white/70" />
      <span className="absolute left-[88%] top-[58%] h-1.5 w-1.5 rounded-full bg-cyan-100" />
    </Plate>
  ),
  triangleSwarm: () => (
    <Plate>
      {[
        "left-[14%] top-[22%] border-b-cyan-200",
        "left-[38%] top-[48%] border-b-white/80",
        "left-[58%] top-[18%] border-b-sky-300",
        "left-[74%] top-[56%] border-b-cyan-100",
        "left-[28%] top-[70%] border-b-white/60",
      ].map((place) => (
        <span
          key={place}
          className={cn(
            "absolute h-0 w-0 border-b-[10px] border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent",
            place
          )}
        />
      ))}
    </Plate>
  ),
  pulsingCircles: () => (
    <Plate>
      <span className="absolute left-[18%] top-[22%] h-8 w-8 animate-ping rounded-full border border-cyan-200/40" />
      <span className="absolute left-[22%] top-[28%] h-5 w-5 rounded-full border border-cyan-100/80" />
      <span className="absolute left-[52%] top-[40%] h-10 w-10 rounded-full border border-white/30" />
      <span className="absolute left-[58%] top-[48%] h-4 w-4 rounded-full border border-sky-200/80" />
    </Plate>
  ),
  digitalRain: () => (
    <Plate>
      {["12%", "28%", "46%", "63%", "78%", "90%"].map((left, index) => (
        <span
          key={left}
          className="absolute top-0 w-px animate-pulse bg-gradient-to-b from-transparent via-emerald-300 to-transparent"
          style={{ left, height: index % 2 === 0 ? "80%" : "55%", animationDelay: `${index * 120}ms` }}
        />
      ))}
    </Plate>
  ),
  gradientGrid: () => (
    <Plate>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
    </Plate>
  ),
  spokes: () => (
    <Plate>
      <div
        className="absolute inset-[-20%] opacity-90"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, rgba(251,191,36,0.95) 0deg 8deg, transparent 8deg 20deg)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#0b1220_72%)]" />
    </Plate>
  ),
};

export function NoiseSwatch({ type, className }: { type: string; className?: string }) {
  const known = NOISE_TYPES.find((noiseType) => noiseType === type);
  const Art = known ? noiseArt[known] : null;
  return (
    <div className={cn("h-full w-full", className)} aria-hidden>
      {Art ? <Art /> : <Plate />}
    </div>
  );
}
