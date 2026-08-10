"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import FormsShowcase from "./_components/FormsShowcase";

export default function FormsPage() {
  return (
    <>
      <CategoryLabHeader categoryId="forms" />
      <PageContainer padding="xs" spacing="lg">
        <FormsShowcase />
      </PageContainer>
    </>
  );
}
