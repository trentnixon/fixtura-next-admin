import { cn } from "@/lib/utils";
import { gradientBackground } from "./gradientPreview";

export function GradientSwatch({
  type,
  direction,
  className,
}: {
  type: string;
  direction: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("h-full w-full bg-[#0b1220]", className)}
      style={{ backgroundImage: gradientBackground(type, direction) }}
    />
  );
}
