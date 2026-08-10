"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import UtilitiesShowcase from "./_components/UtilitiesShowcase";

export default function UtilitiesPage() {
  return (
    <>
      <CategoryLabHeader categoryId="utilities" />
      <PageContainer padding="xs" spacing="lg">
        <UtilitiesShowcase />
      </PageContainer>
    </>
  );
}
