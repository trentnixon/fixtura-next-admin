"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Paragraph from "@/components/ui-library/foundation/Paragraph";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

/**
 * Paragraph Component Showcase
 *
 * Displays examples of Paragraph component with different sizes
 */
export default function ParagraphComponentShowcase() {
  return (
    <SectionContainer
      title="Paragraph Component"
      description="Consistent paragraph styling"
    >
      <div className="space-y-6">
        <div>
          <Paragraph>
            This is a default paragraph. It has consistent spacing and styling
            for body text throughout the application.
          </Paragraph>
          <ComponentRef token={TYPE_TOKENS.paragraph.default} />
        </div>
        <div>
          <Paragraph size="small">
            This is a small paragraph for secondary information or captions.
          </Paragraph>
          <ComponentRef token={TYPE_TOKENS.paragraph.small} />
        </div>
        <div>
          <Paragraph size="large">
            This is a large paragraph for emphasis or important content.
          </Paragraph>
          <ComponentRef token={TYPE_TOKENS.paragraph.large} />
        </div>
      </div>
    </SectionContainer>
  );
}
