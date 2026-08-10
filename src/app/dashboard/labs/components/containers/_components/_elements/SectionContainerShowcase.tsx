"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { CONTAINER_TOKENS } from "./containerTokens";

/**
 * SectionContainer showcase — card-based section grouping
 */
export default function SectionContainerShowcase() {
  return (
    <SectionContainer
      title="SectionContainer"
      description="Card-based sections — use as a child of PageContainer"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant default</span>
          </div>
          <SectionContainer
            title="Example Section"
            description="Card-based container with header and content"
          >
            <p className="text-sm text-muted-foreground">
              SectionContainer groups related content with border, background,
              and a titled header.
            </p>
          </SectionContainer>
          <ComponentRef token={CONTAINER_TOKENS.section.default} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Compact</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant compact</span>
          </div>
          <SectionContainer
            title="Compact Section"
            description="Reduced header and content padding"
            variant="compact"
          >
            <p className="text-sm text-muted-foreground">
              Use compact variant when vertical space is limited.
            </p>
          </SectionContainer>
          <ComponentRef token={CONTAINER_TOKENS.section.compact} />
        </div>
      </div>
    </SectionContainer>
  );
}
