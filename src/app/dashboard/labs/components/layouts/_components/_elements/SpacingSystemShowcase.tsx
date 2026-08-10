"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { LAYOUT_TOKENS } from "./layoutTokens";

const SPACING_SCALE = [
  { size: "0", px: "0px", rem: "0rem", token: LAYOUT_TOKENS.spacing.p0 },
  { size: "1", px: "4px", rem: "0.25rem", token: LAYOUT_TOKENS.spacing.p1 },
  { size: "2", px: "8px", rem: "0.5rem", token: LAYOUT_TOKENS.spacing.p2 },
  { size: "4", px: "16px", rem: "1rem", token: LAYOUT_TOKENS.spacing.p4 },
  { size: "6", px: "24px", rem: "1.5rem", token: LAYOUT_TOKENS.spacing.p6 },
  { size: "8", px: "32px", rem: "2rem", token: LAYOUT_TOKENS.spacing.p8 },
  { size: "12", px: "48px", rem: "3rem", token: LAYOUT_TOKENS.spacing.p12 },
  { size: "16", px: "64px", rem: "4rem", token: LAYOUT_TOKENS.spacing.p16 },
] as const;

/**
 * Spacing scale showcase — Tailwind spacing reference
 */
export default function SpacingSystemShowcase() {
  return (
    <SectionContainer
      title="Spacing Scale"
      description="Tailwind CSS spacing scale (0.25rem = 4px base unit)"
    >
      <div className="space-y-8">
        {SPACING_SCALE.map(({ size, px, rem, token }) => (
          <div key={size}>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>{`p-${size}`}</SubsectionTitle>
              <span className="text-xs text-muted-foreground">
                {px} / {rem}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="bg-blue-500 h-4 rounded-sm"
                style={{ width: `${parseInt(size) * 4}px` }}
              />
              <span className="text-sm text-muted-foreground">
                Visual width reference
              </span>
            </div>
            <ComponentRef token={token} />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
