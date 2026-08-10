"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Subtitle, H2, SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

/**
 * Secondary Headings Showcase
 *
 * Displays examples of subheading components
 */
export default function SecondaryHeadingsShowcase() {
  return (
    <SectionContainer
      title="Secondary Headings"
      description="Subheadings and section introductions"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>Subtitle</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-xl</span>
            </div>
            <Subtitle>Subtitle Heading</Subtitle>
            <ComponentRef token={TYPE_TOKENS.title.subtitle} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>H2</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-xl</span>
            </div>
            <H2>H2 Heading</H2>
            <ComponentRef token={TYPE_TOKENS.title.h2} />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
