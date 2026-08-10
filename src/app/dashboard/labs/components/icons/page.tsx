"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import IconSystemShowcase from "./_components/IconSystemShowcase";

export default function IconsPage() {
  return (
    <>
      <CategoryLabHeader categoryId="icons" />
      <PageContainer padding="xs" spacing="lg">
        <IconSystemShowcase />
      </PageContainer>
    </>
  );
}
