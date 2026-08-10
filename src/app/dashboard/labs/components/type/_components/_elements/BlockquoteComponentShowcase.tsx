"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Blockquote from "@/components/ui-library/foundation/Blockquote";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

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
      <div className="space-y-6">
        <div>
          <Blockquote>
            The best way to predict the future is to create it.
          </Blockquote>
          <ComponentRef token={TYPE_TOKENS.blockquote.default} />
        </div>
        <div>
          <Blockquote author="Peter Drucker">
            Management is doing things right; leadership is doing the right
            things.
          </Blockquote>
          <ComponentRef token={TYPE_TOKENS.blockquote.author} />
        </div>
      </div>
    </SectionContainer>
  );
}
