"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import PageTitleVariationsShowcase from "./_components/PageTitleVariationsShowcase";

export default function PageTitleFeaturePage() {
  return (
    <>
      <CreatePageTitle
        title="Page Title"
        byLine="Feature Lab"
        byLineBottom="Variations built on type.title.* from the component lab"
      />
      <PageContainer padding="xs" spacing="lg">
        <PageTitleVariationsShowcase />
      </PageContainer>
    </>
  );
}
