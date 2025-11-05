"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import Code from "@/components/ui-library/foundation/Code";

/**
 * Code Component Showcase
 *
 * Displays examples of Code component (inline and block)
 */
export default function CodeComponentShowcase() {
  return (
    <SectionContainer
      title="Code Component"
      description="Inline and block code display"
    >
      <div className="space-y-4">
        <div>
          <SubsectionTitle>Inline Code</SubsectionTitle>
          <p className="mt-2">
            Use <Code>const x = 1</Code> for inline code snippets.
          </p>
        </div>

        <div>
          <SubsectionTitle>Code Block</SubsectionTitle>
          <Code variant="block" className="mt-2">
            {`function example() {
  return "Hello World";
}`}
          </Code>
        </div>
      </div>
    </SectionContainer>
  );
}
