"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Blockquote from "@/components/ui-library/foundation/Blockquote";

/**
 * Blockquote Component Showcase
 *
 * Displays examples of Blockquote component
 */
export default function BlockquoteComponentShowcase() {
  return (
    <SectionContainer
      title="Blockquote Component"
      description="Styled quotes and citations"
    >
      <div className="space-y-4">
        <Blockquote>
          The best way to predict the future is to create it.
        </Blockquote>
        <Blockquote author="Peter Drucker">
          Management is doing things right; leadership is doing the right
          things.
        </Blockquote>
      </div>
    </SectionContainer>
  );
}

