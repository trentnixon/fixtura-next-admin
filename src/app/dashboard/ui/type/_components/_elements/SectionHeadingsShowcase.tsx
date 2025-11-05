"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SectionTitle, H3, SubsectionTitle } from "@/components/type/titles";
import CodeExample from "./CodeExample";

/**
 * Section Headings Showcase
 *
 * Displays examples of section heading components
 */
export default function SectionHeadingsShowcase() {
  return (
    <SectionContainer
      title="Section Headings"
      description="Headings for major page sections"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>SectionTitle</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-lg</span>
            </div>
            <SectionTitle>Section Title</SectionTitle>
            <div className="mt-6">
              <CodeExample
                code={`import { SectionTitle } from "@/components/type/titles";

<SectionTitle>Section Title</SectionTitle>`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>H3</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-lg</span>
            </div>
            <H3>H3 Heading</H3>
            <div className="mt-6">
              <CodeExample
                code={`import { H3 } from "@/components/type/titles";

<H3>H3 Heading</H3>`}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
