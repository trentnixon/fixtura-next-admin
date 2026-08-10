"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import NavigationShowcase from "./_components/NavigationShowcase";

export default function NavigationPage() {
  return (
    <>
      <CategoryLabHeader categoryId="navigation" />
      <PageContainer padding="xs" spacing="lg">
        <NavigationShowcase />
      </PageContainer>
    </>
  );
}
