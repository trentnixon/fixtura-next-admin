"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import TablesShowcase from "./_components/TablesShowcase";

export default function TablesPage() {
  return (
    <>
      <CategoryLabHeader categoryId="tables" />
      <PageContainer padding="xs" spacing="lg">
        <TablesShowcase />
      </PageContainer>
    </>
  );
}
