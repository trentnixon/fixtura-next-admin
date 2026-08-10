"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import StatusShowcase from "./_components/StatusShowcase";

export default function StatusPage() {
  return (
    <>
      <CategoryLabHeader categoryId="status" />
      <PageContainer padding="xs" spacing="lg">
        <StatusShowcase />
      </PageContainer>
    </>
  );
}
