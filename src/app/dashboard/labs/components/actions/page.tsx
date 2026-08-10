"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import ButtonShowcase from "./_components/ButtonShowcase";

export default function ActionsPage() {
  return (
    <>
      <CategoryLabHeader categoryId="actions" />
      <PageContainer padding="xs" spacing="lg">
        <ButtonShowcase />
      </PageContainer>
    </>
  );
}
