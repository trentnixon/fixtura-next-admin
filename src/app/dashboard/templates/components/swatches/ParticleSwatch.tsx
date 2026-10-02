import { ReactNode } from "react";
import { PARTICLE_TYPES, ParticleType } from "@/types/template-particle";
import { cn } from "@/lib/utils";

function Plate({ children }: { children?: ReactNode }) {
  return <div className="relative h-full w-full overflow-hidden bg-[#0b1220]">{children}</div>;
}

const particleArt: Record<ParticleType, () => ReactNode> = {
  lines: () => (
    <Plate>
      {["18%", "38%", "58%", "76%"].map((top) => (
        <span
          key={top}
          className="absolute left-[-10%] h-px w-[70%] -rotate-12 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{ top }}
        />
      ))}
    </Plate>
  ),
  dots: () => (
    <Plate>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1.5px, transparent 1.8px)",
          backgroundSize: "14px 14px",
        }}
      />
    </Plate>
  ),
  bubbles: () => (
    <Plate>
      <span className="absolute left-[16%] top-[24%] h-8 w-8 rounded-full border border-white/50 bg-white/10" />
      <span className="absolute left-[48%] top-[18%] h-5 w-5 rounded-full border border-cyan-100/60 bg-cyan-100/10" />
      <span className="absolute left-[66%] top-[48%] h-10 w-10 rounded-full border border-white/40 bg-white/5" />
    </Plate>
  ),
  snow: () => (
    <Plate>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.95) 0.8px, transparent 1px)",
          backgroundSize: "10px 16px",
        }}
      />
    </Plate>
  ),
  confetti: () => (
    <Plate>
      <span className="absolute left-[18%] top-[22%] h-2 w-3 rotate-12 bg-amber-300" />
      <span className="absolute left-[40%] top-[48%] h-2 w-2 -rotate-6 bg-cyan-300" />
      <span className="absolute left-[62%] top-[20%] h-3 w-1.5 rotate-45 bg-rose-300" />
      <span className="absolute left-[74%] top-[58%] h-2 w-3 -rotate-12 bg-emerald-300" />
      <span className="absolute left-[30%] top-[70%] h-1.5 w-3 rotate-6 bg-white" />
    </Plate>
  ),
};

export function ParticleSwatch({ type, className }: { type: string; className?: string }) {
  const known = PARTICLE_TYPES.find((particleType) => particleType === type);
  const Art = known ? particleArt[known] : null;
  return (
    <div className={cn("h-full w-full", className)} aria-hidden>
      {Art ? <Art /> : <Plate />}
    </div>
  );
}
