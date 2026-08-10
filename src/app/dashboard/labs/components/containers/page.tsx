"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import ContainersShowcase from "./_components/ContainersShowcase";

export default function ContainersPage() {
  return (
    <>
      <CategoryLabHeader
        categoryId="containers"
        byLineBottom="Div-based surfaces with titles, bylines, content regions, and footers"
      />
      <PageContainer padding="xs" spacing="lg">
        <ContainersShowcase />
      </PageContainer>
    </>
  );
}
