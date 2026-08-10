"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ComponentRef from "./ComponentRef";
import { CONTAINER_TOKENS } from "./containerTokens";

/**
 * Container hierarchy showcase — nested Page → Section → Element pattern
 */
export default function ContainerHierarchyShowcase() {
  return (
    <SectionContainer
      title="Container Hierarchy"
      description="Recommended nesting: PageContainer → SectionContainer → ElementContainer"
    >
      <PageContainer
        padding="md"
        spacing="md"
        className="border border-dashed border-slate-300 rounded-md"
      >
        <SectionContainer
          title="Section within Page"
          description="SectionContainer groups related content"
          variant="compact"
        >
          <ElementContainer
            title="Element within Section"
            subtitle="ElementContainer wraps individual items"
            border
            padding="md"
            variant="light"
          >
            <p className="text-sm text-muted-foreground">
              Follow this hierarchy for consistent page structure across the
              admin app.
            </p>
          </ElementContainer>
        </SectionContainer>
      </PageContainer>
      <ComponentRef
        token={CONTAINER_TOKENS.hierarchy.standard}
        note="PageContainer → SectionContainer → ElementContainer"
      />
    </SectionContainer>
  );
}
