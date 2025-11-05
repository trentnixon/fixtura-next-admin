"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import TypographyShowcase from "./_components/TypographyShowcase";
import TitlesShowcase from "./_components/TitlesShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

/**
 * Type Category Page
 *
 * Typography and text components
 */
export default function TypePage() {
  return (
    <>
      <CreatePageTitle
        title="Type"
        byLine="Typography & Text Components"
        byLineBottom="Titles, Text, Code, Links, Paragraphs, Blockquotes"
      />
      <PageContainer padding="xs" spacing="lg">
        <TitlesShowcase />
        <TypographyShowcase />
      </PageContainer>
    </>
  );
}
