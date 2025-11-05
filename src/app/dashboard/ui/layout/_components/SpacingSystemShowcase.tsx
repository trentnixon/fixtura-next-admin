"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Spacing System Showcase Component
 *
 * Displays spacing system documentation and examples
 */
export default function SpacingSystemShowcase() {
  return (
    <SectionContainer
      title="Spacing Scale"
      description="Tailwind CSS spacing scale (0.25rem = 4px base unit)"
    >
      <div className="space-y-4">
        {[
          { size: "0", px: "0px", rem: "0rem" },
          { size: "1", px: "4px", rem: "0.25rem" },
          { size: "2", px: "8px", rem: "0.5rem" },
          { size: "4", px: "16px", rem: "1rem" },
          { size: "6", px: "24px", rem: "1.5rem" },
          { size: "8", px: "32px", rem: "2rem" },
          { size: "12", px: "48px", rem: "3rem" },
          { size: "16", px: "64px", rem: "4rem" },
        ].map(({ size, px, rem }) => (
          <div key={size} className="flex items-center gap-4">
            <div className="w-20 text-sm font-mono">{`p-${size}`}</div>
            <div
              className={`bg-blue-500 h-4`}
              style={{ width: `${parseInt(size) * 4}px` }}
            ></div>
            <div className="text-sm text-muted-foreground">
              {px} / {rem}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
