"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import TypographyShowcase from "./_components/TypographyShowcase";
import TitlesShowcase from "./_components/TitlesShowcase";

export default function TypePage() {
  return (
    <>
      <CategoryLabHeader
        categoryId="type"
        byLineBottom="Titles, text, code, links, paragraphs, blockquotes"
      />
      <PageContainer padding="xs" spacing="lg">
        <TitlesShowcase />
        <TypographyShowcase />
      </PageContainer>
    </>
  );
}
