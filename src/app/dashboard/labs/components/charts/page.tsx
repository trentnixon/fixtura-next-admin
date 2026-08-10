"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import ChartsShowcase from "./_components/ChartsShowcase";

export default function ChartsPage() {
  return (
    <>
      <CategoryLabHeader categoryId="charts" />
      <PageContainer padding="xs" spacing="lg">
        <ChartsShowcase />
      </PageContainer>
    </>
  );
}
