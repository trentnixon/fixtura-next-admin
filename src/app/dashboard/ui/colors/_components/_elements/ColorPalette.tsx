"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ColorSwatch from "./ColorSwatch";

/**
 * Color Palette Display
 * Shows a full color scale from 50-950
 */
export default function ColorPalette({
  name,
  colors,
  description,
  icon: Icon,
}: {
  name: string;
  colors: string[];
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  return (
    <SectionContainer title={name} description={description}>
      {Icon && (
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3">
        {shades.map((shade) => {
          const colorClass = colors.find((c) => c.includes(`-${shade}`)) || "";
          const textColor = shade <= 400 ? "text-slate-900" : "text-white";
          return (
            <ColorSwatch
              key={shade}
              name={shade.toString()}
              color={colorClass}
              textColor={textColor}
            />
          );
        })}
      </div>
    </SectionContainer>
  );
}
