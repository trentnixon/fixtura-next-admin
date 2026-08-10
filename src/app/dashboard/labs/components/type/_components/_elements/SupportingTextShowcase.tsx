"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Label, ByLine, SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

/**
 * Supporting Text Showcase
 *
 * Displays examples of label and byline components
 */
export default function SupportingTextShowcase() {
  return (
    <SectionContainer
      title="Supporting Text"
      description="Labels, captions, and metadata text"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>Label</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-sm</span>
            </div>
            <Label>Form Label</Label>
            <ComponentRef token={TYPE_TOKENS.title.label} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>ByLine</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-sm</span>
            </div>
            <ByLine>Last updated: January 2024</ByLine>
            <ComponentRef token={TYPE_TOKENS.title.byline} />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
