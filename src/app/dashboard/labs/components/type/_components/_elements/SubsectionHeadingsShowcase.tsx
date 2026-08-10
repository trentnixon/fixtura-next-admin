"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle, H4 } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

/**
 * Subsection Headings Showcase
 *
 * Displays examples of subsection heading components
 */
export default function SubsectionHeadingsShowcase() {
  return (
    <SectionContainer
      title="Subsection Headings"
      description="Headings for nested sections and subsections"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>SubsectionTitle</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-base</span>
            </div>
            <SubsectionTitle>Subsection Title</SubsectionTitle>
            <ComponentRef token={TYPE_TOKENS.title.subsection} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>H4</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-base</span>
            </div>
            <H4>H4 Heading</H4>
            <ComponentRef token={TYPE_TOKENS.title.h4} />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
