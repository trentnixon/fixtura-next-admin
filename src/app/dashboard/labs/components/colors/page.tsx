"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import ColorSystemShowcase from "./_components/ColorSystemShowcase";

export default function ColorsPage() {
  return (
    <>
      <CategoryLabHeader categoryId="colors" />
      <PageContainer padding="xs" spacing="lg">
        <ColorSystemShowcase />
      </PageContainer>
    </>
  );
}
