"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import LayoutsShowcase from "./_components/LayoutsShowcase";

export default function LayoutsPage() {
  return (
    <>
      <CategoryLabHeader categoryId="layouts" />
      <PageContainer padding="xs" spacing="lg">
        <LayoutsShowcase />
      </PageContainer>
    </>
  );
}
