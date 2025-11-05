"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Title,
  PageTitle,
  H1,
  SubsectionTitle,
} from "@/components/type/titles";
import CodeExample from "./CodeExample";

/**
 * Page Titles Showcase
 *
 * Displays examples of main page heading components
 */
export default function PageTitlesShowcase() {
  return (
    <SectionContainer
      title="Page Titles"
      description="Main page headings - largest and most prominent"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>Title / PageTitle</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-3xl</span>
            </div>
            <Title>Main Page Title</Title>
            <PageTitle className="mt-2">PageTitle (alias for Title)</PageTitle>
            <div className="mt-6">
              <CodeExample
                code={`import { Title, PageTitle } from "@/components/type/titles";

// Title and PageTitle are aliases - use either one
<Title>Main Page Title</Title>
<PageTitle>Alternative Page Title</PageTitle>`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>H1</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-2xl</span>
            </div>
            <H1>Alternative H1 Heading</H1>
            <div className="mt-6">
              <CodeExample
                code={`import { H1 } from "@/components/type/titles";

<H1>Alternative H1 Heading</H1>`}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
