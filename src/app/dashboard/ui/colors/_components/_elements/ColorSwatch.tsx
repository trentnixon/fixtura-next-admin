"use client";

import Code from "@/components/ui-library/foundation/Code";
import { cn } from "@/lib/utils";

/**
 * Color Swatch Component
 * Displays a single color with its name and value
 */
export default function ColorSwatch({
  name,
  color,
  textColor = "text-slate-900",
}: {
  name: string;
  color: string;
  textColor?: string;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "h-16 rounded-md mb-2 border border-slate-200 flex items-center justify-center transition-all hover:scale-105",
          color
        )}
      >
        <span
          className={cn("text-xs font-semibold px-2 py-1 rounded", textColor)}
        >
          {name}
        </span>
      </div>
      <Code className="text-xs text-center">{color.replace("bg-", "")}</Code>
    </div>
  );
}
