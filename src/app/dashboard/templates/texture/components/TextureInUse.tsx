import { cn } from "@/lib/utils";

export function TextureInUse({
  src,
  fit,
  color,
  opacity,
}: {
  src: string;
  fit: "cover" | "contain";
  color: string;
  opacity: number;
}) {
  const framed = fit === "cover";
  return (
    <div className={cn("relative overflow-hidden", framed ? "h-full w-full" : "mx-auto inline-block max-w-full")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={cn(framed ? "h-full w-full object-cover" : "max-h-[70vh] max-w-full object-contain")}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: color, opacity, mixBlendMode: "multiply" }}
      />
    </div>
  );
}
