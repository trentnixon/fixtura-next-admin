"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SpacingSystemShowcase from "./_components/SpacingSystemShowcase";
import LayoutShowcase from "./_components/LayoutShowcase";

/**
 * Layout Category Page
 *
 * Containers, Grids, Flex, Spacing components
 */
export default function LayoutPage() {
  return (
    <>
      <CreatePageTitle
        title="Layout"
        byLine="Containers, Grids, Flex, Spacing"
        byLineBottom="Layout and structural components"
      />

      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Layout Components"
          description="Container components, grids, flex layouts, and dividers"
        >
          <LayoutShowcase />
        </SectionContainer>

        <SectionContainer
          title="Spacing System"
          description="Tailwind CSS spacing scale documentation"
        >
          <SpacingSystemShowcase />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
