"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import DataDisplayShowcase from "./_components/DataDisplayShowcase";

export default function DataPage() {
  return (
    <>
      <CategoryLabHeader categoryId="data" />
      <PageContainer padding="xs" spacing="lg">
        <DataDisplayShowcase />
      </PageContainer>
    </>
  );
}
