"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import OverlaysShowcase from "./_components/OverlaysShowcase";

export default function OverlaysPage() {
  return (
    <>
      <CategoryLabHeader categoryId="overlays" />
      <PageContainer padding="xs" spacing="lg">
        <OverlaysShowcase />
      </PageContainer>
    </>
  );
}
