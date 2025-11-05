"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Subtitle, H2, SubsectionTitle } from "@/components/type/titles";
import CodeExample from "./CodeExample";

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
            <div className="mt-6">
              <CodeExample
                code={`import { Subtitle } from "@/components/type/titles";

<Subtitle>Subtitle Heading</Subtitle>`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>H2</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-xl</span>
            </div>
            <H2>H2 Heading</H2>
            <div className="mt-6">
              <CodeExample
                code={`import { H2 } from "@/components/type/titles";

<H2>H2 Heading</H2>`}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
