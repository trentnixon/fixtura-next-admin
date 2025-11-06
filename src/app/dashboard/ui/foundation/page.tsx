"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import TypographyShowcase from "../type/_components/TypographyShowcase";
import ColorSystemShowcase from "../colors/_components/ColorSystemShowcase";
import IconSystemShowcase from "../icons/_components/IconSystemShowcase";
import SpacingSystemShowcase from "../layout/_components/SpacingSystemShowcase";

/**
 * Foundation Category Page
 *
 * Typography, Colors, Icons, Spacing components
 */
export default function FoundationPage() {
  return (
    <>
      <CreatePageTitle
        title="Foundation"
        byLine="Typography, Colors, Icons, Spacing"
        byLineBottom="Core design system foundations"
      />

      {/* Typography */}
      <SectionWrapper spacing="lg" title="Typography">
        <TypographyShowcase />
      </SectionWrapper>

      {/* Color System */}
      <SectionWrapper spacing="lg" title="Color System">
        <ColorSystemShowcase />
      </SectionWrapper>

      {/* Icon System */}
      <SectionWrapper spacing="lg" title="Icon System">
        <IconSystemShowcase />
      </SectionWrapper>

      {/* Spacing System */}
      <SectionWrapper spacing="lg" title="Spacing System">
        <SpacingSystemShowcase />
      </SectionWrapper>
    </>
  );
}
