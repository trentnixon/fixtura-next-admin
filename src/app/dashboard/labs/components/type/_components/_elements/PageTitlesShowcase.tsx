"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Title, H1, SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

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
              <SubsectionTitle>Title</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-3xl</span>
            </div>
            <Title>Main Page Title</Title>
            <ComponentRef
              token={TYPE_TOKENS.title.page}
              note="alias: PageTitle"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <SubsectionTitle>H1</SubsectionTitle>
              <span className="text-xs text-muted-foreground">text-2xl</span>
            </div>
            <H1>Alternative H1 Heading</H1>
            <ComponentRef token={TYPE_TOKENS.title.h1} />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
